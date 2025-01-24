from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from app.serializers import NotificationSerializer
from rest_framework.generics import get_object_or_404
from app.models import Notification


class NotificationView(APIView):
    permission_classes: [permissions.IsAuthenticated]

    def get_all_user_notifications(self, request, user_id, format=None):
        notifications = Notification.objects.filter(to_user=user_id).order_by("-id")
        if notifications.exists():
            serializer = NotificationSerializer(notifications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"Detail": "No Notifications Found"}, status=status.HTTP_404_NOT_FOUND)
    
    # ---------------------------------

    # Get notifications
    def get(self, request, user_id=None, format=None):
        if user_id:
            return self.get_all_user_notifications(request, user_id)
        return Response({"Detail": "Needed data was not provided"}, status=status.HTTP_400_BAD_REQUEST)

    # Post notifications
    def post(self, request, format=None):
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"Detail": "Needed data was not provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, format=None):
        notification = Notification.objects.get(id=request.data["notificationId"])
        if notification:
            notification.viewed = True
            notification.save()
            return Response({"Detail": "The notification was marked as viewed"}, status=status.HTTP_200_OK)
        return Response({"Detail": "No Notification Found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, id=None, format=None):
        notification = Notification.objects.get(id=id)
        if notification:
            notification.delete()
            return Response({"Detail": "Notification has been deleted"}, status=status.HTTP_200_OK)
        return Response({"Detail": "No Notification Found"}, status=status.HTTP_400_BAD_REQUEST)