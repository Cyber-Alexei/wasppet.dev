from app.models import Token
from rest_framework import status
from rest_framework.response import Response


# Functions to handle authentication with django rest framework tokens

class TokenManager:
    @staticmethod
    def get_user_with_token(token):
        try:
            # Get the instance of the token
            tokenInstance = Token.objects.get(key=token)
            if tokenInstance.is_expired():
                tokenInstance.delete()
                return None
            return tokenInstance.user
        except Token.DoesNotExist:
            return None


    # Login:
    # For the login. Get an existing or creates a new token when the user is logged in
    # Cases:
    #   When the user browser has deleted the token in the localstorage or there is no token
    @staticmethod
    def get_or_create_token(user):
        return Token.objects.get_or_create(user=user)


    # Logout
    @staticmethod
    def delete_token(token=None, user=None):
        if token:
            try:
                token = Token.objects.get(key=token)
                token.delete()
                return Response(
                    {"Detail": "Token Deleted"}, status=status.HTTP_204_NO_CONTENT
                )
            except Token.DoesNotExist:
                return Response(
                    {"Detail": "No Token Found"}, status=status.HTTP_404_NOT_FOUND
                )
        if user:
            try:
                token = Token.objects.get(user=user)
                token.delete()
                return Response(
                    {"Detail": "Token Deleted"}, status=status.HTTP_204_NO_CONTENT
                )
            except Token.DoesNotExist:
                return Response(
                    {"Detail": "No Token Found"}, status=status.HTTP_404_NOT_FOUND
                )
