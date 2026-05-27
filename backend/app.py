from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for frontend

# Load Model
MODEL_PATH = 'model.pkl'

model = None

def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Error loading model: {e}")
            model = None
    else:
        print(f"Model file not found at {MODEL_PATH}")
        model = None

load_model()

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint to check backend health"""
    model_status = "loaded" if model else "not_loaded"
    return jsonify({"status": "healthy", "model_status": model_status}), 200

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({"error": "Model not loaded. Please train the model first."}), 503

    try:
        data = request.get_json()
        
        # 1. Input Validation
        required_fields = ['attendance', 'internal_marks', 'study_hours', 'prev_exam_score']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400
            
            value = data[field]
            try:
                float_val = float(value)
            except ValueError:
                return jsonify({"error": f"Invalid value for {field}: must be a number"}), 400

            # Logic checks
            if field in ['attendance', 'internal_marks', 'prev_exam_score']:
                if not (0 <= float_val <= 100):
                    return jsonify({"error": f"{field} must be between 0 and 100"}), 400
            if field == 'study_hours':
                if not (0 <= float_val <= 24):
                    return jsonify({"error": "study_hours must be between 0 and 24"}), 400

        # 2. Prepare Data for Model
        # Ensure order matches training: 'attendance', 'internal_marks', 'study_hours', 'prev_exam_score'
        input_data = pd.DataFrame([{
            'attendance': float(data['attendance']),
            'internal_marks': float(data['internal_marks']),
            'study_hours': float(data['study_hours']),
            'prev_exam_score': float(data['prev_exam_score'])
        }])

        # 3. Predict
        prediction = model.predict(input_data)[0] # 0 or 1
        probability = model.predict_proba(input_data)[0][1] # Probability of passing

        result = "Pass" if prediction == 1 else "Fail"
        confidence = round(probability * 100, 2)

        return jsonify({
            "result": result,
            "confidence": confidence,
            "message": f"Student is predicted to {result} with {confidence}% probability."
        })

    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    # Run on 0.0.0.0 so it's accessible, port 5000
    app.run(debug=True, host='0.0.0.0', port=5000)
