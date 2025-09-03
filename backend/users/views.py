from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.forms.models import model_to_dict
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from django.db import transaction
from django.http import HttpResponseRedirect, HttpResponseBadRequest
from better_profanity import profanity
import json, time, datetime, secrets, requests
from urllib.parse import urlencode

from .utils import email_service, otp_service, graph_service
from .serializers import CreatorUserSerializer, BusinessUserSerializer, UserSerializer, NotificationSerializer, OTPSerializer, VerifyOTPSerializer
from .models import (CreatorUser, BusinessUser, 
                     User, Notification, 
                     FacebookAuth, FacebookPage, 
                     InstagramPage, OAuthTransaction,
                     InstagramMedia)

#Instagram integration through facebook login
SCOPES = settings.FB_SCOPES

class FacebookLoginStartView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):        
        raw_token = request.GET.get("token")
        if not raw_token:
            return HttpResponseBadRequest("Missing token")
        
        authenticator = JWTAuthentication()
        try:
            validated_token = authenticator.get_validated_token(raw_token)
            user = authenticator.get_user(validated_token)
        except Exception as e:
            return HttpResponseBadRequest(f"Invalid token: {e}")
        
        state = secrets.token_urlsafe(16)
        
        OAuthTransaction.objects.create(
            user = user,
            state = state
        )
        
        request.session["fb_oauth_state"] = state
        auth_url = (
            f"https://www.facebook.com/{settings.FB_API_VERSION}/dialog/oauth?"
            + urlencode({
                "client_id": settings.FB_APP_ID,
                "redirect_uri": settings.FB_REDIRECT_URI,
                "state": state,
                "scope": SCOPES,
                "auth_type": "rerequest",
            })
        )
        
        return HttpResponseRedirect(auth_url)
    
   
@method_decorator(csrf_exempt, name="dispatch")
class FacebookLoginCallbackView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        error = request.GET.get("error")
        if error:
            return HttpResponseBadRequest(f"Facebook error: {error}")
        
        state = request.GET.get("state")
        if request.session.get("fb_oauth_state") != state:
            return HttpResponseBadRequest("Invalid state")
        
        code = request.GET.get("code")
        if not code:
            return HttpResponseBadRequest("No code found!")
        
        txn = OAuthTransaction.objects.get(state=state)
        if not txn:
            return HttpResponseBadRequest("Invalid or already-used state")
        
        try:
            creator = txn.user.creatoruser
        except AttributeError:
            return HttpResponseBadRequest("Only creator user can connect social accounts")
        
        short_token_response = graph_service.get_short_token(code)
        short_token = short_token_response["access_token"]
        
        long_token_response = graph_service.get_long_token(short_token)
        long_token = long_token_response["access_token"]
        expires_in = long_token_response.get("expires_in", 60 * 60 * 24 * 60)
        expires_at = datetime.datetime.now() + datetime.timedelta(seconds=expires_in)
        
        me = graph_service.graph_get("me", long_token, {"fields": "id,name"})
        fb_user_id = me["id"]
        
        FacebookAuth.objects.update_or_create(
            owner=creator,
            defaults={
                "fb_user_id": fb_user_id,
                "long_lived_token": long_token,
                "token_expires_at": expires_at
            }
        )

        creator.instagram_connected = True
        creator.save(update_fields=["instagram_connected"])

        return HttpResponseRedirect("http://192.168.1.111:3000/profile?facebook=connected")


