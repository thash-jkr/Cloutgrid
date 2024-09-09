from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .serializers import CreatorUserSerializer, BusinessUserSerializer, UserSerializer, NotificationSerializer
from .models import CreatorUser, BusinessUser, User, Notification
import json

# In views.py (Django)
from django.http import JsonResponse
from django.middleware.csrf import get_token

def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})


class RegisterCreatorUserView(APIView):
    def post(self, request):
        serializer = CreatorUserSerializer(data=request.data)
        if serializer.is_valid():
            creator_user = serializer.save()
            refresh = RefreshToken.for_user(creator_user.user)

            excisting_creators = CreatorUser.objects.filter(user=creator_user.user)
            for creator in excisting_creators:
                Notification.objects.create(
                    recipient=creator.user,
                    sender=creator_user.user,
                    notification_type='new_account',
                    message = f"{creator_user.user.name} has joined Cloutgrid!"
                )

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

            excisting_businesses = BusinessUser.objects.filter(user=business_user.user)
            for business in excisting_businesses:
                Notification.objects.create(
                    recipient=business.user,
                    sender=business_user.user,
                    notification_type='new_account',
                    message = f"{business_user.user.name} has joined Cloutgrid!"
                )

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
    
    def put(self, request):
        user = request.user
        if hasattr(user, 'creatoruser'):
            creator_user = user.creatoruser
            data = request.data
            user_data = {
                'name': data.get('user[name]'),
                'email': data.get('user[email]'),
                'username': data.get('user[username]'),
                'bio': data.get('user[bio]'),
            }

            profile_photo = data.get('user[profile_photo]', None)
            if profile_photo is not None:
                user_data['profile_photo'] = profile_photo

            password = data.get('user[password]', None)
            if password is not None and password.strip() != '':
                user_data['password'] = password
                print("User data:", json.dumps(user_data, indent=4))

            user_serializer = UserSerializer(user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
            else:
                print(user_serializer.errors)
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            creator_serializer = CreatorUserSerializer(creator_user, data={
                'date_of_birth': data.get('date_of_birth'),
                'area': data.get('area')
            }, partial=True)
            if creator_serializer.is_valid():
                creator_serializer.save()
                response_data = {
                    'user': user_serializer.data,
                    'date_of_birth': creator_serializer.data.get('date_of_birth'),
                    'area': creator_serializer.data.get('area')
                }
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                print(creator_serializer.errors)
                return Response(creator_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'Not a creator user'}, status=status.HTTP_400_BAD_REQUEST)
    
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

        Notification.objects.create(
            recipient=user_to_follow,
            sender=request.user,
            notification_type='follow',
            message = f"{request.user.name} has followed you!"
        )

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
    
class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        show_all = request.query_params.get('all', False) == 'true'
        notifications = Notification.objects.filter(recipient=request.user).order_by('-created_at') if show_all else Notification.objects.filter(recipient=request.user, is_read=False).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class MarkNotificationAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, recipient=request.user)
            notification.is_read = True
            notification.save()
            return Response({"status": "Notification marked as read"}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)

class GetAllUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        creators = CreatorUser.objects.exclude(user=request.user)
        businesses = BusinessUser.objects.exclude(user=request.user)
        creator_serializer = CreatorUserSerializer(creators, many=True)
        business_serializer = BusinessUserSerializer(businesses, many=True)
        return Response({
            "creators": creator_serializer.data,
            "businesses": business_serializer.data
        }, status=status.HTTP_200_OK)

class BulkRegisterCreatorUserView(APIView):
    def post(self, request):
        created_users = []
        errors = []

        for user_data in request.data:
            serializer = CreatorUserSerializer(data=user_data)
            if serializer.is_valid():
                creator_user = serializer.save()
                refresh = RefreshToken.for_user(creator_user.user)
                created_users.append({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(creator_user.user).data
                })
            else:
                errors.append({
                    'user_data': user_data,
                    'errors': serializer.errors
                })

        if errors:
            return Response({
                'created_users': created_users,
                'errors': errors
            }, status=status.HTTP_207_MULTI_STATUS)  # 207 Multi-Status indicates partial success
        return Response(created_users, status=status.HTTP_201_CREATED)
    
class BulkRegisterBusinessUserView(APIView):
    def post(self, request):
        created_users = []
        errors = []

        for user_data in request.data:
            serializer = BusinessUserSerializer(data=user_data)
            if serializer.is_valid():
                business_user = serializer.save()
                refresh = RefreshToken.for_user(business_user.user)
                created_users.append({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(business_user.user).data
                })
            else:
                errors.append({
                    'user_data': user_data,
                    'errors': serializer.errors
                })

        if errors:
            return Response({
                'created_users': created_users,
                'errors': errors
            }, status=status.HTTP_207_MULTI_STATUS)  # 207 Multi-Status indicates partial success
        return Response(created_users, status=status.HTTP_201_CREATED)

