# Generated by Django 5.1 on 2024-10-07 18:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0022_alter_user_job_position'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='skills',
            field=models.CharField(blank=True, default='', help_text='Choose your best skills', max_length=1000, null=True),
        ),
    ]
