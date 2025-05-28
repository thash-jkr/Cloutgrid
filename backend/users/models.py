from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not username:
            raise ValueError('The Username field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, username, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, unique=True)
    profile_photo = models.ImageField(default="default_profile.png", upload_to="profile_pics")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    bio = models.CharField(max_length=255, null=True, blank=True, default="")
    user_type = models.CharField(max_length=10, null=True, blank=True)
    followers = models.ManyToManyField("self", symmetrical=False, related_name='following', blank=True)
    blockings = models.ManyToManyField("self", symmetrical=False, related_name="blockers", blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.username} - {self.user_type}"

AREA_CHOICES = [
    ('art', 'Art and Photography'),
    ('automotive', 'Automotive'),
    ('beauty', 'Beauty and Makeup'),
    ('business', 'Business'),
    ('diversity', 'Diversity and Inclusion'),
    ('education', 'Education'),
    ('entertainment', 'Entertainment'),
    ('fashion', 'Fashion'),
    ('finance', 'Finance'),
    ('food', 'Food and Beverage'),
    ('gaming', 'Gaming'),
    ('health', 'Health and Wellness'),
    ('home', 'Home and Gardening'),
    ('outdoor', 'Outdoor and Nature'),
    ('parenting', 'Parenting and Family'),
    ('pets', 'Pets'),
    ('sports', 'Sports and Fitness'),
    ('technology', 'Technology'),
    ('travel', 'Travel'),
    ('videography', 'Videography'),
]

class CreatorUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    area = models.CharField(max_length=255, choices=AREA_CHOICES)
    successful_campaigns = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.area}"

class BusinessUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    website = models.CharField(max_length=255, blank=True, null=True)
    target_audience = models.CharField(max_length=255, choices=AREA_CHOICES)
    successfull_hirings = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.target_audience}"
    
class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('follow', 'Followed You'),
        ('job_applied', 'Applied for a Job'),
        ('job_posted', 'Posted a Job'),
        ('new_account', 'New Account Created'),
    )

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    message = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'{self.sender} - {self.notification_type}'

    class Meta:
        ordering = ['-created_at']
