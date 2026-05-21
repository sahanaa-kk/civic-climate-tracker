import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
import io
from PIL import Image

class IssueImageClassifier:
    """
    Classifies citizen-uploaded issue reports using MobileNetV2.
    It maps standard ImageNet classes to civic issues (Garbage, Leakage, Infrastructure).
    """
    def __init__(self):
        # Load pre-trained MobileNetV2 for extreme speed and low memory usage
        self.model = MobileNetV2(weights='imagenet')
        
        # Keyword mapping to translate general object detection to Civic Issues
        self.issue_mappings = {
            "garbage": ["dustpan", "trash_can", "plastic_bag", "carton", "bucket"],
            "water_leakage": ["fountain", "geyser", "bucket", "water_jug"],
            "infrastructure_damage": ["street_sign", "traffic_light", "chainlink_fence", "stone_wall", "pothole"]
        }

    def classify_image(self, image_file_or_path):
        """
        Receives either a file path or a Django File object/BytesIO stream
        """
        try:
            # Handle both file paths and memory streams
            if isinstance(image_file_or_path, str):
                img = image.load_img(image_file_or_path, target_size=(224, 224))
            else:
                img = Image.open(image_file_or_path).resize((224, 224))
            
            x = image.img_to_array(img)
            x = np.expand_dims(x, axis=0)
            x = preprocess_input(x)

            # Predict
            preds = self.model.predict(x)
            decoded = decode_predictions(preds, top=5)[0]

            # Determine category based on civic mapping
            detected_category = "unclassified_issue"
            confidence = 0.0
            raw_labels = []

            for _id, label, prob in decoded:
                raw_labels.append(label)
                for issue_type, keywords in self.issue_mappings.items():
                    if label.lower() in keywords:
                        detected_category = issue_type
                        confidence = float(prob) * 100
                        break
                if detected_category != "unclassified_issue":
                    break

            if detected_category == "unclassified_issue":
                # Fallback to the top label if it doesn't match predefined issues
                detected_category = f"other ({decoded[0][1]})"
                confidence = float(decoded[0][2]) * 100

            return {
                "category": detected_category,
                "confidence": round(confidence, 2),
                "raw_AI_labels": raw_labels
            }

        except Exception as e:
            return {"error": str(e)}

# --- Mock Demo ---
if __name__ == "__main__":
    # Create a dummy image for testing the pipeline
    img = Image.new('RGB', (224, 224), color = 'gray')
    img.save('dummy_test.jpg')
    
    classifier = IssueImageClassifier()
    print(classifier.classify_image('dummy_test.jpg'))
