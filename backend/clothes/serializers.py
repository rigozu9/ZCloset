# clothes/serializers.py
from rest_framework import serializers
from .models import Category, Subcategory, ClothingItem, Outfit, OutfitItem

# --- Taksonomia ---
class SubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        fields = ("slug", "name")

class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubcategorySerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = ("slug", "name", "subcategories")


# --- ClothingItem ---
# Lukemiseen: näytä kategoriat ja alakategoriat slugina (lähde: *_ref)
class ClothingItemReadSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="slug", read_only=True)
    subcategory = serializers.SlugRelatedField(slug_field="slug", read_only=True)

    class Meta:
        model = ClothingItem
        fields = ["id", "name", "color", "image", "category", "subcategory", "uploaded_at", "last_wore"]
        read_only_fields = ["id", "uploaded_at", "last_wore"]

# Kirjoittamiseen: vastaanota slug-arvot ja tallenna *_ref-kenttiin
class ClothingItemWriteSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        slug_field="slug", queryset=Category.objects.all())
    subcategory = serializers.SlugRelatedField(
        slug_field="slug", queryset=Subcategory.objects.all())

    class Meta:
        model = ClothingItem
        fields = ["name", "color", "image", "category", "subcategory"]

    def validate(self, attrs):
        cat = attrs.get("category")
        sub = attrs.get("subcategory")
        if cat and sub and sub.category_id != cat.pk:
            raise serializers.ValidationError({"subcategory": "Alakategorian on kuuluttava valittuun kategoriaan."})
        return attrs


# --- Outfit ---
class ClothingItemSerializer(serializers.ModelSerializer):
    """Kevyt lukuserialisoija Outfitin sisäiseen item-näyttöön."""
    # Näytetään käyttäjälle slugimuodossa nykyisestä siirtymävaiheesta riippumatta
    category = serializers.SerializerMethodField()
    subcategory = serializers.SerializerMethodField()

    class Meta:
        model = ClothingItem
        fields = ['id', 'name', 'color', 'image', 'category', 'subcategory', 'uploaded_at', 'last_wore']
        read_only_fields = ['id', 'uploaded_at', 'last_wore']

    def get_category(self, obj):
        # palauta aina slug FK:sta
        return getattr(getattr(obj, "category", None), "slug", None)

    def get_subcategory(self, obj):
        return getattr(getattr(obj, "subcategory", None), "slug", None)


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
        # omistajuus + kategoriamatch (tukee sekä vanhaa CharFieldiä että uutta FK:ta)
        for row in items:
            ci_id = row["item"].id if hasattr(row["item"], "id") else row["item"]
            ci = ci_by_id.get(ci_id)
            if not ci or ci.user_id != user.id:
                raise serializers.ValidationError("Kaikkien vaatteiden pitää kuulua sinulle.")
            ci_cat_slug = getattr(getattr(ci, "category", None), "slug", None)
            if ci_cat_slug != row["slot"]:
                raise serializers.ValidationError(f"'{ci.name}': category {ci_cat_slug} != slot {row['slot']}")
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
            instance.outfit_items.all().delete()
            for row in items:
                OutfitItem.objects.create(
                    outfit=instance,
                    item=row["item"],
                    slot=row["slot"],
                    position=row.get("position", 0),
                    note=row.get("note", ""),
                )
        return instance
