from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.
User = get_user_model()

class Post(models.Model):
  author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
  image = models.ImageField(upload_to='posts/')
  caption = models.TextField()
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"Post by {self.author.username} on {self.created_at}"
  
  @property
  def like_count(self):
    return self.likes.count()
  
  @property
  def comment_count(self):
    return self.comments.count()
  

class Like(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
  post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
  liked_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    unique_together = ('user', 'post')

  def __str__(self):
    return f"{self.user.username} likes {self.post.id}"
  

class Comment(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
  post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
  content = models.TextField()
  commented_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"{self.user.username} commented on {self.post.id}"
  