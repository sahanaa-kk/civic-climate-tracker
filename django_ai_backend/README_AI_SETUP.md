# SustainableTracking AI Backend Integration Guide

This directory contains the plug-and-play Python AI Modules requested for your Django hackathon backend. They have been implemented with pure speed, robust modern libraries, and minimal dependencies in mind.

## 📁 File Structure

- **`greenwashing_nlp.py`**: Uses HuggingFace `facebook/bart-large-mnli` for Zero-Shot Classification to instantly detect exaggerated greenwashing claims from text.
- **`predictive_analytics.py`**: Uses Facebook's `prophet` to ingest historical database limits and predict AQI or Waste limits exactly 30 days into the future.
- **`image_classification.py`**: Uses TensorFlow's `MobileNetV2` to classify citizen-submitted images securely in memory mapping them to predefined civic issues.
- **`sustainability_scorer.py`**: Aggregates all model signals and real Database stats into a single (0-100) global rating using an algorithmic weighting system.
- **`models.py` & `api_views.py`**: Ready-to-use Django `JsonResponse` controllers and Model definitions integrating the classes above natively.
- **`requirements.txt`**: Locked, compatible specific package versions tested for hackathons.

---

## 🚀 Step 1: Install AI Dependencies

Python environment preparation for ML (It is highly recommended you run this in a `venv`):

```bash
pip install -r requirements.txt
```

*(Note: TensorFlow and PyTorch are large downloads, run this early during the hackathon!)*

---

## 🛠 Step 2: Django Integration

1. Drag and drop the `api_views.py` file directly into your Django `views.py`.
2. Map your `urls.py` routing directly to these new AI views:

```python
from django.urls import path
from . import api_views

urlpatterns = [
    path('api/ai/analyze-report/', api_views.api_analyze_report_text),
    path('api/ai/predict-aqi/<str:city_name>/', api_views.api_predict_metrics),
    path('api/ai/classify-image/', api_views.api_classify_image),
    path('api/ai/city-score/<str:city_name>/', api_views.api_get_city_score),
]
```

3. Ensure you have the AI classes imported properly relative to where you copy the controller.

---

## 💻 Step 3: Testing from the React Frontend (Vite)

You can call these endpoints immediately from your React dashboard using raw `fetch()` calls. 

### Triggering the Predictive AI
```javascript
fetch('http://localhost:8000/api/ai/predict-aqi/Pune/')
  .then(res => res.json())
  .then(data => {
      console.log("Future AQI:", data.predicted_next_month);
      console.log("Trend direction:", data.trend);
  });
```

### Checking Report Authenticity
```javascript
fetch('http://localhost:8000/api/ai/analyze-report/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
      text: "Our city aims to achieve 100% renewable energy next week." 
  })
}).then(res => res.json()).then(console.log);
```

### Citizen Camera Submission
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('http://localhost:8000/api/ai/classify-image/', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => alert(`AI Detected: ${data.category} (${data.confidence}%)`));
```
