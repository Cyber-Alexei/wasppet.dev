from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from rest_framework.authtoken.models import Token as Rest_Framework_Token
from django.conf import settings
from django.utils import timezone
import os
from django.utils.timezone import now
import random
from datetime import datetime


#-------------------------------------------------------


class Skill(models.Model):

    SKILLS_CATEGORY = [
        ("L", "Language"),
        ("T", "Technology"),
    ]

    name=models.CharField(
        max_length=30,
        blank=False,
        null=False,
        help_text="The name of the skill",
        error_messages={
            "max_length": "This name is too long",
            "blank": "The name can't be empty",
            "null": "The name can't be empty",
        }
    )
    category=models.CharField(
        max_length=50,
        choices=SKILLS_CATEGORY,
        blank=False,
        null=False,
        help_text="Choose if is a lenguage or technology",
        error_messages={
            "blank": "The category can't be empty",
            "null": "The category can't be empty",
        }
    )

    def __str__(self):
        return f"{self.name} - {self.category}"


#----------------------------------------------------------


class User(AbstractUser):

    def user_directory_path(instance, filename):
        # File will be uploaded to MEDIA_ROOT/user_<id>/<filename>
        timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
        return f'{instance.username}/profile-image{timestamp}.jpg'

    def default_avatar_selection():
        image_id = random.randint(1, 16)
        return f"default/{image_id}.jpg"

    # username
    # first_name
    # last_name
    # email
    # is_active
    # is_staff (default=False)
    # is_superuser (default=False)
    # last_login
    # date_joined

    complete_name=models.CharField(
        blank=True,
        null=True,
        max_length=100,
        help_text="The complete name",
        error_messages={
            "max_length": "This name is too long",
        }
    )

    job_position=models.CharField(
        blank=True,
        null=True,
        max_length=100,
        help_text="The job position in your current company",
        error_messages={
            "max_length": "This name is too long",
        }
    )
    birthday_date=models.DateField(
        blank=True,
        null=True,
        help_text="Define your birthday",
    )
    description=models.CharField(
        blank=True,
        null=True,
        max_length=500,
        help_text="Tell others about yourself",
        error_messages={
            "max_length": "Your description is too long"
        }
    )
    avatar=models.ImageField(
        upload_to=user_directory_path,
        help_text="Upload an image that represent you",
        default=default_avatar_selection
    )
    skills=models.CharField(
        null=True,
        blank=True,
        max_length=1000,
        default='',
        help_text="Choose your best skills",
    )
    friends_list=models.ManyToManyField(
        "self", 
        symmetrical=True,
        blank=True,
    )
    posts_ups_count=models.SmallIntegerField(
        default=0
    )

    def save(self, *args, **kwargs):
        self.username = self.username.lower()
        if not self.username.startswith("@"):
            self.username = "@" + self.username
        if not self.id:
            self.is_active = False
            if User.objects.filter(username=self.username).exists():
                raise ValidationError("This username is no longer available")
            if User.objects.filter(email=self.email).exists():
                raise ValidationError("This email already exists")
        if self.first_name or self.last_name:
            self.complete_name = f"{self.first_name if self.first_name else ''} {self.last_name if self.last_name else ''}".strip()
        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.username} - {self.email}"

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "is_active": self.is_active,
            "is_staff": self.is_staff,
            "is_superuser": self.is_superuser,
            "last_login": self.last_login,
            "date_joined": self.date_joined,
            "complete_name": self.complete_name,
            "job_position": self.job_position,
            "birthday_date": self.birthday_date,
            "description": self.description,
            "avatar": self.avatar.url if self.avatar else None,
            "skills": self.skills,
            "friends_list": list(self.friends_list.values_list('id', flat=True)),
            "snippet_set": list(self.snippet_set.values()),
            "post_set": list(self.post_set.values()),
            "posts_ups_count": self.posts_ups_count,
        }


#-----------------------------------------------------


class Snippet(models.Model):

    title=models.CharField(
        max_length=50,
        blank=False,
        null=False,
        help_text="Your snippet title",
        error_messages={
            "max_length": "Your title is too long",
            "blank": "The title can't be empty",
            "null": "The title can't be empty",
        }
    )
    description=models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Your snippet description",
        error_messages={
            "max_length": "Your description is too long",
            "blank": "Your description can't be empty",
            "null": "Your description can't be empty",
        }
    )
    user=models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        help_text="The snippet owner",
        error_messages={
            "blank": "The owner need to be specified",
            "null": "The owner need to be specified",
        }

    )
    code=models.TextField(
        max_length=90000,
        blank=False,
        null=False,
        help_text="Write your snippet here",
        error_messages={
            "max_length": "Your snippet is too long",
            "blank": "Your snippet can't be empty",
            "null": "Your snippet can't be empty",
        }
    )
    language=models.ForeignKey(
        Skill,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        limit_choices_to={"category": "L"},
        related_name="snippet_set_language",
        help_text="Choose the programming language used",
        error_messages={
            "blank": "You must specify a programming language",
            "null": "You must specify a programming language",
        }
    )
    language_name=models.JSONField(
        max_length=50,
        blank=True,
        null=True,
    )
    technology=models.ManyToManyField(
        Skill,
        limit_choices_to={"category": "T"},
        related_name="snippet_set_technology",
        help_text="Choose the programming technology used",
        blank=True,
    )
    technology_names=models.JSONField(
        max_length=200,
        blank=True,
        null=True,
    )
    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} - {self.title}"


