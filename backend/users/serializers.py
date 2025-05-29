from django.contrib.auth import get_user_model
from rest_framework import serializers
from better_profanity import profanity

from .models import CreatorUser, BusinessUser, Notification

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('name', 'email', 'username', 'profile_photo', 'bio', 'user_type', 'password', 'followers_count', 'following_count')
        extra_kwargs = {'password': {'write_only': True}}

    def get_followers_count(self, obj):
        return obj.followers.count()
    
    def get_following_count(self, obj):
        return obj.following.count()
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        if password:
            if password.strip():
                instance.set_password(password)
            else:
                raise serializers.ValidationError({'message': 'This field may not be blank.'})

        for key, value in validated_data.items():
            if key != "profile_photo" and profanity.contains_profanity(value):
                raise serializers.ValidationError({'One or more fields contain inappropriate language.'})
            setattr(instance, key, value)
            
        instance.save()
        return instance
    

class CreatorUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = CreatorUser
        fields = ('user', 'area')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_data["user_type"] = "creator"
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
        user_data["user_type"] = "business"
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


class OTPSerializer(serializers.Serializer):
    name = serializers.CharField(required=True)
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)


class VerifyOTPSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    otp = serializers.IntegerField(required=True)
