import re
from django.core.exceptions import ValidationError


# Validator for the set_password() method of the AbstractUser.
# Used for django-contrib-auth to store user password when the 
# user model extends AbstractUser / AbstractBaseUser.

class ValidatePassword:
    def validate(self, password, user=None):

        if not re.search(r'[A-Z]', password):
            raise ValidationError('The password must contain at least one capital letter.')

        if not re.search(r'[!@#$%^&*(),+=.?":{}|<>]', password):
            raise ValidationError('The password must contain at least one symbol.')

    def get_help_text(self):
        return ("Your password must contain at least 1 uppercase letter and 1 symbol.")
