from rest_framework import serializers
from .models import ClothingItem

class ClothingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothingItem
        fields = ['id', 'name', 'color', 'image', 'category', 'subcategory', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']
