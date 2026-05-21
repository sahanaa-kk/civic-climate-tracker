class SustainabilityScorer:
    """
    Aggregates metrics from Predictive Models, NLP, and Raw Database metrics
    into a unified "Smart City Green Score" (0-100).
    """
    
    @staticmethod
    def calculate_city_score(predicted_aqi, resolved_issues_pct, authenticity_score, budget_efficiency_pct):
        """
        Formula Weights:
        - 30% AQI (Air Quality)
        - 30% Civic Resolution Rate
        - 20% Authenticity (NLP Greenwashing score)
        - 20% Budget Efficiency
        """
        
        # 1. AQI Normalization (Lower is better. 0-50 = 100 pts, >300 = 0 pts)
        aqi_pts = max(0, min(100, 100 - ((predicted_aqi - 50) / 2.5)))
        
        # 2. Resolution Rate (Higher is better)
        res_pts = max(0, min(100, resolved_issues_pct))
        
        # 3. Authenticity (Driven by NLP)
        auth_pts = max(0, min(100, authenticity_score))
        
        # 4. Budget Efficiency
        budget_pts = max(0, min(100, budget_efficiency_pct))
        
        # Apply Weights
        final_score = (aqi_pts * 0.30) + (res_pts * 0.30) + (auth_pts * 0.20) + (budget_pts * 0.20)
        
        diagnosis = "Needs Critical Intervention"
        if final_score >= 80:
            diagnosis = "Leading Smart City"
        elif final_score >= 60:
            diagnosis = "On Track Environmentally"

        return {
            "overall_score": round(final_score, 1),
            "diagnosis": diagnosis,
            "breakdown": {
                "air_quality_impact": round(aqi_pts * 0.30, 1),
                "civic_resolution_impact": round(res_pts * 0.30, 1),
                "authenticity_impact": round(auth_pts * 0.20, 1),
                "budget_efficiency_impact": round(budget_pts * 0.20, 1)
            }
        }

# --- Mock Demo ---
if __name__ == "__main__":
    print(SustainabilityScorer.calculate_city_score(
        predicted_aqi=120, 
        resolved_issues_pct=65, 
        authenticity_score=90, 
        budget_efficiency_pct=85
    ))
