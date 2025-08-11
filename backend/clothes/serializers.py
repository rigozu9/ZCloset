# clothes/serializers.py
from rest_framework import serializers
from .models import ClothingItem, Outfit, OutfitItem

class ClothingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothingItem
        fields = ['id', 'name', 'color', 'image', 'category', 'subcategory', 'uploaded_at', 'last_wore']
        read_only_fields = ['id', 'uploaded_at', 'last_wore']


# --- Outfit ---
class OutfitItemWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutfitItem
        fields = ["item", "slot", "position", "note"]  # item = ClothingItem id

class OutfitItemReadSerializer(serializers.ModelSerializer):
    item = ClothingItemSerializer(read_only=True)
    class Meta:
        model = OutfitItem
        fields = ["id", "slot", "position", "note", "worn_at", "item"]

class OutfitReadSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = Outfit
        fields = ["id", "name", "notes", "created_at", "items"]

    def get_items(self, obj):
        qs = obj.outfit_items.select_related("item").order_by("slot", "position")
        return OutfitItemReadSerializer(qs, many=True).data

class OutfitWriteSerializer(serializers.ModelSerializer):
    items = OutfitItemWriteSerializer(many=True, write_only=True)

    class Meta:
        model = Outfit
        fields = ["id", "name", "notes", "items"]

    # kevyt validointi
    def validate(self, data):
        user = self.context["request"].user
        items = data.get("items", [])
        if not items:
            raise serializers.ValidationError("Outfit tarvitsee vähintään yhden itemin.")
        # hae kaikki annetut itemit kerralla
        item_ids = [row["item"].id if hasattr(row["item"], "id") else row["item"] for row in items]
        ci_by_id = {ci.id: ci for ci in ClothingItem.objects.filter(id__in=item_ids)}
        # omistajuus + kategoriamatch
        for row in items:
            ci_id = row["item"].id if hasattr(row["item"], "id") else row["item"]
            ci = ci_by_id.get(ci_id)
            if not ci or ci.user_id != user.id:
                raise serializers.ValidationError("Kaikkien vaatteiden pitää kuulua sinulle.")
            if ci.category != row["slot"]:
                raise serializers.ValidationError(f"'{ci.name}': category {ci.category} != slot {row['slot']}")
        return data

    def create(self, validated_data):
        items = validated_data.pop("items", [])
        outfit = Outfit.objects.create(user=self.context["request"].user, **validated_data)
        # LUO YKSI KERRALLAAN → signaalit laukeavat (last_wore päivittyy)
        for row in items:
            OutfitItem.objects.create(
                outfit=outfit,
                item=row["item"],
                slot=row["slot"],
                position=row.get("position", 0),
                note=row.get("note", ""),
            )
        return outfit

    def update(self, instance, validated_data):
        items = validated_data.pop("items", None)
        instance.name = validated_data.get("name", instance.name)
        instance.notes = validated_data.get("notes", instance.notes)
        instance.save()
        if items is not None:
            # poistot → post_delete palauttaa last_worea
            instance.outfit_items.all().delete()
            # lisäykset → post_save nostaa last_worea
            for row in items:
                OutfitItem.objects.create(
                    outfit=instance,
                    item=row["item"],
                    slot=row["slot"],
                    position=row.get("position", 0),
                    note=row.get("note", ""),
                )
        return instance
