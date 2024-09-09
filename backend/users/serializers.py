from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import CreatorUser, BusinessUser, Notification

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('name', 'email', 'username', 'profile_photo', 'bio', 'password', 'followers_count', 'following_count')
        extra_kwargs = {'password': {'write_only': True}}

    def get_followers_count(self, obj):
        return obj.followers.count()
    
    def get_following_count(self, obj):
        return obj.following.count()
    
    def update(self, instance, validated_data):
        # Handle password only if provided
        password = validated_data.pop('password', None)
        if password:
            if password.strip():  # Ensure the password is not empty
                instance.set_password(password)
            else:
                raise serializers.ValidationError({'password': 'This field may not be blank.'})

        # Update other fields
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance

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
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_serializer = UserSerializer(instance=instance.user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
            else:
                raise serializers.ValidationError(user_serializer.errors)

        instance.date_of_birth = validated_data.get('date_of_birth', instance.date_of_birth)
        instance.area = validated_data.get('area', instance.area)
        instance.save()
        return instance

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
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_serializer = UserSerializer(instance=instance.user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
            else:
                raise serializers.ValidationError(user_serializer.errors)

        instance.website = validated_data.get('website', instance.website)
        instance.target_audience = validated_data.get('target_audience', instance.target_audience)
        instance.save()
        return instance
    
class NotificationSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField()
    recipient = serializers.StringRelatedField()

    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'sender', 'notification_type', 'message', 'is_read', 'created_at']
        read_only_fields = ['created_at', 'recipient', 'sender']
