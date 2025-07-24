from django.db import models
from django.contrib.auth.models import User

class ClothingItem(models.Model):
    CATEGORY_CHOICES = [
        ('top', 'Top'),
        ('bottom', 'Bottom'),
        ('outerwear', 'Outerwear'),
        ('shoes', 'Shoes'),
        ('accessory', 'Accessory'),
        ('other', 'Other'),
    ]

    SUBCATEGORY_CHOICES = [
        # Top
        ('T-paita', 'T-paita'),
        ('Huppari', 'Huppari'),
        ('Kauluspaita', 'Kauluspaita'),
        ('Knit', 'Knit'),

        # Bottom
        ('Farkut', 'Farkut'),
        ('Shortsit', 'Shortsit'),
        ('Hame', 'Hame'),
        ('Puvun housut', 'Puvun housut'),

        # Outerwear
        ('Coach jacket', 'Coach jacket'),
        ('Bomber', 'Bomber'),
        ('Bleiseri', 'Bleiseri'),

        # Shoes
        ('Tennarit', 'Tennarit'),
        ('Saappaat', 'Saappaat'),
        ('Sandaalit', 'Sandaalit'),

        # Accessory
        ('Laukku', 'Laukku'),
        ('Vyö', 'Vyö'),
        ('Lippis', 'Lippis'),
        ('Kaulakoru', 'Kaulakoru'),

        # Other
        ('Muu vaate', 'Muu vaate'),
    ]

    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='clothing_images/', blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    subcategory = models.CharField(max_length=50, choices=SUBCATEGORY_CHOICES, default='Muu vaate')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wardrobe')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"
