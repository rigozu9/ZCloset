from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import ClothingItem
from .serializers import ClothingItemSerializer
from .utils import get_dominant_color, closest_css_color

class WardrobeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = ClothingItem.objects.filter(user=request.user)
        serializer = ClothingItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ClothingItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DetectColorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        clothing_id = request.data.get('clothing_id')
        try:
            item = ClothingItem.objects.get(id=clothing_id, user=request.user)
            image_path = item.image.path

            rgb = get_dominant_color(image_path)
            color_name = closest_css_color(rgb)

            return Response({ 'color': color_name })

        except ClothingItem.DoesNotExist:
            return Response({ 'error': 'Vaatetta ei löytynyt' }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print('Virhe värin tunnistuksessa:', str(e))
            return Response({ 'error': 'Tunnistus epäonnistui' }, status=500)