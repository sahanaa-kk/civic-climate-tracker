from django.db import models
from django.utils import timezone

class CityData(models.Model):
    city_name = models.CharField(max_length=100)
    record_date = models.DateField(default=timezone.now)
    aqi_level = models.FloatField()
    waste_recycled_pct = models.FloatField()
    budget_allocated = models.FloatField()
    budget_spent = models.FloatField()

class Report(models.Model):
    city = models.ForeignKey(CityData, on_delete=models.CASCADE)
    description = models.TextField()
    image = models.ImageField(upload_to='reports/', null=True, blank=True)
    ai_classified_category = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, default='Pending')

class CityGoal(models.Model):
    city = models.ForeignKey(CityData, on_delete=models.CASCADE)
    sustainability_report_text = models.TextField()
    nlp_authenticity_score = models.FloatField(null=True, blank=True)
    nlp_greenwashing_risk = models.FloatField(null=True, blank=True)
