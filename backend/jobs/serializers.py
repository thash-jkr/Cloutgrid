from rest_framework import serializers
from .models import Job, Application
from users.serializers import BusinessUserSerializer, CreatorUserSerializer

class JobSerializer(serializers.ModelSerializer):
    posted_by = BusinessUserSerializer(read_only=True)
    applicants = CreatorUserSerializer(many=True, read_only=True)

    class Meta:
        model = Job
        fields = '__all__'


class ApplicationSerializer(serializers.ModelSerializer):
    creator = CreatorUserSerializer(read_only=True)
    job = JobSerializer(read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
