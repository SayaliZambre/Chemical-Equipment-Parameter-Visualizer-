from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UploadSession, EquipmentData

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class EquipmentDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentData
        fields = ['id', 'name', 'equipment_type', 'flowrate', 'pressure', 'temperature']

class UploadSessionSerializer(serializers.ModelSerializer):
    equipment_items = EquipmentDataSerializer(many=True, read_only=True)
    
    class Meta:
        model = UploadSession
        fields = ['id', 'created_at', 'file_name', 'total_count', 'avg_flowrate', 
                  'avg_pressure', 'avg_temperature', 'equipment_distribution', 'equipment_items']
