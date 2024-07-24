from rest_framework import serializers
from .models import Job
from users.serializers import BusinessUserSerializer, CreatorUserSerializer

class JobSerializer(serializers.ModelSerializer):
    posted_by = BusinessUserSerializer(read_only=True)
    applicants = CreatorUserSerializer(many=True, read_only=True)

    class Meta:
        model = Job
        fields = '__all__'
