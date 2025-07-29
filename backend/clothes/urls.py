from django.urls import path
from .views import WardrobeView, DetectColorView, ClothingItemDeleteView

urlpatterns = [
    path('wardrobe/', WardrobeView.as_view(), name='wardrobe'),
    path('detect-color/', DetectColorView.as_view(), name='detect-color'),
    path('wardrobe/<int:pk>/', ClothingItemDeleteView.as_view(), name='delete-item'),
]
