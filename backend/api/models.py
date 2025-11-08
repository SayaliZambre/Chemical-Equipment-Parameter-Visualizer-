from django.db import models
from django.contrib.auth.models import User
import json

class UploadSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='upload_sessions')
    created_at = models.DateTimeField(auto_now_add=True)
    file_name = models.CharField(max_length=255)
    total_count = models.IntegerField(default=0)
    avg_flowrate = models.FloatField(default=0)
    avg_pressure = models.FloatField(default=0)
    avg_temperature = models.FloatField(default=0)
    equipment_distribution = models.JSONField(default=dict)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.file_name} - {self.created_at}"

class EquipmentData(models.Model):
    session = models.ForeignKey(UploadSession, on_delete=models.CASCADE, related_name='equipment_items')
    name = models.CharField(max_length=255)
    equipment_type = models.CharField(max_length=100)
    flowrate = models.FloatField()
    pressure = models.FloatField()
    temperature = models.FloatField()
    
    def __str__(self):
        return f"{self.name} ({self.equipment_type})"
