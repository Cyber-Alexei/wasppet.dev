from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from app.services.django_rest_framework.token_functions import TokenManager
from django.core.exceptions import ValidationError
from app.models import User
from app.serializers import UserSerializer
from app.services.registration.registration import send_verification_code_email
from app.services.django_rest_framework.token_functions import TokenManager


class LoginView(APIView):
    def post(self, request, format=None):
        try:
            # User found
            user = User.objects.get(email__exact=request.data["email"])
            # Check password
            if user.check_password(request.data["password"]):
                # Delete last token if you will create a new one
                TokenManager.delete_token(user=user)
                token, newly_created = TokenManager.get_or_create_token(user)
                return Response(
                    {
                        "user": str(user.to_dict()),
                        "token": str(token),
                        "newly_created": str(newly_created),
                    },
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"Detail": "Incorrect password"}, status=status.HTTP_400_BAD_REQUEST
            )
        except User.DoesNotExist:
            return Response(
                {"Detail": "Email was not found, are you registered?"},
                status=status.HTTP_404_NOT_FOUND,
            )


class GetUserWithTokenView(APIView):
    def post(self, request, format=None):
        try:
            # Get the token from the request
            token = request.data["token"]
            # The user is obtained using the token
            user = TokenManager.get_user_with_token(token)
            if user is None:
                return Response(
                    {"Detail": "Token invalid or expired"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            if user:
                user.last_login = timezone.now()
                user.save()
                serializer = UserSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"Detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ChangePassword(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, format=None):
        try:
            user = User.objects.get(id__exact=request.data["id"])
            if user.check_password(request.data["current_password"]):
                user.set_password(request.data["new_password"])
                user.save()
                return Response(
                    {"Detail": "Password has been changed successfully"},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"Detail": "Your current password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response({"Detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SendVerificationCode(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        try:
            code = request.data["randomCode"]
            new_email = request.data["new_email"]
            current_email = request.data["current_email"]
            password = request.data["password"]
            # Get the user instance
            user = User.objects.get(email__exact=current_email)
            # Verify the user password is correct
            if not user.check_password(password):
                return Response(
                    {"Detail": "Password incorrect"}, status=status.HTTP_400_BAD_REQUEST
                )
            # Send the verification code
            if code and new_email:
                send_verification_code_email(new_email, code)
                return Response(
                    {"Detail": "The email with the verification code has been sent"},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"Detail": "Email or code was not provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Verify the user exists
        except User.DoesNotExist:
            return Response(
                {"Detail": "User was not found"}, status=status.HTTP_400_BAD_REQUEST
            )
        # Catch the rest of exceptions
        except Exception as e:
            return Response({"Detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class forgotPasswordVerificationCode(APIView):

    def post(self, request, format=None):
        try:
            code = request.data["randomCode"]
            email = request.data["email"]
            user = User.objects.get(email__exact=email)
            if code and email:
                send_verification_code_email(email, code)
                return Response(
                    {"Detail": "The email with the verification code has been sent"},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"Detail": "Email or code was not provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except User.DoesNotExist:
            return Response(
                {"Detail": "The user was not found"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({"Detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class recoverPassword(APIView):

    def post(self, request, format=None):
        try:
            user_email = request.data["user_email"]
            user = User.objects.get(email__exact=user_email)
            if user:
                user.set_password(request.data["new_password"])
                user.save()
                return Response(
                    {"Detail": "Password has been changed successfully"},
                    status=status.HTTP_200_OK,
                )
        except User.DoesNotExist:
            return Response(
                {"Detail": "User was not found"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({"Detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
