from django.urls import path
from . import views

urlpatterns = [
    path('', views.product_list, name='product-list'),
    path('<int:pk>/', views.product_detail, name='product-detail'),
    path('<int:pk>/review/', views.add_review, name='add-review'),
    path('ai-search/', views.ai_product_search, name='ai-product-search'),
]