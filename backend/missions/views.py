import random

import requests
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import generics, status, permissions
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import MissionRun, MissionLog, LearningTopic, QuizQuestion, QuizAttempt, TOPIC_CHOICES
from .serializers import (
    SignUpSerializer, UserSerializer, MissionRunSerializer, ResourceAllocationSerializer,
    LearningTopicSerializer, QuizSubmitSerializer, QuizAttemptSerializer,
)


# ---------------------------------------------------------------------------
# Auth: sign up / log in / log out / current user
# ---------------------------------------------------------------------------
class SignUpView(generics.CreateAPIView):
    serializer_class = SignUpSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {"token": token.key, "user": UserSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "")
        password = request.data.get("password", "")
        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data})


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


# ---------------------------------------------------------------------------
# Missions: create (mission selection + prep), resource allocation, dashboard
# ---------------------------------------------------------------------------
class MissionListCreateView(generics.ListCreateAPIView):
    serializer_class = MissionRunSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MissionRun.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        mission = serializer.save(user=self.request.user)
        MissionLog.objects.create(mission=mission, message="Mission created. Awaiting resource allocation.")


class MissionDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = MissionRunSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MissionRun.objects.filter(user=self.request.user)


class ResourceAllocationView(APIView):
    """Step 5 of the brief — set power / life support / radiation / food units."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            mission = MissionRun.objects.get(pk=pk, user=request.user)
        except MissionRun.DoesNotExist:
            return Response({"detail": "Mission not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ResourceAllocationSerializer(data=request.data, context={"mission": mission})
        serializer.is_valid(raise_exception=True)

        for field, value in serializer.validated_data.items():
            setattr(mission, field, value)
        mission.status = "ACTIVE"
        mission.mission_progress = 10
        mission.save()
        MissionLog.objects.create(mission=mission, message="Resources allocated. Mission is now active.")
        return Response(MissionRunSerializer(mission).data)


# ---------------------------------------------------------------------------
# Learning content + quiz (step 6) — one topic per resource area
# ---------------------------------------------------------------------------
class LearningTopicListView(generics.ListAPIView):
    """Returns the 4 topics (power / life support / radiation / food) with their videos & quiz."""

    queryset = LearningTopic.objects.prefetch_related("questions").all()
    serializer_class = LearningTopicSerializer
    permission_classes = [permissions.IsAuthenticated]


class LearningTopicDetailView(generics.RetrieveAPIView):
    queryset = LearningTopic.objects.prefetch_related("questions").all()
    serializer_class = LearningTopicSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "topic"


class QuizSubmitView(APIView):
    """
    Grades a 5-question quiz for one topic. Passing (score >= 3) advances the
    mission; failing lets the user try again, per the brief's step 6.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, mission_id, topic_code):
        try:
            mission = MissionRun.objects.get(pk=mission_id, user=request.user)
            learning_topic = LearningTopic.objects.get(topic=topic_code)
        except (MissionRun.DoesNotExist, LearningTopic.DoesNotExist):
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = QuizSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        answers = serializer.validated_data["answers"]

        questions = learning_topic.questions.all()
        score = sum(
            1 for q in questions
            if answers.get(str(q.id)) == q.correct_choice
        )
        passed = score >= 3

        attempt = QuizAttempt.objects.create(
            user=request.user, mission=mission, topic=learning_topic, score=score, passed=passed,
        )

        if passed:
            mission.mission_progress = min(100, mission.mission_progress + 22)
            if mission.mission_progress >= 100:
                mission.status = "COMPLETE"
            mission.save()
            MissionLog.objects.create(
                mission=mission,
                message=f"Passed {learning_topic.title} quiz ({score}/5). Mission progress {mission.mission_progress}%.",
            )
        else:
            MissionLog.objects.create(
                mission=mission,
                message=f"Scored {score}/5 on {learning_topic.title} quiz — needs 3 to pass. Try again.",
            )

        return Response(
            {
                "score": score,
                "passed": passed,
                "mission_progress": mission.mission_progress,
                "attempt": QuizAttemptSerializer(attempt).data,
            }
        )


# ---------------------------------------------------------------------------
# NASA API proxy — keeps the API key server-side, never shipped to the browser
# ---------------------------------------------------------------------------
class NasaApodView(APIView):
    """
    Astronomy Picture of the Day — https://api.nasa.gov/ — used to add a real
    NASA data point to the dashboard / learn pages.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            resp = requests.get(
                "https://api.nasa.gov/planetary/apod",
                params={"api_key": settings.NASA_API_KEY},
                timeout=8,
            )
            resp.raise_for_status()
            return Response(resp.json())
        except requests.RequestException as exc:
            return Response({"detail": f"NASA API request failed: {exc}"}, status=status.HTTP_502_BAD_GATEWAY)
