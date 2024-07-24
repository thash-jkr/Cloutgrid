from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .serializers import CreatorUserSerializer, BusinessUserSerializer, UserSerializer
from .models import CreatorUser, BusinessUser, User

class RegisterCreatorUserView(APIView):
    def post(self, request):
        serializer = CreatorUserSerializer(data=request.data)
        if serializer.is_valid():
            creator_user = serializer.save()
            refresh = RefreshToken.for_user(creator_user.user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(creator_user.user).data
            }, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterBusinessUserView(APIView):
    def post(self, request):
        serializer = BusinessUserSerializer(data=request.data)
        if serializer.is_valid():
            business_user = serializer.save()
            refresh = RefreshToken.for_user(business_user.user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(business_user.user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CreatorUserLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None and hasattr(user, 'creatoruser'):
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials or not a creator user'}, status=status.HTTP_401_UNAUTHORIZED)

class BusinessUserLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None and hasattr(user, 'businessuser'):
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials or not a business user'}, status=status.HTTP_401_UNAUTHORIZED)
    
class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if hasattr(user, 'creatoruser'):
            serializer = CreatorUserSerializer(user.creatoruser)
        elif hasattr(user, 'businessuser'):
            serializer = BusinessUserSerializer(user.businessuser)
        else:
            serializer = UserSerializer(user)
        return Response(serializer.data)
    
class UserTypeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if hasattr(user, 'creatoruser'):
            user_type = 'creator'
        elif hasattr(user, 'businessuser'):
            user_type = 'business'
        else:
            user_type = 'unknown'
        return Response({'type': user_type})
    
class CreatorUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if hasattr(user, 'creatoruser'):
            serializer = CreatorUserSerializer(user.creatoruser)
            return Response(serializer.data)
        return Response({'error': 'Not a creator user'}, status=400)

class BusinessUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if hasattr(user, 'businessuser'):
            serializer = BusinessUserSerializer(user.businessuser)
            return Response(serializer.data)
        return Response({'error': 'Not a business user'}, status=400)
    
class UserProfilePhotoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile_photo = user.profile_photo.url if user.profile_photo else None

        if profile_photo:
            return Response({'profile_photo': profile_photo})
        return Response({'error': 'No profile photo found'}, status=404)
    
class UserSearchView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response({"error": "No search query provided"}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(username__icontains=query) | User.objects.filter(email__icontains=query) | User.objects.filter(name__icontains=query)
        creators = CreatorUser.objects.filter(user__in=users)
        businesses = BusinessUser.objects.filter(user__in=users)

        creator_serializer = CreatorUserSerializer(creators, many=True)
        business_serializer = BusinessUserSerializer(businesses, many=True)

        return Response({
            "creators": creator_serializer.data,
            "businesses": business_serializer.data
        }, status=status.HTTP_200_OK)
    
class ProfileView(APIView):
    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        
        try:
            creator = CreatorUser.objects.get(user=user)
            serializer = CreatorUserSerializer(creator)
        except CreatorUser.DoesNotExist:
            try:
                business = BusinessUser.objects.get(user=user)
                serializer = BusinessUserSerializer(business)
            except BusinessUser.DoesNotExist:
                return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class FollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        user_to_follow = get_object_or_404(User, username=username)
        if request.user == user_to_follow:
            return Response({"detail": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        request.user.following.add(user_to_follow)
        user_to_follow.followers.add(request.user)

        return Response({"detail": "Successfully followed user."}, status=status.HTTP_200_OK)

class UnfollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        user_to_unfollow = get_object_or_404(User, username=username)
        if request.user == user_to_unfollow:
            return Response({"detail": "You cannot unfollow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        request.user.following.remove(user_to_unfollow)
        user_to_unfollow.followers.remove(request.user)

        return Response({"detail": "Successfully unfollowed user."}, status=status.HTTP_200_OK)
    
class IsFollowingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        user_to_check = get_object_or_404(User, username=username)
        is_following = request.user.following.filter(id=user_to_check.id).exists()
        return Response({"is_following": is_following}, status=status.HTTP_200_OK)
