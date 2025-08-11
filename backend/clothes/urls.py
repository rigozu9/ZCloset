from django.urls import path
from .views import WardrobeView, DetectColorAndCategoryView, ClothingItemDeleteView, OutfitViewSet

create_outfit = OutfitViewSet.as_view({
    'post': 'create'
})

urlpatterns = [
    path('wardrobe/', WardrobeView.as_view(), name='wardrobe'),
    path('detect-color_and_category/', DetectColorAndCategoryView.as_view(), name='detect-color'),
    path('wardrobe/<int:pk>/', ClothingItemDeleteView.as_view(), name='delete-item'),
    path('outfits/', create_outfit, name='outfit-create'),
]
