from django.urls import path

from . import views

urlpatterns = [
    # Auth
    path("auth/signup/", views.SignUpView.as_view(), name="signup"),
    path("auth/login/", views.LoginView.as_view(), name="login"),
    path("auth/logout/", views.LogoutView.as_view(), name="logout"),
    path("auth/me/", views.MeView.as_view(), name="me"),

    # Missions
    path("missions/", views.MissionListCreateView.as_view(), name="mission-list-create"),
    path("missions/<int:pk>/", views.MissionDetailView.as_view(), name="mission-detail"),
    path("missions/<int:pk>/allocate-resources/", views.ResourceAllocationView.as_view(), name="mission-allocate"),

    # Learning + quiz
    path("learning-topics/", views.LearningTopicListView.as_view(), name="topic-list"),
    path("learning-topics/<str:topic>/", views.LearningTopicDetailView.as_view(), name="topic-detail"),
    path(
        "missions/<int:mission_id>/quiz/<str:topic_code>/submit/",
        views.QuizSubmitView.as_view(),
        name="quiz-submit",
    ),

    # NASA data
    path("nasa/apod/", views.NasaApodView.as_view(), name="nasa-apod"),
]
