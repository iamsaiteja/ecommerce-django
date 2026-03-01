from django.db import models
from django.utils import timezone


class Coupon(models.Model):
    TYPE_CHOICES = (('percentage', 'Percentage'), ('fixed', 'Fixed Amount'))
    code = models.CharField(max_length=50, unique=True)
    coupon_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='percentage')
    value = models.DecimalField(max_digits=10, decimal_places=2)
    min_purchase = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    valid_from = models.DateTimeField(default=timezone.now)
    valid_to = models.DateTimeField()
    usage_limit = models.PositiveIntegerField(default=100)
    used_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.code

    def is_valid(self):
        now = timezone.now()
        return self.is_active and self.valid_from <= now <= self.valid_to and self.used_count < self.usage_limit

    def get_discount(self, total):
        if not self.is_valid() or total < self.min_purchase:
            return 0
        if self.coupon_type == 'percentage':
            discount = total * self.value / 100
            if self.max_discount:
                discount = min(discount, self.max_discount)
        else:
            discount = self.value
        return min(discount, total)