class FacebookConnectionCheckView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            creator = request.user.creatoruser
        except AttributeError:
            return Response({"message": "Only creator user can connect social accounts"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            fb_auth = FacebookAuth.objects.get(owner=creator)
        except ObjectDoesNotExist:
            return Response({"connected": False}, status=status.HTTP_200_OK)

        token = fb_auth.long_lived_token

        if not token:
            return Response({"connected": False}, status=status.HTTP_200_OK)

        try:
            response = graph_service.graph_get("me", token, {"fields": "id,name"})
        except Exception as e:
            return Response({"connected": False}, status=status.HTTP_200_OK)

        if response.get("id"):
            return Response({"connected": True}, status=status.HTTP_200_OK)

        return Response({"connected": False}, status=status.HTTP_200_OK)


class InstagramConnectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            creator = request.user.creatoruser
        except AttributeError:
            return Response({"message": "Only creator user can connect social accounts"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            fb_auth = FacebookAuth.objects.get(owner=creator)
        except ObjectDoesNotExist:
            return Response({"message": "Facebook is not connected"}, status=status.HTTP_400_BAD_REQUEST)
        
        token = fb_auth.long_lived_token
        
        pages_response = graph_service.graph_get("me/accounts", token)
        pages = pages_response.get("data", [])
        
        if not pages:
            return Response({"message": "No pages found. Make sure you are the admin and you choose the correct pages"}, 
                            status=status.HTTP_400_BAD_REQUEST)
            
        connected = []
        for page in pages:
            page_id = page["id"]
            page_token = page.get("access_token", "")
            page_info = graph_service.graph_get(page_id, token, {"fields": "name,instagram_business_account"})
            
            name = page_info.get("name", "")
            ig = page_info.get("instagram_business_account", {})
            if not ig:
                continue
            
            fb_page, _ = FacebookPage.objects.update_or_create(
                page_id = page_id,
                defaults={
                    "owner": fb_auth,
                    "name": name,
                    "page_access_token": page_token or "",
                },
            )
            
            ig_user_id = ig.get("id")
            ig_user = graph_service.graph_get(ig_user_id, token, {"fields": "username,profile_picture_url"})
            InstagramPage.objects.update_or_create(
                fb_page = fb_page,
                defaults={
                    "ig_user_id": ig_user_id,
                    "username": ig_user.get("username", ""),
                    "profile_picture_url": ig_user.get("profile_picture_url", ""),
                },
            )
            
            connected.append({
                "page_id": page_id,
                "ig_user_id": ig_user_id,
                "username": ig_user.get("username", "")
            })
            
        if not connected:
            creator.instagram_connected = False
            creator.save(update_fields=["instagram_connected"])
            return Response({"message": "No Instagram pages connected"}, status=status.HTTP_400_BAD_REQUEST)

        creator.instagram_connected = True
        creator.save(update_fields=["instagram_connected"])

        return Response({"connected": connected}, status=status.HTTP_200_OK)
    

class InstagramProfileFetchView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            creator = request.user.creatoruser
        except AttributeError:
            return Response({"message": "Only creator user can connect social accounts"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            fb_auth = FacebookAuth.objects.get(owner=creator)
        except ObjectDoesNotExist:
            return Response({"message": "Facebook is not connected"}, status=status.HTTP_400_BAD_REQUEST)
        
        ig = InstagramPage.objects.filter(fb_page__owner=fb_auth).first()
        if not ig:
            return Response({"message": "Instagram page not found/connected"}, status=status.HTTP_400_BAD_REQUEST)
        
        token = fb_auth.long_lived_token
        
        try:
            profile_data = graph_service.graph_get(ig.ig_user_id, token, {
                "fields": "username,followers_count,follows_count,media_count,profile_picture_url"
            })
        except Exception as e:
            return Response({"message": f"Error fetching Instagram profile details - {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        since = int(time.time()) - 7 * 24 * 60 * 60
        
        try:
            profile_insights = graph_service.graph_get(
            f"{ig.ig_user_id}/insights",
            token,
            {"metric": "reach,profile_views,accounts_engaged,total_interactions,views", "metric_type": "total_value", "period": "day", "since": since}
        )
        except Exception as e:
            return Response({"message": f"Error fetching Instagram profile insights - {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        ig.username = profile_data.get("username", ig.username)
        ig.profile_picture_url = profile_data.get("profile_picture_url", ig.profile_picture_url)
        ig.followers = profile_data.get("followers_count", ig.followers)
        ig.followings = profile_data.get("follows_count", ig.followings)
        ig.media_count = profile_data.get("media_count", ig.media_count)
        ig.insights_raw = profile_insights.get("data", [])

        ig.save(update_fields=[
            "username",
            "profile_picture_url",
            "followers",
            "followings",
            "media_count",
            "insights_raw"
        ])

        return Response({"connected": True}, status=status.HTTP_200_OK)


class InstagramProfileReadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            if username == "undefined":
                creator = request.user.creatoruser
            else:
                creator = User.objects.get(username=username).creatoruser
        except AttributeError:
            return Response({"message": "Only creator user can connect social accounts"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            fb_auth = FacebookAuth.objects.get(owner=creator)
        except ObjectDoesNotExist:
            return Response({"message": "Facebook is not connected"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ig = InstagramPage.objects.get(fb_page__owner=fb_auth)
        except ObjectDoesNotExist:
            return Response({"message": "No Instagram page found"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"profile_data": model_to_dict(ig)}, status=status.HTTP_200_OK)


class InstagramMediaFetchView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            creator = request.user.creatoruser
        except AttributeError:
            return Response({"message": "Only creator user can connect social accounts"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            fb_auth = FacebookAuth.objects.get(owner=creator)
        except ObjectDoesNotExist:
            return Response({"message": "Facebook is not connected"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            ig = InstagramPage.objects.get(fb_page__owner=fb_auth)
        except ObjectDoesNotExist:
            return Response({"message": "No Instagram page found"}, status=status.HTTP_400_BAD_REQUEST)
        
        token = fb_auth.long_lived_token
        
        media = graph_service.graph_get(f"{ig.ig_user_id}/media", token)
        media_ids = [m["id"] for m in media.get("data", [])[:5]]
        
        for m_id in media_ids:
            media_info = graph_service.graph_get(f"{m_id}", token, {"fields": "id,media_type,media_url,thumbnail_url,permalink,caption,like_count,comments_count"})
            media_obj, _ = InstagramMedia.objects.update_or_create(
                media_id = media_info.get("id"),
                defaults={
                    "owner": ig,
                    "media_type": media_info.get("media_type"),
                    "media_url": media_info.get("media_url"),
                    "thumbnail_url": media_info.get("thumbnail_url", ""),
                    "link": media_info.get("permalink"),
                    "caption": media_info.get("caption"),
                    "like_count": media_info.get("like_count", 0),
                    "comments_count": media_info.get("comments_count", 0),
                }
            )
            try:
                media_insights = graph_service.graph_get(f"{m_id}/insights", token, {"metric": "reach,views"})
                media_obj.insights_raw = media_insights.get("data", [])
            except Exception as e:
                media_obj.insights_raw = []

            media_obj.save()

        return Response({"connected": True}, status=status.HTTP_200_OK)
    

class InstagramMediaReadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            if username == "undefined":
                creator = request.user.creatoruser
            else:
                creator = User.objects.get(username=username).creatoruser
        except AttributeError:
            return Response({"message": "Only creator user can connect social accounts"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            fb_auth = FacebookAuth.objects.get(owner=creator)
        except ObjectDoesNotExist:
            return Response({"message": "Facebook is not connected"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ig = InstagramPage.objects.get(fb_page__owner=fb_auth)
        except ObjectDoesNotExist:
            return Response({"message": "No Instagram page found"}, status=status.HTTP_400_BAD_REQUEST)

        media = InstagramMedia.objects.filter(owner=ig)
        media_data = [model_to_dict(m) for m in media]
        media_data.reverse()

        return Response({"media": media_data}, status=status.HTTP_200_OK)


class FacebookDisconnectView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            creator = request.user.creatoruser
        except AttributeError:
            return Response({"message": "Only creator user can connect/disconnect social accounts"}, status=status.HTTP_400_BAD_REQUEST)
        
        try: 
            fb_auth = FacebookAuth.objects.get(owner=creator)
        except ObjectDoesNotExist:
            return Response({"message": "No facebook connection found"}, status=status.HTTP_400_BAD_REQUEST)
        
        token = fb_auth.long_lived_token
        proof = graph_service.appsecret_proof(token)
        
        url = f"https://graph.facebook.com/{settings.FB_API_VERSION}/me/permissions"
        params = {"access_token": token, "appsecret_proof": proof}
        
        creator.instagram_connected = False
        creator.save(update_fields=["instagram_connected"])
        
        try:
            response = requests.delete(url, params=params, timeout=30)
        except Exception as e:
            return Response({"message": f"Network error contacting Meta - {str(e)}. Disconnecting local session."}, status=status.HTTP_502_BAD_GATEWAY)

        if response.status_code == 200:
            return Response({"message": "App deauthorized at Meta for this user."}, status=status.HTTP_200_OK)
        
        return Response({"message": "Meta deauthorization failed" }, status=status.HTTP_400_BAD_REQUEST)
    
    
class FacebookPurgeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            creator = request.user.creatoruser
        except AttributeError:
            return Response({"message": "Only creator users can purge Instagram data."}, status=status.HTTP_400_BAD_REQUEST)
        
        try: 
            fb_auth = FacebookAuth.objects.get(owner=creator)
        except ObjectDoesNotExist:
            return Response({"message": "No facebook connection found"}, status=status.HTTP_400_BAD_REQUEST)
        
        token = fb_auth.long_lived_token
        proof = graph_service.appsecret_proof(token)
        
        url = f"https://graph.facebook.com/{settings.FB_API_VERSION}/me/permissions"
        params = {"access_token": token, "appsecret_proof": proof}
        
        with transaction.atomic():
            fb_auth.delete()

            creator.instagram_connected = False
            creator.save(update_fields=["instagram_connected"])
        
        try:
            response = requests.delete(url, params=params, timeout=30)
        except Exception as e:
            return Response({"message": f"Network error contacting Meta - {str(e)}. Deleting and disconnecting local session."}, status=status.HTTP_502_BAD_GATEWAY)

        return Response({"message": "Facebook/Instagram connection and data purged"}, status=status.HTTP_200_OK)


# OTP verification and mail sending using zepto
class SendOTPView(APIView):
    def post(self, request):
        serializer = OTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        name = serializer.validated_data.get('name')
        username = serializer.validated_data.get('username')
        email = serializer.validated_data.get('email')
        
        if profanity.contains_profanity(name) or profanity.contains_profanity(username) or profanity.contains_profanity(email):
            return Response({"message": "One or more fields contain inappropriate language."}, status=status.HTTP_400_BAD_REQUEST)

        if username and User.objects.filter(username=username).exists():
            return Response({"message": "This username is already taken."}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

        if email and User.objects.filter(email=email).exists():
            return Response({"message": "This email is already in use. Try logging in or use a different email"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

        otp = otp_service.generate_otp()
        otp_service.store_otp(username, otp)

        api_key = settings.ZEPTO_API_KEY
        template_key = settings.OTP_TEMPLATE_KEY
        placeholders = {
            "OTP": otp,
            "name": name
        }

        status_code, response = email_service.send_otp_email(
            api_key, email, template_key, placeholders)

        if 200 <= status_code <= 299:
            return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)
        return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyOTPView(APIView):
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"message": "Invalid input"}, status=status.HTTP_400_BAD_REQUEST)

        username = serializer.validated_data.get('username')
        otp = serializer.validated_data.get('otp')

        is_verified, message = otp_service.verify_otp(username, otp)
        if is_verified:
            return Response({"message": message}, status=status.HTTP_200_OK)
        return Response({"message": message}, status=status.HTTP_400_BAD_REQUEST)


class PasswrdResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_link = f"reset-password/{uid}/{token}"
            api_key = settings.ZEPTO_API_KEY
            template_key = settings.RESET_TEMPLATE_KEY
            placeholders = {
                "date_time": "1 hour",
                "reset_link": reset_link,
                "username": user.username
            }

            status_code, response = email_service.send_password_reset_email(
                api_key, email, template_key, placeholders)

            if 200 <= status_code <= 299:
                return Response({"message": "Password reset link sent successfully"}, status=status.HTTP_200_OK)
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except User.DoesNotExist:
            return Response({"message": "No user found with this email"}, status=status.HTTP_404_NOT_FOUND)


class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
            if default_token_generator.check_token(user, token):
                new_password = request.data.get('password')
                user.set_password(new_password)
                user.save()
                return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
            else:
                print("Invalid token")
                return Response({"message": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        except (User.DoesNotExist, ValueError, TypeError, UnicodeDecodeError):
            return Response({"message": "Invalid user id"}, status=status.HTTP_400_BAD_REQUEST)


class RegisterCreatorUserView(APIView):
    def post(self, request):
        serializer = CreatorUserSerializer(data=request.data)
        
        if serializer.is_valid():
            creator_user = serializer.save()
            refresh = RefreshToken.for_user(creator_user.user)

            existing_creators = CreatorUser.objects.exclude(
                user=creator_user.user)
            notifications = [
                Notification(
                    recipient=creator.user,
                    sender=creator_user.user,
                    notification_type='new_account',
                    message=f"{creator_user.user.name} has joined Cloutgrid!"
                )
                for creator in existing_creators
            ]
            Notification.objects.bulk_create(notifications)

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(creator_user.user).data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteCreatorUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user

        if not hasattr(user, 'creatoruser'):
            return Response({"message": "user is not a creator user"}, status=status.HTTP_403_FORBIDDEN)

        user.delete()
        return Response({"message": "Your creator account has been deleted successfully."}, status=status.HTTP_200_OK)


class RegisterBusinessUserView(APIView):
    def post(self, request):
        serializer = BusinessUserSerializer(data=request.data)
        
        if serializer.is_valid():
            business_user = serializer.save()
            refresh = RefreshToken.for_user(business_user.user)

            existing_businesses = BusinessUser.objects.exclude(
                user=business_user.user)
            notifications = [
                Notification(
                    recipient=business.user,
                    sender=business_user.user,
                    notification_type='new_account',
                    message=f"{business_user.user.name} has joined Cloutgrid!"
                )
                for business in existing_businesses
            ]
            Notification.objects.bulk_create(notifications)

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(business_user.user).data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteBusinessUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user

        if not hasattr(user, 'businessuser'):
            return Response({"message": "user is not a business user"}, status=status.HTTP_403_FORBIDDEN)

        user.delete()
        return Response({"message": "Your business account has been deleted successfully."}, status=status.HTTP_200_OK)


class CreatorUserLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        
        if not user:
            return Response({'message': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            creator_user = user.creatoruser
        except CreatorUser.DoesNotExist:
            return Response({'message': 'This email is registered as a business user. Please login as a Business!'}, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': CreatorUserSerializer(creator_user).data
        }, status=status.HTTP_200_OK)


class BusinessUserLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        
        if not user:
            return Response({'message': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            business_user = user.businessuser
        except BusinessUser.DoesNotExist:
            return Response({'message': 'This email is registered as a creator user. Please login as a Creator!'}, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': BusinessUserSerializer(business_user).data
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'message': f'Logout failed - {e}'}, status=status.HTTP_400_BAD_REQUEST)


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


class CreatorUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if hasattr(user, 'creatoruser'):
            serializer = CreatorUserSerializer(user.creatoruser)
            return Response(serializer.data)
        return Response({'error': 'Not a creator user'}, status=status.HTTP_400_BAD_REQUEST)

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

            user_serializer = UserSerializer(
                user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
            else:
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            creator_serializer = CreatorUserSerializer(creator_user, data={
                'area': data.get('area')
            }, partial=True)
            
            if creator_serializer.is_valid():
                creator_serializer.save()
                response_data = {
                    'user': user_serializer.data,
                    'area': creator_serializer.data.get('area')
                }
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response(creator_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Not a creator user'}, status=status.HTTP_400_BAD_REQUEST)


class BusinessUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if hasattr(user, 'businessuser'):
            serializer = BusinessUserSerializer(user.businessuser)
            return Response(serializer.data)
        return Response({'error': 'Not a business user'}, status=400)

    def put(self, request):
        user = request.user
        if hasattr(user, 'businessuser'):
            business_user = user.businessuser
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

            user_serializer = UserSerializer(
                user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
            else:
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            business_serializer = BusinessUserSerializer(business_user, data={
                'website': data.get('website'),
                'target_audience': data.get('target_audience')
            }, partial=True)
            if business_serializer.is_valid():
                business_serializer.save()
                response_data = {
                    'user': user_serializer.data,
                    'website': business_serializer.data.get('website'),
                    'target_audience': business_serializer.data.get('target_audience')
                }
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response(business_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'Not a business user'}, status=status.HTTP_400_BAD_REQUEST)


class UserSearchView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response({"error": "No search query provided"}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(username__icontains=query) | User.objects.filter(
            email__icontains=query) | User.objects.filter(name__icontains=query)
        creators = CreatorUser.objects.filter(user__in=users)
        businesses = BusinessUser.objects.filter(user__in=users)

        creator_serializer = CreatorUserSerializer(creators, many=True)
        business_serializer = BusinessUserSerializer(businesses, many=True)

        return Response({
            "creators": creator_serializer.data,
            "businesses": business_serializer.data
        }, status=status.HTTP_200_OK)


class BusinessSearchView(APIView):
    def get(self, request):
        query = request.query_params.get("q", "")
        if not query:
            return Response({"error": "No search query found"}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(username__icontains=query) | User.objects.filter(
            email__icontains=query) | User.objects.filter(name__icontains=query)
        results = BusinessUser.objects.filter(user__in=users)
        serialized_results = BusinessUserSerializer(results, many=True)

        return Response(serialized_results.data, status=status.HTTP_200_OK)


class ProfileView(APIView):
    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        is_following = request.user.following.filter(id=user.id).exists()
        is_blocking = request.user.blockings.filter(id=user.id).exists()
        is_blocker = request.user.blockers.filter(id=user.id).exists()

        try:
            creator = CreatorUser.objects.get(user=user)
            serializer = CreatorUserSerializer(creator)
        except CreatorUser.DoesNotExist:
            try:
                business = BusinessUser.objects.get(user=user)
                serializer = BusinessUserSerializer(business)
            except BusinessUser.DoesNotExist:
                return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({**serializer.data, "is_following": is_following, "is_blocking": is_blocking, "is_blocker": is_blocker}, status=status.HTTP_200_OK)


class FollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        user_to_follow = get_object_or_404(User, username=username)
        if request.user == user_to_follow:
            return Response({"message": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        request.user.following.add(user_to_follow)
        user_to_follow.followers.add(request.user)

        Notification.objects.create(
            recipient=user_to_follow,
            sender=request.user,
            notification_type='follow',
            message=f"{request.user.name} has followed you!"
        )

        return Response({"message": "Successfully followed user."}, status=status.HTTP_200_OK)


class UnfollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        user_to_unfollow = get_object_or_404(User, username=username)
        if request.user == user_to_unfollow:
            return Response({"detail": "You cannot unfollow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        request.user.following.remove(user_to_unfollow)
        user_to_unfollow.followers.remove(request.user)

        return Response({"detail": "Successfully unfollowed user."}, status=status.HTTP_200_OK)


class BlockUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        user_to_block = get_object_or_404(User, username=username)

        if request.user == user_to_block:
            return Response({"message": "You cannot block yourself."}, status=status.HTTP_400_BAD_REQUEST)

        if user_to_block in request.user.blockings.all():
            return Response({"message": "You already blocked this user."}, status=status.HTTP_400_BAD_REQUEST)

        request.user.blockings.add(user_to_block)

        return Response({"message": "Successfully blocked user."}, status=status.HTTP_200_OK)


class UnblockUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        user_to_unblock = get_object_or_404(User, username=username)

        if request.user == user_to_unblock:
            return Response({"message": "You cannot unblock yourself"}, status=status.HTTP_400_BAD_REQUEST)

        if user_to_unblock not in request.user.blockings.all():
            return Response({"message": "You haven't blocked this user"}, status=status.HTTP_400_BAD_REQUEST)

        request.user.blockings.remove(user_to_unblock)

        return Response({"message": "Successfully unblocked user."}, status=status.HTTP_200_OK)


class IsFollowingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        user_to_check = get_object_or_404(User, username=username)
        is_following = request.user.following.filter(
            id=user_to_check.id).exists()
        return Response({"is_following": is_following}, status=status.HTTP_200_OK)


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        show_all = request.query_params.get('all', False) == 'true'
        notifications = Notification.objects.filter(recipient=request.user).order_by(
            '-created_at') if show_all else Notification.objects.filter(recipient=request.user, is_read=False).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MarkNotificationAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            notification = Notification.objects.get(
                pk=pk, recipient=request.user)
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
