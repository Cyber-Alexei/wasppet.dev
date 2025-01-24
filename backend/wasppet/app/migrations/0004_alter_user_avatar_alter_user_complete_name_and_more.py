# Generated by Django 5.1 on 2024-09-08 04:36

import app.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(blank=True, help_text='Upload an image that represent you', null=True, upload_to=app.models.User.user_directory_path),
        ),
        migrations.AlterField(
            model_name='user',
            name='complete_name',
            field=models.CharField(blank=True, error_messages={'max_length': 'This name is too long'}, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='description',
            field=models.CharField(blank=True, error_messages={'max_length': 'Your description is too long'}, help_text='Tell others about yourself', max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='friends_list',
            field=models.ManyToManyField(blank=True, null=True, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='user',
            name='job_position',
            field=models.CharField(blank=True, error_messages={'max_length': 'This name is too long'}, help_text='The job position in your current company', max_length=40, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='skills',
            field=models.ManyToManyField(blank=True, help_text='Choose your best skills', null=True, to='app.skill'),
        ),
    ]
