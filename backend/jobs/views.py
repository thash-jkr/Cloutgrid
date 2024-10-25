from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer, JobDetailSerializer
from users.models import CreatorUser, Notification, BusinessUser
import random

class JobListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobs = Job.objects.all()
        serializer = JobSerializer(jobs, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        if not hasattr(request.user, 'businessuser'):
            return Response({'error': 'Only business users can post jobs'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = JobDetailSerializer(data=request.data)
        if serializer.is_valid():
            job = serializer.save(posted_by=request.user.businessuser)

            creators = CreatorUser.objects.all()
            for creator in creators:
                Notification.objects.create(
                    recipient=creator.user,
                    sender=request.user,
                    notification_type='job_posted',
                    message=f"A new job '{job.title}' has been posted by {request.user.name}."
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class JobDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        job = get_object_or_404(Job, pk=pk)
        serializer = JobDetailSerializer(job)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        job = get_object_or_404(Job, pk=pk)
        if job.posted_by.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        serializer = JobSerializer(job, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        job = get_object_or_404(Job, pk=pk)
        if job.posted_by.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ApplyJobView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        job = get_object_or_404(Job, id=pk)
        creator_user = get_object_or_404(CreatorUser, user=request.user)
        answers = request.data.get('answers', '')

        if Application.objects.filter(job=job, creator=creator_user).exists():
            return Response({"detail": "You have already applied for this job."}, status=status.HTTP_400_BAD_REQUEST)
        
        if job.questions and not answers:
            return Response({"detail": "This job requires answers to the questions."}, status=status.HTTP_400_BAD_REQUEST)
        
        Application.objects.create(
            creator = creator_user,
            job = job,
            answers = answers
        )

        Notification.objects.create(
            recipient=job.posted_by.user,
            sender=request.user,
            notification_type='job_applied',
            message=f"{request.user.username} has applied for your job '{job.title}'."
        )

        return Response({"detail": "You have successfully applied for the job."}, status=status.HTTP_200_OK)
    
class isAppliedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        job = get_object_or_404(Job, id=pk)
        creator_user = get_object_or_404(CreatorUser, user=request.user)

        if Application.objects.filter(creator=creator_user, job=job).exists():
            return Response({"is_applied": True}, status=status.HTTP_200_OK)
        return Response({"is_applied": False}, status=status.HTTP_200_OK)
    
class BusinessUserJobsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'businessuser'):
            return Response({'error': 'Only business users can view this information'}, status=status.HTTP_403_FORBIDDEN)

        jobs = Job.objects.filter(posted_by=request.user.businessuser)
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class JobApplicantsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        if not hasattr(request.user, 'businessuser'):
            return Response({'error': 'Only business users can view this information'}, status=status.HTTP_403_FORBIDDEN)

        job = get_object_or_404(Job, id=pk, posted_by=request.user.businessuser)
        applications = Application.objects.filter(job=job)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# Testing
class BulkJobCreateView(APIView):
    def post(self, request):
        jobs_data = request.data  # Expecting a list of job dictionaries
        created_jobs = []
        errors = []

        area = "finance"
        business_users = list(BusinessUser.objects.filter(target_audience=area))

        if not business_users:
            return Response({'error': 'No business users available to assign jobs'}, status=status.HTTP_400_BAD_REQUEST)

        for job_data in jobs_data:
            serializer = JobSerializer(data=job_data)
            if serializer.is_valid():
                # Assign the job to a random business user
                random_business_user = random.choice(business_users)
                job = serializer.save(posted_by=random_business_user)

                # Notify all creators about the new job
                creators = CreatorUser.objects.all()
                for creator in creators:
                    Notification.objects.create(
                        recipient=creator.user,
                        sender=random_business_user.user,
                        notification_type='job_posted',
                        message=f"A new job '{job.title}' has been posted by {random_business_user.user.name}."
                    )

                created_jobs.append(serializer.data)
            else:
                errors.append({
                    'job_data': job_data,
                    'errors': serializer.errors
                })

        if errors:
            return Response({
                'created_jobs': created_jobs,
                'errors': errors
            }, status=status.HTTP_207_MULTI_STATUS)  # 207 Multi-Status indicates partial success
        return Response(created_jobs, status=status.HTTP_201_CREATED)
