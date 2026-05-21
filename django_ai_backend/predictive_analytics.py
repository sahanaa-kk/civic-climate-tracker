import pandas as pd
from prophet import Prophet
from datetime import timedelta

class CityPredictiveAnalytics:
    """
    Predictive Analytics module to forecast next month's AQI or Waste percentage.
    Uses Facebook's Prophet library which is extremely robust for time-series forecasting.
    """
    def __init__(self):
        # Initialize Prophet with standard settings
        self.model = Prophet(yearly_seasonality=True, weekly_seasonality=False, daily_seasonality=False)

    def predict_next_month(self, historical_dates, historical_values, metric_name="AQI"):
        """
        historical_dates: list of date strings ['2023-01-01', '2023-02-01']
        historical_values: list of floats [120.5, 110.2]
        """
        if len(historical_dates) < 3:
            return {"error": "Not enough historical data. Minimum 3 data points required."}

        # Format for Prophet (requires 'ds' for datestamp and 'y' for numeric value)
        df = pd.DataFrame({
            'ds': pd.to_datetime(historical_dates),
            'y': historical_values
        })

        self.model.fit(df)

        # Predict exactly 30 days into the future
        future = self.model.make_future_dataframe(periods=30)
        forecast = self.model.predict(future)

        # Extract the exact prediction 30 days from the last known date
        last_date = df['ds'].max()
        target_date = last_date + timedelta(days=30)
        
        # Get closest forecast row
        forecast_row = forecast.loc[forecast['ds'] >= target_date].iloc[0]
        
        predicted_value = round(forecast_row['yhat'], 2)
        trend = "Improving" if predicted_value < df['y'].iloc[-1] else "Worsening"

        return {
            "metric": metric_name,
            "predicted_next_month": predicted_value,
            "confidence_lower": round(forecast_row['yhat_lower'], 2),
            "confidence_upper": round(forecast_row['yhat_upper'], 2),
            "trend": trend,
            "data_points_analyzed": len(df)
        }

# --- Mock Demo ---
if __name__ == "__main__":
    predictor = CityPredictiveAnalytics()
    dates = ['2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01', '2023-05-01']
    aqi_values = [150, 145, 140, 155, 160]
    print(predictor.predict_next_month(dates, aqi_values, "AQI"))
