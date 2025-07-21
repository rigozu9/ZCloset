from django.urls import path
from .views import WardrobeView, DetectColorView

urlpatterns = [
    path('wardrobe/', WardrobeView.as_view(), name='wardrobe'),
    path('detect-color/', DetectColorView.as_view(), name='detect-color'),
]
