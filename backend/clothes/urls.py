from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WardrobeView, DetectColorAndCategoryView, ClothingItemDeleteView, OutfitViewSet

router = DefaultRouter()
router.register('outfits', OutfitViewSet, basename='outfit')

urlpatterns = [
    path('wardrobe/', WardrobeView.as_view(), name='wardrobe'),
    path('detect-color_and_category/', DetectColorAndCategoryView.as_view(), name='detect-color'),
    path('wardrobe/<int:pk>/', ClothingItemDeleteView.as_view(), name='delete-item'),
    path('', include(router.urls)),
]
