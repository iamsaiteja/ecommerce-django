from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product

@api_view(['GET'])
def product_list(request):
    products = Product.objects.filter(is_active=True).select_related('category')
    data = []
    for p in products:
        data.append({
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': str(p.price),
            'stock': p.stock,
            'category': p.category.name if p.category else None,
            'image': f"http://3.237.9.42{p.image.url}"
        })
    return Response(data)

@api_view(['GET'])
def product_detail(request, pk):
    try:
        p = Product.objects.get(id=pk, is_active=True)
        reviews = [{'user': r.user.username, 'rating': r.rating, 'comment': r.comment} for r in p.reviews.all()]
        data = {
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': str(p.price),
            'stock': p.stock,
            'category': p.category.name if p.category else None,
            'image': f"http://3.237.9.42{p.image.url}" if p.image else None,
            'reviews': reviews,
        }
        return Response(data)
    except Product.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)