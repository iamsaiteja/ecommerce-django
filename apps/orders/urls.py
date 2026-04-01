from django.urls import path
from . import views

urlpatterns = [
    path('api/create/', views.create_order),
    path('api/verify/', views.verify_payment),
    path('api/history/', views.order_history),
    path('api/seller-dashboard/', views.seller_dashboard),
]