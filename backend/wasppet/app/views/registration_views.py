from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from app.serializers import UserSerializer
from app.models import User
from django.core.exceptions import ValidationError

from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

from app.services.registration.registration import (
    generate_confirmation_link,
    send_confirmation_email,
)


class RegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    # Create user
    def post(self, request, format=None):
        user_data = {
            "username": request.data['username'],
            "email": request.data['email'],
        }
        # Extraer el campo password antes de guardar
        try:
            serializer = UserSerializer(data=user_data)
            if serializer.is_valid():
                user = serializer.save()
                user.set_password(request.data['password'])
                user.save()
                # Send confirmation email
                user = User.objects.get(email__exact=request.data['email'])
                confirmation_link = generate_confirmation_link(request, user)
                send_confirmation_email(user.email, confirmation_link)
                # url confirmation link:
                # "{protocol}://{current_site.domain}/confirm-account/{userid64}/{token}/"
                return Response(
                    {"Detail": "User Created, Email sent"}, status=status.HTTP_201_CREATED,
                )
        except ValidationError as e:
            print(e, "eeeeeeeeeeeeeeeee")
            return Response(
                e,
                status=status.HTTP_400_BAD_REQUEST
            )
        print(serializer.errors, "serializer errorsssssssss")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConfirmAccountView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, userid64, token):
        try:
            userid = force_str(urlsafe_base64_decode(userid64))
            user = User.objects.get(id=userid)
        except User.DoesNotExist:
            user = None
            return Response({"Detail": "No User Found - Corrupted Token"}, status=status.HTTP_404_NOT_FOUND)

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"Detail": "Account Confirmed"}, status=status.HTTP_200_OK)
        return Response(
            {"Detail": "Account Confirmation Failed - Corrupted Token"},
            status=status.HTTP_400_BAD_REQUEST,
        )
