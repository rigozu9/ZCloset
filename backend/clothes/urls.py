from django.urls import path
from .views import WardrobeView

urlpatterns = [
    path('wardrobe/', WardrobeView.as_view(), name='wardrobe'),
]
