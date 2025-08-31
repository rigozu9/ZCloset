from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WardrobeView, DetectColorAndCategoryView, ClothingItemDeleteView, OutfitViewSet, list_categories, list_subcategories

router = DefaultRouter()
router.register('outfits', OutfitViewSet, basename='outfit')

urlpatterns = [
    path('wardrobe/', WardrobeView.as_view(), name='wardrobe'),
    path('detect-color_and_category/', DetectColorAndCategoryView.as_view(), name='detect-color'),
    path('wardrobe/<int:pk>/', ClothingItemDeleteView.as_view(), name='delete-item'),
    path('taxonomy/categories/', list_categories, name='taxonomy-categories'),
    path('taxonomy/categories/<slug:category_slug>/subcategories/', list_subcategories, name='taxonomy-subcategories'),

    path('', include(router.urls)),
]
