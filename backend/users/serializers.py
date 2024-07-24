from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import CreatorUser, BusinessUser

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('name', 'email', 'username', 'profile_photo', 'bio', 'password', 'followers_count', 'following_count')

    def get_followers_count(self, obj):
        return obj.followers.count()
    
    def get_following_count(self, obj):
        return obj.following.count()

class CreatorUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = CreatorUser
        fields = ('user', 'date_of_birth', 'area')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        creator_user = CreatorUser.objects.create(user=user, **validated_data)
        return creator_user

class BusinessUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = BusinessUser
        fields = ('user', 'website', 'target_audience')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        business_user = BusinessUser.objects.create(user=user, **validated_data)
        return business_user
