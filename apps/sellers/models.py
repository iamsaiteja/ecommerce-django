from django.db import models
from apps.users.models import User


class SellerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seller_profile')
    shop_name = models.CharField(max_length=200)
    shop_description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='sellers/', blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    gst_number = models.CharField(max_length=20, blank=True)
    bank_account = models.CharField(max_length=20, blank=True)
    ifsc_code = models.CharField(max_length=11, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.shop_name

    def total_products(self):
        return self.user.products.count()

    def total_sales(self):
        from apps.orders.models import OrderItem
        items = OrderItem.objects.filter(seller=self.user, order__payment_status='paid')
        return sum(i.subtotal() for i in items)
