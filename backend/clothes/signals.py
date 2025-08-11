# clothes/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import OutfitItem, ClothingItem

@receiver(post_save, sender=OutfitItem, dispatch_uid="oi_lastwore_set_v1")
def set_last_wore_on_create(sender, instance, created, **kwargs):
    if created:
        # Kun OutfitItem syntyy, se tulkitaan käytöksi
        ClothingItem.objects.filter(pk=instance.item_id).update(last_wore=instance.worn_at)

@receiver(post_delete, sender=OutfitItem, dispatch_uid="oi_lastwore_restore_v1")
def restore_last_wore_on_delete(sender, instance, **kwargs):
    # Kun OutfitItem poistuu (myös osana Outfitin kaskadia),
    # etsi saman ClothingItemin seuraavaksi uusin worn_at
    new_last = (
        OutfitItem.objects
        .filter(item_id=instance.item_id)
        .order_by("-worn_at")
        .values_list("worn_at", flat=True)
        .first()
    )
    ClothingItem.objects.filter(pk=instance.item_id).update(last_wore=new_last)