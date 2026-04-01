from django.contrib import admin
from .models import Product, Category, Review, ProductImage

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'seller', 'price', 'stock']
    list_filter = ['is_active', 'is_featured', 'category']
    search_fields = ['name', 'seller__email']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

admin.site.register(Review)
admin.site.register(ProductImage)