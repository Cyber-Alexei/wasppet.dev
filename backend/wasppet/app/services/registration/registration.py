# generate_confirmation_links - imports
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
# send_confirmation_email - imports
from django.core.mail import send_mail
from django.conf import settings


def generate_confirmation_link(request, user):
    token = default_token_generator.make_token(user)
    userid64 = urlsafe_base64_encode(force_bytes(user.id))
    current_site = get_current_site(request)
    protocol = 'https' if request.is_secure() else 'http'
    return f"{protocol}://{current_site.domain}/confirm-account/{userid64}/{token}/"


def send_confirmation_email(user_email, confirmation_link):
    subject = 'Wasppet - Account confirmation'
    message = f'Please confirm your account by clicking the following link: {confirmation_link}'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user_email]

    send_mail(subject, message, from_email, recipient_list)
# For password changing, or email changing
def send_verification_code_email(user_email, code):
    subject = 'Wasppet - Verification code'
    message = f'The code for this operation is: {code}'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user_email]

    send_mail(subject, message, from_email, recipient_list)
