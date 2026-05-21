from transformers import pipeline

class GreenwashingDetector:
    """
    Hackathon-ready module to analyze city sustainability reports and
    detect potential greenwashing (exaggerated or vague environmental claims).
    """
    def __init__(self):
        # We use a zero-shot classifier for fast, out-of-the-box performance without fine-tuning
        self.classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
        self.candidate_labels = [
            "exaggerated sustainability claim", 
            "vague environmental promise", 
            "realistic green initiative", 
            "data-backed climate action"
        ]

    def analyze_report(self, report_text):
        if not report_text or len(report_text) < 10:
            return {"score": 0, "highlights": [], "error": "Text too short"}

        # Perform NLP classification
        result = self.classifier(report_text, self.candidate_labels)
        
        labels = result['labels']
        scores = result['scores']
        
        # Calculate a penalty based on exactly how much the text skews towards vague or exaggerated
        # (0-100 scale, where 100 is highly authentic and 0 is complete greenwashing)
        exaggerated_idx = labels.index("exaggerated sustainability claim")
        vague_idx = labels.index("vague environmental promise")
        
        greenwashing_prob = (scores[exaggerated_idx] + scores[vague_idx])
        authenticity_score = max(0, min(100, int((1.0 - greenwashing_prob) * 100)))

        # Highlight extraction (Dummy logic for hackathon speed: normally you'd use NER or sentence splitting)
        sentences = report_text.split('.')
        highlights = [s.strip() for s in sentences if "will" in s.lower() or "aim" in s.lower()][:2]
        
        return {
            "authenticity_score": authenticity_score,
            "greenwashing_risk": round(greenwashing_prob * 100, 2),
            "dominant_trait": labels[0],
            "suspicious_highlights": highlights
        }

# --- Mock Demo ---
if __name__ == "__main__":
    detector = GreenwashingDetector()
    mock_text = "We aim to plant a trillion trees and our city will be 100% green by next year without any clear data or budgets. We are totally eco-friendly."
    print(detector.analyze_report(mock_text))
