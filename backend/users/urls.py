from django.urls import path
from .views import (
    RegisterCreatorUserView, RegisterBusinessUserView, 
    CreatorUserLoginView, BusinessUserLoginView, 
    UserDetailView, LogoutView, 
    CreatorUserProfileView, BusinessUserProfileView,
    UserTypeView, UserProfilePhotoView,
    UserSearchView, ProfileView,
    FollowUserView, UnfollowUserView,
    IsFollowingView
)

urlpatterns = [
    path('', UserDetailView.as_view(), name='user-detail'),
    path('register/creator/', RegisterCreatorUserView.as_view(), name='register-creator'),
    path('register/business/', RegisterBusinessUserView.as_view(), name='register-business'),
    path('login/creator/', CreatorUserLoginView.as_view(), name='login-creator'),
    path('login/business/', BusinessUserLoginView.as_view(), name='login-business'),
    path('logout/', LogoutView.as_view(), name="user-logout"),
    path('profile/creator/', CreatorUserProfileView.as_view(), name='creator-profile'),
    path('profile/business/', BusinessUserProfileView.as_view(), name='business-profile'),
    path('user-type/', UserTypeView.as_view(), name='user-type'),
    path('profile-photo/', UserProfilePhotoView.as_view(), name='profile-photo'),
    path('search/', UserSearchView.as_view(), name='user-search'),
    path('profiles/<str:username>', ProfileView.as_view(), name='profile'),
    path('profiles/<str:username>/follow/', FollowUserView.as_view(), name='follow-user'),
    path('profiles/<str:username>/unfollow/', UnfollowUserView.as_view(), name='unfollow-user'),
    path('profiles/<str:username>/is_following/', IsFollowingView.as_view(), name='is-following'),
]