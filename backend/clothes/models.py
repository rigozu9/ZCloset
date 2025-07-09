from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class ClothingItem(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='clothing_images/', blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wardrobe')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"
