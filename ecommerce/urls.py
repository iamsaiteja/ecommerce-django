from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

urlpatterns = [
    path('', RedirectView.as_view(url='/api/', permanent=False)),  # root → api redirect
    path('admin/', admin.site.urls),
    path('api/', include('apps.api.urls')),
    path('cart/', include('apps.cart.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)