from rest_framework import serializers
from .models import Job, Application, Question, Answer
from users.models import CreatorUser
from users.serializers import BusinessUserSerializer, CreatorUserSerializer
from better_profanity import profanity


class JobSerializer(serializers.ModelSerializer):
    posted_by = BusinessUserSerializer(read_only=True)
    questions = serializers.SerializerMethodField()
    is_applied = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = '__all__'

    def get_questions(self, obj):
        questions = obj.questions.all()
        return QuestionSerializer(questions, many=True).data

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
        
    def validate(self, data):
        fields = ["title", "description", "requirements"]
        
        for field in fields:
            if field in data and profanity.contains_profanity(data[field]):
                raise serializers.ValidationError("One or more fields contain inappropriate language.")
            
        return data


class ApplicationSerializer(serializers.ModelSerializer):
    creator = CreatorUserSerializer(read_only=True)
    job = JobSerializer(read_only=True)
    # questions = serializers.SerializerMethodField()
    answers = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = '__all__'

    def get_answers(self, obj):
        answers = obj.answers.all()
        return AnswerSerializer(answers, many=True).data


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'
        
    def validate_content(self, value):
        if profanity.contains_profanity(value):
            raise serializers.ValidationError("One or more questions contain inappropriate language.")
        
        return value


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'
        extra_kwargs = {
            "application": {"read_only": True},
            "question": {"read_only": True}
        }
        
    def validate_content(self, value):
        if profanity.contains_profanity(value):
            raise serializers.ValidationError("One or more answers contain inappropriate language.")
        
        return value
