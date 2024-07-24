from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Job
from .serializers import JobSerializer
from users.models import CreatorUser
from users.serializers import CreatorUserSerializer

class JobListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobs = Job.objects.all()
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not hasattr(request.user, 'businessuser'):
            return Response({'error': 'Only business users can post jobs'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(posted_by=request.user.businessuser)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class JobDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        job = get_object_or_404(Job, pk=pk)
        serializer = JobSerializer(job)
        return Response(serializer.data)

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

        if job.applicants.filter(user=creator_user).exists():
            return Response({"detail": "You have already applied for this job."}, status=status.HTTP_400_BAD_REQUEST)

        job.applicants.add(creator_user)
        job.save()

        return Response({"detail": "You have successfully applied for the job."}, status=status.HTTP_200_OK)
    
class isAppliedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        job = get_object_or_404(Job, id=pk)
        creator_user = get_object_or_404(CreatorUser, user=request.user)

        if job.applicants.filter(user=creator_user).exists():
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
        applicants = job.applicants.all()
        serializer = CreatorUserSerializer(applicants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
