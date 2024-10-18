from rest_framework import serializers
from .models import Post, Like, Comment
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer

User = get_user_model()

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    like_count = serializers.ReadOnlyField()
    comment_count = serializers.ReadOnlyField()

    class Meta:
        model = Post
        fields = ['id', 'author', 'image', 'caption', 'created_at', 'like_count', 'comment_count']


class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'liked_at']


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'content', 'commented_at']
