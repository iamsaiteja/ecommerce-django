from django.db import models
from django.conf import settings
from apps.products.models import Product

User = settings.AUTH_USER_MODEL

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # ← null=True 
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return self.product.name