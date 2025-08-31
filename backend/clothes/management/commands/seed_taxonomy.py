# clothes/management/commands/seed_taxonomy.py
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from clothes.models import Category, Subcategory

MAP = {
    "top": ["T-paita", "Huppari", "Kauluspaita", "Knit", "Svetari", "Toppi", "Polo"],
    "bottom": ["Farkut", "Cargohousut", "Shortsit", "Hame", "Chinot", "Collegehousut", "Puvun housut", "Housut"],
    "outerwear": ["Coach jacket", "Bomber", "Bleiseri", "Coat", "Jacket", "Varsity jacket", "Puffer jacket", "Trench coat", "Denim jacket"],
    "shoes": ["Tennarit", "Boots", "Loafers", "Saappaat", "Sandaalit"],
    "accessory": ["Laukku", "Vyö", "Lippis", "Kaulakoru", "Sormus"],
    "other": ["Muu vaate", "Dress"],
}

NAMES = {
    "top": "Yläosa",
    "bottom": "Alaosa",
    "outerwear": "Takki",
    "shoes": "Kengät",
    "accessory": "Asuste",
    "other": "Muu",
}

class Command(BaseCommand):
    help = "Seed categories and subcategories (idempotent)."

    def handle(self, *args, **options):
        for cat_slug, subs in MAP.items():
            cat, _ = Category.objects.update_or_create(
                slug=cat_slug,
                defaults={"name": NAMES.get(cat_slug, cat_slug.title())}
            )
            for sub in subs:
                Subcategory.objects.update_or_create(
                    category=cat,
                    slug=slugify(sub),
                    defaults={"name": sub},
                )
        self.stdout.write(self.style.SUCCESS("Seeded categories & subcategories"))
