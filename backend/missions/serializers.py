from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import MissionRun, MissionLog, LearningTopic, QuizQuestion, QuizAttempt


class SignUpSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["full_name", "email", "password", "confirm_password"]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        if User.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError({"email": "An account with this email already exists."})
        return attrs

    def create(self, validated_data):
        full_name = validated_data["full_name"].strip()
        first_name, _, last_name = full_name.partition(" ")
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=first_name,
            last_name=last_name,
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "email", "full_name"]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username


class MissionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MissionLog
        fields = ["id", "message", "created_at"]


class MissionRunSerializer(serializers.ModelSerializer):
    logs = MissionLogSerializer(many=True, read_only=True)

    class Meta:
        model = MissionRun
        fields = [
            "id", "mission_type", "crew_size", "duration_days", "total_weight_kg",
            "objectives", "total_units", "power_units", "life_support_units",
            "radiation_shielding_units", "food_units", "status", "mission_progress",
            "created_at", "updated_at", "logs",
        ]
        read_only_fields = ["id", "status", "mission_progress", "created_at", "updated_at", "logs"]

    def validate_total_weight_kg(self, value):
        if value > 1200:
            raise serializers.ValidationError("Total weight cannot exceed 1200 kg.")
        return value


class ResourceAllocationSerializer(serializers.Serializer):
    """Validates that the four resource sliders sum to total_units."""

    power_units = serializers.IntegerField(min_value=0)
    life_support_units = serializers.IntegerField(min_value=0)
    radiation_shielding_units = serializers.IntegerField(min_value=0)
    food_units = serializers.IntegerField(min_value=0)

    def validate(self, attrs):
        total = (
            attrs["power_units"] + attrs["life_support_units"]
            + attrs["radiation_shielding_units"] + attrs["food_units"]
        )
        mission = self.context["mission"]
        if total != mission.total_units:
            raise serializers.ValidationError(
                f"Allocated units ({total}) must equal total resources ({mission.total_units})."
            )
        return attrs


class QuizQuestionPublicSerializer(serializers.ModelSerializer):
    """Question shape sent to the frontend — correct_choice withheld until grading."""

    class Meta:
        model = QuizQuestion
        fields = ["id", "prompt", "choice_a", "choice_b", "choice_c", "choice_d"]


class LearningTopicSerializer(serializers.ModelSerializer):
    questions = QuizQuestionPublicSerializer(many=True, read_only=True)

    class Meta:
        model = LearningTopic
        fields = ["id", "topic", "title", "article_summary", "nasa_reference_url", "youtube_url", "questions"]


class QuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = ["id", "topic", "score", "passed", "created_at"]
        read_only_fields = fields


class QuizSubmitSerializer(serializers.Serializer):
    """answers: { question_id: 'A' | 'B' | 'C' | 'D', ... } for all 5 questions."""

    answers = serializers.DictField(child=serializers.ChoiceField(choices=["A", "B", "C", "D"]))
