from rest_framework import serializers
from apps.products.models import Product, Category, Review
from apps.orders.models import Order, OrderItem
from apps.users.models import User


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    actual_price = serializers.SerializerMethodField()
    discount_pct = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'price', 'discount_price',
                  'actual_price', 'discount_pct', 'stock', 'image', 'is_active',
                  'is_featured', 'category_name', 'seller_name', 'created_at']

    def get_actual_price(self, obj):
        return obj.get_price()

    def get_discount_pct(self, obj):
        return obj.discount_percentage()


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['created_at']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'price', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'order_number', 'status', 'payment_status', 'subtotal',
                  'discount', 'total', 'coupon_code', 'items', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone', 'is_verified']
