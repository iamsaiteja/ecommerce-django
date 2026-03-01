from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Address

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'username', 'role', 'is_verified']
    list_filter = ['role', 'is_verified']
    fieldsets = UserAdmin.fieldsets + (('Extra', {'fields': ('role', 'phone', 'is_verified')}),)

admin.site.register(Address)