#----------------------------------------------------------


class Post(models.Model):

    title=models.CharField(
        max_length=50,
        blank=False,
        null=False,
        help_text="Title of your post",
        error_messages={
            "max_length": "The title is too long",
            "blank": "The title can't be empty",
            "null": "The title can't be empty",
        }
    )
    user=models.ForeignKey(
        User,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        help_text="The owner of the post",
        error_messages={
            "blank": "The owner user must be specified",
            "null": "The owner user must be specified",
        }
    )
    snippets=models.ManyToManyField(
        Snippet,
        blank=True,
        help_text="Code to be posted",
        error_messages={
            "blank": "You need to add one snippet at least",
        }
    )
    # Create a method to build the post URL.
    # Method in the controller.
    share_url=models.CharField(
        blank=False,
        null=False,
        help_text="The post url",
        error_messages={
            "blank": "The post need a url for sharing",
            "null": "The post need a url for sharing",
        }
    )   
    languages=models.ManyToManyField(
        Skill,
        blank=True,
        limit_choices_to={"category": "L"},
        related_name="post_set_languages",
        help_text="The programming languages used in the post",
        error_messages={
            "blank": "At least one programming language need to be specified"
        }
    )
    languages_names=models.JSONField(
        max_length=500,
        blank=True,
        null=True,
    )
    technologies=models.ManyToManyField(
        Skill,
        blank=True,
        limit_choices_to={"category": "T"},
        related_name="post_set_technologies",
        help_text="The technologies used in the post",
    )
    technologies_names=models.JSONField(
        max_length=800,
        blank=True,
        null=True,
    )
    post=models.JSONField(
        default=dict, blank=False
    )
    users_who_comment=models.JSONField(
        blank=True,
        null=True,
    )
    users_who_vote_up=models.ManyToManyField(
        User,
        blank=True,
        related_name="users_up",
    )
    users_who_vote_down=models.ManyToManyField(
        User,
        blank=True,
        related_name="users_down",
    )
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=False)

    def __str__(self):
        return f"{self.user} {self.title}"


#-------------------------------------------------------


class Comment(models.Model):

    user=models.ForeignKey(
        User,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        help_text="The owner of the comment",
        error_messages={
            "blank": "The owner of the comment can't be empty",
            "null": "The owner of the comment can't be empty",
        }
    )
    post=models.ForeignKey(
        Post,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        help_text="The post of the comment",
        error_messages={
            "blank": "The post of the comment can't be empty",
            "null": "The post of the comment can't be empty",
        }
    )
    responses=models.ManyToManyField(
        "self",
        symmetrical=False,
        blank=True,
    )
    content=models.CharField(
        max_length=10000,
        blank=False,
        null=False,
        help_text="Write your comment here",
        error_messages={
            "blank": "Your comment can't be empty",
            "null": "Your comment can't be empty",
        }
    )
    users_who_vote_up=models.ManyToManyField(
        User,
        blank=True,
        related_name="up_comments",
    )
    users_who_vote_down=models.ManyToManyField(
        User,
        blank=True,
        related_name="down_comments",
    )
    created_at=models.DateTimeField(
        auto_now_add=True
    )
    updated_at=models.DateTimeField(
        auto_now=False
    )

    def __str__(self):
        return f"{self.user} - {self.post} - {self.content}"


# ------------------------------------------------


class Token(Rest_Framework_Token):

    def is_expired(self):
        expiration_date = self.created + settings.TOKEN_EXPIRATION_PERIOD
        return timezone.now() > expiration_date


# --------------------------------------------------


class Notification(models.Model):

    from_user=models.ForeignKey(
        User,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        related_name="notification_from_user_set",
        help_text="User who will generate the notification",
        error_messages={
            "blank": "This field can't be blank",
            "null": "This field can't be null",
        }
    )
    to_user=models.ForeignKey(
        User,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        related_name="notification_to_user_set",
        help_text="User who will generate the notification",
        error_messages={
            "blank": "This field can't be blank",
            "null": "This field can't be null",
        }
    )
    message=models.CharField(
        max_length=200,
        blank=False,
        null=False,
        help_text="The notification message",
        error_messages={
            "blank": "This field can't be blank",
            "null": "This field can't be null",
        }
    )
    url=models.CharField(
        max_length=500,
        blank=False,
        null=False,
        help_text="Relative url to the notification action",
        error_messages={
            "blank": "This field can't be blank",
            "null": "This field can't be null",
        }
    )
    viewed=models.BooleanField(
        default=False,
    )