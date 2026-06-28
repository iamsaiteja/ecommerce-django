from django.core.management.base import BaseCommand
from django.db.models import Count, Min
from apps.products.models import Product


class Command(BaseCommand):
    help = 'Remove duplicate products (same name), keep the oldest one'

    def handle(self, *args, **kwargs):
        # name tho group chesi, prati name entha saarlu unnado lekkinchu
        duplicates = (
            Product.objects.values('name')
            .annotate(count=Count('id'), keep_id=Min('id'))  # oldest = lowest id
            .filter(count__gt=1)  # 1 kanna ekkuva unna name ye duplicate
        )

        total_deleted = 0
        for dup in duplicates:
            name = dup['name']
            keep_id = dup['keep_id']  # idi okkati unchu
            # same name unna migata anni delete (keep_id thappa)
            qs = Product.objects.filter(name=name).exclude(id=keep_id)
            count = qs.count()
            qs.delete()
            total_deleted += count

        remaining = Product.objects.count()
        self.stdout.write(self.style.SUCCESS(
            f'Deleted {total_deleted} duplicate products. Remaining: {remaining}'
        ))