from django.shortcuts import redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Coupon


@login_required
def apply_coupon(request):
    if request.method == 'POST':
        code = request.POST.get('code', '').strip().upper()
        try:
            coupon = Coupon.objects.get(code=code)
            if coupon.is_valid():
                request.session['coupon_id'] = coupon.id
                messages.success(request, f'Coupon "{code}" applied!')
            else:
                messages.error(request, 'Coupon is expired or invalid.')
        except Coupon.DoesNotExist:
            messages.error(request, 'Invalid coupon code.')
    return redirect('cart')


@login_required
def remove_coupon(request):
    if 'coupon_id' in request.session:
        del request.session['coupon_id']
    messages.info(request, 'Coupon removed.')
    return redirect('cart')
