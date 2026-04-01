import razorpay
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order, OrderItem
from apps.cart.models import CartItem

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    cart_items = CartItem.objects.filter(user=request.user).select_related('product')
    if not cart_items.exists():
        return Response({'error': 'Cart is empty'}, status=400)

    subtotal = sum(item.product.get_price() * item.quantity for item in cart_items)
    amount_paise = int(subtotal * 100)

    rz_order = client.order.create({
        'amount': amount_paise,
        'currency': 'INR',
        'payment_capture': 1
    })

    order = Order.objects.create(
        user=request.user,
        subtotal=subtotal,
        total=subtotal,
        razorpay_order_id=rz_order['id']
    )

    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            seller=item.product.seller,
            product_name=item.product.name,
            price=item.product.get_price(),
            quantity=item.quantity
        )

    return Response({
        'order_id': order.id,
        'order_number': order.order_number,
        'razorpay_order_id': rz_order['id'],
        'amount': amount_paise,
        'currency': 'INR',
        'key': settings.RAZORPAY_KEY_ID,
        'user_name': request.user.get_full_name() or request.user.username,
        'user_email': request.user.email,
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': request.data.get('razorpay_order_id'),
            'razorpay_payment_id': request.data.get('razorpay_payment_id'),
            'razorpay_signature': request.data.get('razorpay_signature'),
        })
        order = Order.objects.get(
            razorpay_order_id=request.data.get('razorpay_order_id'),
            user=request.user
        )
        order.payment_status = 'paid'
        order.status = 'confirmed'
        order.razorpay_payment_id = request.data.get('razorpay_payment_id')
        order.save()
        CartItem.objects.filter(user=request.user).delete()
        return Response({'message': 'Payment successful!', 'order_number': order.order_number})
    except Exception as e:
        return Response({'error': 'Payment verification failed'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_history(request):
    orders = Order.objects.filter(user=request.user).prefetch_related('items').order_by('-created_at')
    data = []
    for order in orders:
        data.append({
            'id': order.id,
            'order_number': order.order_number,
            'status': order.status,
            'payment_status': order.payment_status,
            'total': float(order.total),
            'created_at': order.created_at.strftime('%d %b %Y'),
            'items': [
                {
                    'product_name': i.product_name,
                    'price': float(i.price),
                    'quantity': i.quantity,
                    'subtotal': float(i.subtotal())
                } for i in order.items.all()
            ]
        })
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def seller_dashboard(request):
    seller_items = OrderItem.objects.filter(seller=request.user).select_related('order').order_by('-order__created_at')
    data = []
    for item in seller_items:
        data.append({
            'order_number': item.order.order_number,
            'product_name': item.product_name,
            'quantity': item.quantity,
            'price': float(item.price),
            'subtotal': float(item.subtotal()),
            'order_status': item.order.status,
            'payment_status': item.order.payment_status,
            'date': item.order.created_at.strftime('%d %b %Y'),
        })
    total_revenue = sum(float(i.subtotal()) for i in seller_items if i.order.payment_status == 'paid')
    return Response({'orders': data, 'total_revenue': total_revenue})