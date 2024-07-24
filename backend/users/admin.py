from django.contrib import admin
from .models import User, CreatorUser, BusinessUser

admin.site.register(User)
admin.site.register(CreatorUser)
admin.site.register(BusinessUser)
