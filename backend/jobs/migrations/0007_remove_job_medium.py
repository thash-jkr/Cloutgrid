# Generated by Django 5.0.7 on 2024-11-18 12:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0006_remove_job_company_website'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='job',
            name='medium',
        ),
    ]
