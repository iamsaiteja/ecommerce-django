from django.urls import path
from . import views

urlpatterns = [
    path('setup/', views.seller_setup, name='seller_setup'),
    path('dashboard/', views.seller_dashboard, name='seller_dashboard'),
    path('product/add/', views.add_product, name='add_product'),
    path('product/<int:pk>/edit/', views.edit_product, name='edit_product'),
]
