from django.shortcuts import redirect

def google_callback(request):
    access = "your_access_token"
    refresh = "your_refresh_token"

    return redirect(f"https://solemate01.vercel.app/login?access={access}&refresh={refresh}")