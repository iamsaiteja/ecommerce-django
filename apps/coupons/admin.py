from django.contrib import admin
from .models import Coupon

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'coupon_type', 'value', 'is_active', 'valid_to', 'used_count']
    list_editable = ['is_active']
