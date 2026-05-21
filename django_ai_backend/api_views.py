import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage

# Import the Custom AI Modules
from .greenwashing_nlp import GreenwashingDetector
from .predictive_analytics import CityPredictiveAnalytics
from .image_classification import IssueImageClassifier
from .sustainability_scorer import SustainabilityScorer
from .models import CityData, Report, CityGoal

# Initialize AI models globally to prevent reloading on every API call
try:
    nlp_detector = GreenwashingDetector()
    prophet_predictor = CityPredictiveAnalytics()
    image_classifier = IssueImageClassifier()
except Exception as e:
    print("AI Modules failed to load. Ensure requirements.txt is installed.", e)

@csrf_exempt
def api_analyze_report_text(request):
    """
    POST Endpoint: /api/ai/analyze-report/
    Body: {"text": "Our city is going 100% green without any specific data..."}
    """
    if request.method == "POST":
        data = json.loads(request.body)
        text = data.get('text', '')
        
        # Execute NLP Module
        analysis = nlp_detector.analyze_report(text)
        
        # Example of saving it to the database seamlessly
        # CityGoal.objects.create(sustainability_report_text=text, nlp_authenticity_score=analysis['authenticity_score'])
        
        return JsonResponse(analysis)
    return JsonResponse({"error": "POST method required"}, status=400)


@csrf_exempt
def api_predict_metrics(request, city_name):
    """
    GET Endpoint: /api/ai/predict-aqi/<city_name>/
    """
    if request.method == "GET":
        # 1. Fetch historical data from Django Database
        city_records = CityData.objects.filter(city_name=city_name).order_by('record_date')
        
        if city_records.count() < 3:
            return JsonResponse({"error": "Not enough historical data in DB for AI prediction."})

        dates = [record.record_date.strftime("%Y-%m-%d") for record in city_records]
        aqi_values = [record.aqi_level for record in city_records]

        # 2. Run Prophet AI
        prediction = prophet_predictor.predict_next_month(dates, aqi_values, metric_name="AQI")
        
        return JsonResponse(prediction)


@csrf_exempt
def api_classify_image(request):
    """
    POST Endpoint: /api/ai/classify-image/
    Requires form-data with 'image' file.
    """
    if request.method == "POST" and request.FILES.get('image'):
        image_file = request.FILES['image']
        
        # Temporarily save for TF parsing (or process in memory)
        file_path = default_storage.save('temp/' + image_file.name, image_file)
        full_path = default_storage.path(file_path)

        # Execute TF Image Classification
        classification = image_classifier.classify_image(full_path)
        
        # Clean up temp file
        default_storage.delete(file_path)

        return JsonResponse(classification)
    return JsonResponse({"error": "Image file required"}, status=400)


@csrf_exempt
def api_get_city_score(request, city_name):
    """
    GET Endpoint: /api/ai/city-score/<city_name>/
    Aggregates database metrics and runs the Scorer AI.
    """
    if request.method == "GET":
        # Mock metrics fetched from DB (in reality: sum/aggregate CityData & Reports)
        mock_pred_aqi = 110
        mock_resolved_pct = 75
        mock_authenticity = 88
        mock_budget_eff = 92
        
        final_score = SustainabilityScorer.calculate_city_score(
            mock_pred_aqi, mock_resolved_pct, mock_authenticity, mock_budget_eff
        )
        
        return JsonResponse(final_score)
