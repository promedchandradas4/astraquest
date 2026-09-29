from django.contrib.auth.models import User
from django.db import models

MISSION_TYPE_CHOICES = [
    ("MOON", "Moon Mission"),
    ("MARS", "Mars Mission"),
]

OBJECTIVE_CHOICES = [
    ("SURVIVE", "Survive"),
    ("RESEARCH", "Research"),
    ("FOOD_PRODUCTION", "Food Production"),
]

TOPIC_CHOICES = [
    ("POWER", "Power"),
    ("LIFE_SUPPORT", "Life Support"),
    ("RADIATION_SHIELDING", "Radiation Shielding"),
    ("FOOD", "Food Production"),
]


class MissionRun(models.Model):
    """A single mission a user has configured and is running (Moon or Mars)."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="missions")
    mission_type = models.CharField(max_length=10, choices=MISSION_TYPE_CHOICES)

    crew_size = models.PositiveIntegerField(default=4)
    duration_days = models.PositiveIntegerField(default=7)  # 7/14/21 (moon) or 30/45/60 (mars)
    total_weight_kg = models.PositiveIntegerField(default=1000)  # max 1200 kg per brief
    objectives = models.JSONField(default=list)  # subset of OBJECTIVE_CHOICES

    # Resource allocation — units out of total_units, sums should equal total_units
    total_units = models.PositiveIntegerField(default=1000)
    power_units = models.PositiveIntegerField(default=250)
    life_support_units = models.PositiveIntegerField(default=250)
    radiation_shielding_units = models.PositiveIntegerField(default=250)
    food_units = models.PositiveIntegerField(default=250)

    status = models.CharField(
        max_length=20,
        choices=[("PREPARING", "Preparing"), ("ACTIVE", "Active"), ("COMPLETE", "Complete"), ("FAILED", "Failed")],
        default="PREPARING",
    )
    mission_progress = models.PositiveIntegerField(default=0)  # 0-100
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} — {self.get_mission_type_display()} ({self.status})"


class MissionLog(models.Model):
    """Recent-logs feed shown on the dashboard."""

    mission = models.ForeignKey(MissionRun, on_delete=models.CASCADE, related_name="logs")
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class LearningTopic(models.Model):
    """One of the four resource topics — power, life support, radiation, food."""

    topic = models.CharField(max_length=30, choices=TOPIC_CHOICES, unique=True)
    title = models.CharField(max_length=200)
    article_summary = models.TextField()
    nasa_reference_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)

    def __str__(self):
        return self.title


class QuizQuestion(models.Model):
    topic = models.ForeignKey(LearningTopic, on_delete=models.CASCADE, related_name="questions")
    prompt = models.TextField()
    choice_a = models.CharField(max_length=255)
    choice_b = models.CharField(max_length=255)
    choice_c = models.CharField(max_length=255)
    choice_d = models.CharField(max_length=255)
    correct_choice = models.CharField(max_length=1, choices=[("A", "A"), ("B", "B"), ("C", "C"), ("D", "D")])
    explanation = models.TextField(blank=True)

    def __str__(self):
        return self.prompt[:60]


class QuizAttempt(models.Model):
    """Records a user's attempt at a topic's 5-question quiz."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="quiz_attempts")
    mission = models.ForeignKey(MissionRun, on_delete=models.CASCADE, related_name="quiz_attempts")
    topic = models.ForeignKey(LearningTopic, on_delete=models.CASCADE)
    score = models.PositiveIntegerField(default=0)  # correct out of 5
    passed = models.BooleanField(default=False)  # True if score >= 3
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
