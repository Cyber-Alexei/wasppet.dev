# Generated by Django 5.1 on 2024-10-18 00:16

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0029_alter_comment_updated_at'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='downvotes_count',
        ),
        migrations.RemoveField(
            model_name='comment',
            name='upvotes_count',
        ),
        migrations.AddField(
            model_name='comment',
            name='users_who_vote_down',
            field=models.ManyToManyField(blank=True, related_name='down_comments', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='comment',
            name='users_who_vote_up',
            field=models.ManyToManyField(blank=True, related_name='up_comments', to=settings.AUTH_USER_MODEL),
        ),
    ]
