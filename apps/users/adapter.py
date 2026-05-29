from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from rest_framework_simplejwt.tokens import RefreshToken
import os


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):

    def get_login_redirect_url(self, request):

        print("🔥 CUSTOM ADAPTER RUNNING 🔥")

        user = request.user

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        IS_PRODUCTION = os.environ.get('DJANGO_ENV') == 'production'

        base_url = (
            "https://solemate01.vercel.app"
            if IS_PRODUCTION
            else "http://localhost:3000"
        )

        return f"{base_url}/login?access={access}&refresh={str(refresh)}"