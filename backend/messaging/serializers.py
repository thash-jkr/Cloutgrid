from rest_framework import serializers

from .models import Conversation, Message
from users.serializers import CreatorUserSerializer, BusinessUserSerializer

class ConversationSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = ["id", "user", "created_at"]
        
    def check_attr(self, user):
        if hasattr(user, "creatoruser"):
            return CreatorUserSerializer(user.creatoruser).data
        else:
            return BusinessUserSerializer(user.businessuser).data
        
    def get_user(self, obj):
        user = self.context.get("user")
        
        if user.id == obj.user_1.id:
            return self.check_attr(obj.user_2)
        else:
            return self.check_attr(obj.user_1)
        
    


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ["id", "sender", "content", "is_read", "created_at"]
        
    def get_sender(self, obj):
        if hasattr(obj.sender, "creatoruser"):
            return CreatorUserSerializer(obj.sender.creatoruser).data
        else:
            return BusinessUserSerializer(obj.sender.businessuser).data