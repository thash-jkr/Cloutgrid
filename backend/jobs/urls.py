from django.urls import path
from .views import (JobListView, JobDetailView, 
                    ApplyJobView, isAppliedView, 
                    BusinessUserJobsView, JobApplicantsView)

urlpatterns = [
    path('', JobListView.as_view(), name='job-list'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('<int:pk>/apply/', ApplyJobView.as_view(), name='apply-job'),
    path('<int:pk>/status/', isAppliedView.as_view(), name='is-applied'),
    path('my-jobs/', BusinessUserJobsView.as_view(), name='business-user-jobs'),
    path('my-jobs/<int:pk>/', JobApplicantsView.as_view(),
         name='business-user-job-detail'),
]
