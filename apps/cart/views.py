from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import CartItem
from apps.products.models import Product

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    items = CartItem.objects.filter(user=request.user).select_related('product')
    data = []
    for item in items:
        p = item.product
        data.append({
            'id': item.id,
            'product_id': p.id,
            'name': p.name,
            'price': float(p.get_price()),
            'image': p.image.url if p.image else '',
            'quantity': item.quantity,
            'subtotal': float(p.get_price() * item.quantity)
        })
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))
    try:
        product = Product.objects.get(id=product_id, is_active=True)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    item, created = CartItem.objects.get_or_create(
        user=request.user, product=product,
        defaults={'quantity': quantity}
    )
    if not created:
        item.quantity += quantity
        item.save()
    return Response({'message': 'Added to cart', 'quantity': item.quantity})

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_cart_item(request, item_id):
    quantity = int(request.data.get('quantity', 1))
    try:
        item = CartItem.objects.get(id=item_id, user=request.user)
        if quantity <= 0:
            item.delete()
            return Response({'message': 'Removed'})
        item.quantity = quantity
        item.save()
        return Response({'message': 'Updated'})
    except CartItem.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):
    try:
        CartItem.objects.get(id=item_id, user=request.user).delete()
        return Response({'message': 'Removed'})
    except CartItem.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)