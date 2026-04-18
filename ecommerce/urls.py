from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

def home(request):   # 👈 add this
    return HttpResponse("Backend is running")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home),
    path('api/auth/', include('apps.api.urls')),
    path('api/products/', include('apps.products.urls')),
    path('api/cart/', include('apps.cart.urls')),
    path('api/orders/', include('apps.orders.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)