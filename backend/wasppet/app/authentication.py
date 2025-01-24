from rest_framework.authentication import TokenAuthentication
from app.models import Token

class CustomAuthenticationToken(TokenAuthentication):
    def get_model(self):
        return Token