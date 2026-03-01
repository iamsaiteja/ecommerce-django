from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.forms import ModelForm
from .models import SellerProfile
from apps.products.models import Product, Category
from apps.orders.models import OrderItem
from django import forms


class SellerProfileForm(ModelForm):
    class Meta:
        model = SellerProfile
        fields = ['shop_name', 'shop_description', 'logo', 'gst_number', 'bank_account', 'ifsc_code']
        widgets = {f: forms.TextInput(attrs={'class': 'w-full px-4 py-2 border rounded-lg'}) for f in ['shop_name', 'gst_number', 'bank_account', 'ifsc_code']}


class ProductForm(ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'slug', 'category', 'description', 'price', 'discount_price', 'stock', 'image', 'is_active', 'is_featured']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'w-full px-4 py-2 border rounded-lg'}),
            'slug': forms.TextInput(attrs={'class': 'w-full px-4 py-2 border rounded-lg'}),
            'description': forms.Textarea(attrs={'class': 'w-full px-4 py-2 border rounded-lg', 'rows': 4}),
            'price': forms.NumberInput(attrs={'class': 'w-full px-4 py-2 border rounded-lg'}),
            'discount_price': forms.NumberInput(attrs={'class': 'w-full px-4 py-2 border rounded-lg'}),
            'stock': forms.NumberInput(attrs={'class': 'w-full px-4 py-2 border rounded-lg'}),
            'category': forms.Select(attrs={'class': 'w-full px-4 py-2 border rounded-lg'}),
        }


def seller_required(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'seller':
            messages.error(request, 'Seller access required!')
            return redirect('login')
        return view_func(request, *args, **kwargs)
    return wrapper


@login_required
def seller_setup(request):
    try:
        profile = request.user.seller_profile
        return redirect('seller_dashboard')
    except SellerProfile.DoesNotExist:
        pass
    if request.method == 'POST':
        form = SellerProfileForm(request.POST, request.FILES)
        if form.is_valid():
            profile = form.save(commit=False)
            profile.user = request.user
            profile.save()
            request.user.role = 'seller'
            request.user.save()
            messages.success(request, 'Seller profile created! Awaiting approval.')
            return redirect('seller_dashboard')
    else:
        form = SellerProfileForm()
    return render(request, 'sellers/setup.html', {'form': form})


@seller_required
def seller_dashboard(request):
    profile = get_object_or_404(SellerProfile, user=request.user)
    products = Product.objects.filter(seller=request.user)
    recent_orders = OrderItem.objects.filter(seller=request.user).order_by('-order__created_at')[:10]
    return render(request, 'sellers/dashboard.html', {
        'profile': profile,
        'products': products,
        'recent_orders': recent_orders,
    })


@seller_required
def add_product(request):
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            product = form.save(commit=False)
            product.seller = request.user
            product.save()
            messages.success(request, 'Product added successfully!')
            return redirect('seller_dashboard')
    else:
        form = ProductForm()
    return render(request, 'sellers/product_form.html', {'form': form, 'title': 'Add Product'})


@seller_required
def edit_product(request, pk):
    product = get_object_or_404(Product, pk=pk, seller=request.user)
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            messages.success(request, 'Product updated!')
            return redirect('seller_dashboard')
    else:
        form = ProductForm(instance=product)
    return render(request, 'sellers/product_form.html', {'form': form, 'title': 'Edit Product'})
