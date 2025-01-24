from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from app.serializers import UserSerializer
from app.models import User
from django.db.models import Q
# -----------
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile


class UserView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Get an object / instance
    def get_object(self, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None
    
    # Get user by username
    def get_user_by_username(self, request, username):
        try:
            user = User.objects.get(username__exact=username).to_dict()
            return Response(user, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"Detail": "User Not Found"}, status=status.HTTP_404_NOT_FOUND)

    # Filter users by username(@)
    def filter_users_by_username(self, username, format=None):
        users = User.objects.filter(username__icontains=username)
        if users.exists():
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"Detail": "No Users Found"}, status=status.HTTP_404_NOT_FOUND)

    # Filter users by name
    def filter_users_by_name(self, complete_name, format=None):
        users = User.objects.filter(complete_name__icontains=complete_name)
        if users.exists():
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"Detail": "No Users Found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Filter by complete name and username
    def filter_by_complete_name_and_username(self, request, query, format=None):
        users = User.objects.filter(Q(complete_name__icontains=query) | Q(username__icontains=query))
        if users.exists():
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"Detail": "No Users Found"}, status=status.HTTP_404_NOT_FOUND)

    # Get all users of the friend list
    def get_all_friends_list(self, id, format=None):
        user = self.get_object(id)
        if user is None:
            return Response({"Detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        return self.get_multiple_users(user.friends_list)

    # -------------------------------------------------

    # Get user or users
    def get(
        self,
        request,
        id=None,
        username=None,
        complete_name=None,
        friends_of_id=None,
        query=None,
        mode=None,
    ):
        if id:
            user = self.get_object(id)
            if user is None:
                return Response({"Detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif username and mode == 'search-by-username':
            return self.get_user_by_username(request, username)
        elif username:
            return self.filter_users_by_username(request, username)
        elif complete_name:
            return self.filter_users_by_name(request, complete_name)
        elif query:
            return self.filter_by_complete_name_and_username(request, query)
        elif friends_of_id:
            return self.get_all_friends_list(request, friends_of_id)
        return Response({"Detail": "Invalid Request"}, status=status.HTTP_400_BAD_REQUEST)

    # Update user
    def put(self, request, id, format=None):
        try:
            user = self.get_object(id)
            if user is None:
                return Response({"Detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

    # Delete user
    def delete(self, request, id, format=None):
        user = self.get_object(id)
        if user is None:
            return Response({"Detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response({"Detail": "User Deleted"}, status=status.HTTP_200_OK)

class UserView2(APIView):
    # Get multiple users
    def post(self, request, format=None):
        users_ids = request.data["data"]
        if users_ids:
            # Get all specified users by IDs
            users = User.objects.filter(id__in=users_ids)
            if users.exists():
                serializer = UserSerializer(users, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({"Detail": "No Users Found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"Detail": "Users ids not provided"}, status=status.HTTP_400_BAD_REQUEST)

class UploadUserAvatar(APIView):
    permission_classes = [permissions.IsAuthenticated]

    """
    def handle_uploaded_file(request, f):
        try:
            img = Image.open(f)
            img.thumbnail((1920, 1920))  # Change the size to a maximum of
            thumb_io = BytesIO()
            img.save(thumb_io, format='JPG', quality=90)  # Quality
            thumb_file = ContentFile(thumb_io.getvalue(), name=f.name)
            return thumb_file
        except Exception as e:
            return e
    """

    def put(self, request, user_id):
        try:
            image = request.data.get('avatar')
            user = User.objects.get(id=user_id)
            if image and user:
                if user.avatar:
                    user.avatar.delete(save=False);
                serializer = UserSerializer(user, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)