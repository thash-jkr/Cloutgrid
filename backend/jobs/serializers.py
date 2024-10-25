from rest_framework import serializers
from .models import Job, Application
from users.models import CreatorUser
from users.serializers import BusinessUserSerializer, CreatorUserSerializer


class JobSerializer(serializers.ModelSerializer):
    posted_by = BusinessUserSerializer(read_only=True)
    is_applied = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = '__all__'

    def get_is_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user
            creator = CreatorUser.objects.get(user=user)
            return Application.objects.filter(job=obj, creator=creator).exists()

        return False


class JobDetailSerializer(serializers.ModelSerializer):
    posted_by = BusinessUserSerializer(read_only=True)

    class Meta:
        model = Job
        fields = '__all__'


class ApplicationSerializer(serializers.ModelSerializer):
    creator = CreatorUserSerializer(read_only=True)
    job = JobSerializer(read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
