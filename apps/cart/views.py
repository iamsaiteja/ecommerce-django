from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from .models import Cart, CartItem
from apps.products.models import Product
from apps.coupons.models import Coupon
import json


@login_required
def cart_view(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    coupon = request.session.get('coupon_id')
    discount = 0
    coupon_obj = None
    if coupon:
        try:
            coupon_obj = Coupon.objects.get(id=coupon, is_active=True)
            discount = coupon_obj.get_discount(cart.total())
        except Coupon.DoesNotExist:
            del request.session['coupon_id']
    return render(request, 'cart/cart.html', {
        'cart': cart,
        'discount': discount,
        'coupon': coupon_obj,
        'final_total': cart.total() - discount
    })


@login_required
def add_to_cart(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    cart, _ = Cart.objects.get_or_create(user=request.user)
    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        item.quantity += 1
        item.save()
    messages.success(request, f'{product.name} added to cart!')
    return redirect(request.META.get('HTTP_REFERER', 'cart'))


@login_required
def remove_from_cart(request, item_id):
    item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    item.delete()
    messages.info(request, 'Item removed from cart.')
    return redirect('cart')


@login_required
def update_cart(request, item_id):
    item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    qty = int(request.POST.get('quantity', 1))
    if qty > 0:
        item.quantity = qty
        item.save()
    else:
        item.delete()
    return redirect('cart')


def cart_count(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return {'cart_count': cart.item_count()}
    return {'cart_count': 0}
