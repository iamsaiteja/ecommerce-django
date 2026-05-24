from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken

def google_callback(request):
    user = request.user

    # User login kaalekapothe — login page ki back (tokens lekundane)
    if not user.is_authenticated:
        return redirect("https://solemate01.vercel.app/login")

    # Tokens generate cheyyandi
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)
    refresh_token = str(refresh)

    # Tokens tho frontend ki redirect
    return redirect(
        f"https://solemate01.vercel.app/auth/callback"
        f"?access={access}&refresh={refresh_token}"
    )