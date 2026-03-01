from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('categories', views.CategoryViewSet)
router.register('products', views.ProductViewSet)
router.register('orders', views.OrderViewSet, basename='api_order')

urlpatterns = [
    path('auth/login/', views.api_login, name='api_login'),
    path('', include(router.urls)),
]
