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

class Job(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    posted_by = models.ForeignKey(BusinessUser, on_delete=models.CASCADE)
    company_website = models.URLField()
    medium = models.CharField(max_length=50, choices=MEDIUM_CHOICES)
    due_date = models.DateField()
    requirements = models.TextField()
    target_creator = models.CharField(max_length=50, choices=AREA_CHOICES)
    applicants = models.ManyToManyField(CreatorUser, related_name='applied_jobs', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
