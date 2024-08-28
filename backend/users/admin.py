from django.contrib import admin
from .models import User, CreatorUser, BusinessUser, Notification

admin.site.register(User)
admin.site.register(CreatorUser)
admin.site.register(BusinessUser)
admin.site.register(Notification)
