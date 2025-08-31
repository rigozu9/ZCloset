from django.db import models
from django.contrib.auth.models import User
from django.db.models import Q

class Category(models.Model):
    slug = models.SlugField(primary_key=True, max_length=30)   # esim. "top"
    name = models.CharField(max_length=50)                     # esim. "Yläosa"

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Subcategory(models.Model):
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="subcategories"
    )
    slug = models.SlugField(max_length=40)   # esim. "t-paita"
    name = models.CharField(max_length=60)   # esim. "T-paita"

    class Meta:
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(
                fields=["category", "slug"], name="uniq_sub_slug_per_cat"
            )
        ]

    def __str__(self):
        return f"{self.category.slug} / {self.name}"

class ClothingItem(models.Model):
    CATEGORY_CHOICES = [
        ('top', 'Top'),
        ('bottom', 'Bottom'),
        ('outerwear', 'Outerwear'),
        ('shoes', 'Shoes'),
        ('accessory', 'Accessory'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='clothing_images/', blank=True, null=True)
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name="items",
        null=True, blank=True
    )
    subcategory = models.ForeignKey(
        Subcategory, on_delete=models.PROTECT, related_name="items",
        null=True, blank=True
    )
    color = models.CharField(max_length=30, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wardrobe')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    last_wore = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"

class Outfit(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="outfits")
    name = models.CharField(max_length=100)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    items = models.ManyToManyField("ClothingItem", through="OutfitItem", related_name="outfits")

    def __str__(self):
        return f"{self.name} ({self.user.username})"
    

class OutfitItem(models.Model):
    SLOT_CHOICES = ClothingItem.CATEGORY_CHOICES

    outfit = models.ForeignKey(Outfit, on_delete=models.CASCADE, related_name="outfit_items")
    item = models.ForeignKey(ClothingItem, on_delete=models.CASCADE, related_name="as_outfit_item")
    slot = models.CharField(max_length=20, choices=SLOT_CHOICES)
    position = models.PositiveIntegerField(default=0)
    note = models.CharField(max_length=120, blank=True)
    worn_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["slot", "position"]
        # Salli vain yksi top/bottom/outerwear/shoes per outfit; accessory/other voi olla useita
        constraints = [
            models.UniqueConstraint(
                fields=["outfit", "slot"],
                name="uniq_single_slot_per_outfit",
                condition=~Q(slot__in=["accessory", "other"]),
            )
        ]

    def __str__(self):
        return f"{self.outfit.name}: {self.slot} -> {self.item.name}"