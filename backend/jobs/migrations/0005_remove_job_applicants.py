# Generated by Django 5.0.7 on 2024-09-27 10:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0004_application'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='job',
            name='applicants',
        ),
    ]