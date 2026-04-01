from django.http import JsonResponse
from .models import Product

def product_list_api(request):
    
    products = Product.objects.all()

    data = []

    for p in products:
        data.append({
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "image": p.image.url if p.image else ""
        })

    return JsonResponse(data, safe=False)