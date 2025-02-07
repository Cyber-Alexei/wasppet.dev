# Generated by Django 5.1 on 2024-09-07 20:05

import app.models
import django.contrib.auth.models
import django.contrib.auth.validators
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('complete_name', models.CharField(error_messages={'max_length': 'This name is too long'}, max_length=100)),
                ('job_position', models.CharField(error_messages={'max_length': 'This name is too long'}, help_text='The job position in your current company', max_length=40)),
                ('birthday_date', models.DateField(blank=True, error_messages={'blank': "Your birthdate can't be empty", 'null': "Your birthdate can't be empty"}, help_text='Define your birthday', null=True)),
                ('description', models.CharField(error_messages={'max_length': 'Your description is too long'}, help_text='Tell others about yourself', max_length=500)),
                ('avatar', models.ImageField(help_text='Upload an image that represent you', upload_to=app.models.User.user_directory_path)),
                ('snippets_count', models.PositiveSmallIntegerField(default=0)),
                ('posts_count', models.PositiveSmallIntegerField(default=0)),
                ('posts_ups_count', models.PositiveSmallIntegerField(default=0)),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(error_messages={'blank': "Your comment can't be empty", 'null': "Your comment can't be empty"}, help_text='Write your comment here', max_length=10000)),
                ('upvotes_count', models.PositiveSmallIntegerField(default=0)),
                ('downvotes_count', models.PositiveSmallIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(error_messages={'blank': "The title can't be empty", 'max_length': 'The title is too long', 'null': "The title can't be empty"}, help_text='Title of your post', max_length=50)),
                ('description', models.CharField(error_messages={'max_length': 'Your description is too long'}, help_text='Description of your post', max_length=3000)),
                ('share_url', models.URLField()),
                ('comments_count', models.PositiveSmallIntegerField(default=0)),
                ('upvotes_count', models.PositiveSmallIntegerField(default=0)),
                ('downvotes_count', models.PositiveSmallIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Skill',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(error_messages={'blank': "The name can't be empty", 'max_length': 'This name is too long', 'null': "The name can't be empty"}, help_text='The name of the skill', max_length=30)),
                ('category', models.CharField(choices=[('L', 'Language'), ('T', 'Technology')], error_messages={'blank': "This field can't be empty", 'null': 'This field need a value'}, help_text='Choose if is a lenguage or technology', max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Snippet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(error_messages={'blank': "The title can't be empty", 'max_length': 'Your title is too long', 'null': "The title can't be empty"}, help_text='Your snippet title', max_length=50)),
                ('description', models.CharField(error_messages={'blank': "Your description can't be empty", 'max_length': 'Your description is too long', 'null': "Your description can't be empty"}, help_text='Your snippet description', max_length=100)),
                ('code', models.TextField(error_messages={'blank': "Your snippet can't be empty", 'max_length': 'Your snippet is too long', 'null': "Your snippet can't be empty"}, help_text='Write your snippet here', max_length=10000)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
