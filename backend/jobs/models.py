from django.db import models
from django.contrib.auth import get_user_model
from users.models import BusinessUser, CreatorUser

User = get_user_model()

MEDIUM_CHOICES = [
    ('facebook', 'Facebook'),
    ('instagram', 'Instagram'),
    ('youtube', 'Youtube'),
]

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


class Application(models.Model):
    creator = models.ForeignKey(CreatorUser, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey('Job', on_delete=models.CASCADE, related_name='applications')
    answers = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.creator.user.username} applied for {self.job.title}'


class Job(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    posted_by = models.ForeignKey(BusinessUser, on_delete=models.CASCADE)
    company_website = models.URLField(blank=True, null=True)
    medium = models.CharField(max_length=10, choices=MEDIUM_CHOICES)
    due_date = models.DateField()
    requirements = models.TextField()
    questions = models.TextField(blank=True, null=True)
    target_creator = models.CharField(max_length=20, choices=AREA_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
