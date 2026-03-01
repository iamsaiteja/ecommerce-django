from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import razorpay
import json

from .models import Order, OrderItem
from apps.cart.models import Cart
from apps.users.models import Address
from apps.coupons.models import Coupon


@login_required
def checkout_view(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    if not cart.items.exists():
        messages.warning(request, 'Your cart is empty!')
        return redirect('cart')
    addresses = request.user.addresses.all()
    return render(request, 'orders/checkout.html', {'cart': cart, 'addresses': addresses})


@login_required
def place_order(request):
    if request.method != 'POST':
        return redirect('checkout')

    cart, _ = Cart.objects.get_or_create(user=request.user)
    if not cart.items.exists():
        return redirect('cart')

    address_id = request.POST.get('address_id')
    address = get_object_or_404(Address, id=address_id, user=request.user)

    subtotal = cart.total()
    discount = 0
    coupon_code = ''
    coupon_id = request.session.get('coupon_id')
    if coupon_id:
        try:
            coupon = Coupon.objects.get(id=coupon_id, is_active=True)
            discount = coupon.get_discount(subtotal)
            coupon_code = coupon.code
        except Coupon.DoesNotExist:
            pass

    total = subtotal - discount
    total_paise = int(total * 100)

    # Create Razorpay order
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    rz_order = client.order.create({
        'amount': total_paise,
        'currency': 'INR',
        'payment_capture': '1',
    })

    order = Order.objects.create(
        user=request.user,
        address=address,
        subtotal=subtotal,
        discount=discount,
        total=total,
        coupon_code=coupon_code,
        razorpay_order_id=rz_order['id'],
    )

    for item in cart.items.all():
        OrderItem.objects.create(
            order=order,
            product=item.product,
            seller=item.product.seller,
            product_name=item.product.name,
            price=item.product.get_price(),
            quantity=item.quantity,
        )
        # Reduce stock
        item.product.stock -= item.quantity
        item.product.save()

    cart.items.all().delete()
    if 'coupon_id' in request.session:
        del request.session['coupon_id']

    return render(request, 'orders/payment.html', {
        'order': order,
        'razorpay_key': settings.RAZORPAY_KEY_ID,
        'amount': total_paise,
        'currency': 'INR',
    })


@csrf_exempt
def payment_callback(request):
    if request.method == 'POST':
        data = request.POST
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        try:
            client.utility.verify_payment_signature({
                'razorpay_order_id': data['razorpay_order_id'],
                'razorpay_payment_id': data['razorpay_payment_id'],
                'razorpay_signature': data['razorpay_signature'],
            })
            order = Order.objects.get(razorpay_order_id=data['razorpay_order_id'])
            order.razorpay_payment_id = data['razorpay_payment_id']
            order.payment_status = 'paid'
            order.status = 'confirmed'
            order.save()
            messages.success(request, f'Payment successful! Order #{order.order_number} placed.')
            return redirect('order_detail', pk=order.pk)
        except Exception as e:
            messages.error(request, 'Payment verification failed!')
            return redirect('cart')
    return HttpResponse(status=400)


@login_required
def order_list(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'orders/list.html', {'orders': orders})


@login_required
def order_detail(request, pk):
    order = get_object_or_404(Order, pk=pk, user=request.user)
    return render(request, 'orders/detail.html', {'order': order})
