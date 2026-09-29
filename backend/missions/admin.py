from django.contrib import admin

from .models import MissionRun, MissionLog, LearningTopic, QuizQuestion, QuizAttempt


class QuizQuestionInline(admin.TabularInline):
    model = QuizQuestion
    extra = 0


@admin.register(LearningTopic)
class LearningTopicAdmin(admin.ModelAdmin):
    list_display = ["title", "topic", "youtube_url"]
    inlines = [QuizQuestionInline]


@admin.register(MissionRun)
class MissionRunAdmin(admin.ModelAdmin):
    list_display = ["user", "mission_type", "status", "mission_progress", "created_at"]
    list_filter = ["mission_type", "status"]


admin.site.register(MissionLog)
admin.site.register(QuizAttempt)
