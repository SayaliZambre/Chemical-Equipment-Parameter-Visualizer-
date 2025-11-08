from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UploadSessionViewSet, UserViewSet

router = DefaultRouter()
router.register(r'sessions', UploadSessionViewSet, basename='session')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]
