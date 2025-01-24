from app.models import Skill, User, Snippet, Comment, Post, Notification
from rest_framework import serializers
from django.core.exceptions import ValidationError


# Skill
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"


# Snippet
class SnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snippet
        fields = "__all__"

# Comment
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"

# Post
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"

# Notification
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"


# User
class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)
    snippet_set = SnippetSerializer(many=True, required=False, read_only=True)
    post_set = PostSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username', 
            'first_name', 
            'last_name', 
            'email', 
            'is_active', 
            'is_staff', 
            'last_login',
            'date_joined',
            'complete_name',
            'job_position',
            'birthday_date',
            'description',
            'avatar',
            'skills',
            'friends_list',
            'snippet_set',
            'post_set',
            'posts_ups_count',
        ]