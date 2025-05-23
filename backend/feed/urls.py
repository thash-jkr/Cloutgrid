from django.urls import path
from .views import PostListView, LikePostView, CommentListView, UserFeedView, UserCollaborationView, ProfileCollaborationView

urlpatterns = [
    path('', PostListView.as_view(), name='post-list'),
    path('collabs/', UserCollaborationView.as_view(), name='user-collabs'),
    path('collabs/<str:username>/', ProfileCollaborationView.as_view(), name='profile-collabs'),
    path('<int:pk>/like/', LikePostView.as_view(), name='like-post'),
    path('<int:pk>/comments/', CommentListView.as_view(), name='comments-list'),
    path('<str:username>/', UserFeedView.as_view(), name='user-feed'),
]
