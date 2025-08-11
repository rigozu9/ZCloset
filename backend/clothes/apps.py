from django.apps import AppConfig


class ClothesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'clothes'

    def ready(self):
        from . import signals  # lataa signaalit