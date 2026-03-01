from django.urls import path
from . import views

urlpatterns = [
    path('checkout/', views.checkout_view, name='checkout'),
    path('place/', views.place_order, name='place_order'),
    path('payment/callback/', views.payment_callback, name='payment_callback'),
    path('', views.order_list, name='order_list'),
    path('<int:pk>/', views.order_detail, name='order_detail'),
]
