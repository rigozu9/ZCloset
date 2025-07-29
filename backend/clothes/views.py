from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import DestroyAPIView
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
            item = serializer.save(user=request.user)
        # 🔍 Tunnista väri kuvan perusteella ja tallenna se
            if item.image:
                try:
                    image_path = item.image.path
                    rgb = get_dominant_color(image_path)
                    color_name = closest_css_color(rgb)
                    item.color = color_name
                    item.save(update_fields=['color'])
                except Exception as e:
                    print('Virhe värin tunnistuksessa:', str(e))

            return Response(ClothingItemSerializer(item).data, status=status.HTTP_201_CREATED)
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
        
class ClothingItemDeleteView(DestroyAPIView):
    serializer_class = ClothingItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print(f"[DEBUG] get_queryset: käyttäjä = {self.request.user}")
        qs = ClothingItem.objects.filter(user=self.request.user)
        print(f"[DEBUG] käyttäjän omat vaatteet: {[item.id for item in qs]}")
        return qs

    def delete(self, request, *args, **kwargs):
        print(f"[DEBUG] Poistetaan vaate id = {kwargs.get('pk')}, käyttäjä = {request.user}")
        return super().delete(request, *args, **kwargs)