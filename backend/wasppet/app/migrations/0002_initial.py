# Generated by Django 5.1 on 2024-09-07 20:05

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('app', '0001_initial'),
        ('authtoken', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Token',
            fields=[
                ('token_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='authtoken.token')),
            ],
            bases=('authtoken.token',),
        ),
        migrations.AddField(
            model_name='user',
            name='friends_list',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
    ]
