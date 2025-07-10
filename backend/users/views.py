from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User

# Create your views here.

class RegisterView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        # Tarkista että molemmat kentät ovat mukana
        if not username or not password:
            return Response(
                {"error": "Käyttäjänimi ja salasana vaaditaan"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Tarkista onko käyttäjänimi jo varattu
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Käyttäjänimi on jo käytössä"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Luo uusi käyttäjä
        User.objects.create_user(username=username, password=password)

        return Response(
            {"message": "Käyttäjä luotu onnistuneesti!"},
            status=status.HTTP_201_CREATED
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    return Response({
        'username': request.user.username
    })