import google.generativeai as genai
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Product, Review


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
            'image': f"/media/{p.image}" if p.image else None,
        })
    return Response(data)


@api_view(['GET'])
def product_detail(request, pk):
    try:
        p = Product.objects.get(id=pk, is_active=True)
        reviews_qs = list(p.reviews.select_related('user').all().order_by('-created_at'))
        reviews = [{'user': r.user.username, 'rating': r.rating, 'comment': r.comment} for r in reviews_qs]
        avg = round(sum(r.rating for r in reviews_qs) / len(reviews_qs), 1) if reviews_qs else 0
        data = {
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': str(p.price),
            'stock': p.stock,
            'category': p.category.name if p.category else None,
            'image': f"/media/{p.image}" if p.image else None,
            'reviews': reviews,
            'avg_rating': avg,
            'review_count': len(reviews),
        }
        return Response(data)
    except Product.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)


# ====== ADD / UPDATE REVIEW (login kavali) ======
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_review(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    try:
        rating = int(request.data.get('rating', 0))
    except (TypeError, ValueError):
        rating = 0
    comment = (request.data.get('comment') or '').strip()

    if rating < 1 or rating > 5:
        return Response({'error': 'Rating must be between 1 and 5'}, status=400)
    if not comment:
        return Response({'error': 'Comment required'}, status=400)

    # oka user oka product ki oka review (malli pettithe update avtundi)
    Review.objects.update_or_create(
        product=product,
        user=request.user,
        defaults={'rating': rating, 'comment': comment},
    )
    return Response({'message': 'Review submitted'}, status=201)


@api_view(['POST'])
@permission_classes([])
def ai_product_search(request):
    query = request.data.get('query', '')

    if not query:
        return Response({'error': 'Query required'}, status=400)

    products = Product.objects.filter(is_active=True)[:20]
    product_list = "\n".join([
        f"- {p.name}: ₹{p.price}" for p in products
    ])

    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash-latest')

    prompt = f"""
You are a shoe shopping assistant for SoleMate.
Customer query: {query}
Available products:
{product_list}
Suggest the best matching products and explain why.
Keep response short and helpful.
"""
    response = model.generate_content(prompt)

    return Response({
        'query': query,
        'suggestion': response.text
    })