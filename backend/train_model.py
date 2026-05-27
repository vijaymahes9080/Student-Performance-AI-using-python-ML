import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report
import joblib

# 1. Generate Synthetic Dataset
def generate_data(n_samples=1000):
    np.random.seed(42)
    # Features
    attendance = np.random.randint(40, 100, n_samples)  # 40% to 100%
    internal_marks = np.random.randint(20, 100, n_samples) # 20 to 100
    study_hours = np.random.uniform(0, 10, n_samples)   # 0 to 10 hours
    prev_exam_score = np.random.randint(30, 100, n_samples) # 30 to 100
    
    # Logic for Pass (1) or Fail (0)
    # Weighted sum to determine probability of passing
    # Weights: Attendance (0.2), Internal (0.3), Study (0.1), Prev (0.4)
    weighted_score = (attendance * 0.2) + (internal_marks * 0.3) + (study_hours * 5 * 0.1) + (prev_exam_score * 0.4)
    
    # If weighted score > 50, strictly pass? Let's add noise.
    # Sigmoid-ish probability not needed for simple classification, let's just do threshold with some noise
    noise = np.random.normal(0, 5, n_samples)
    final_score = weighted_score + noise
    
    pass_fail = [1 if x >= 50 else 0 for x in final_score]
    
    df = pd.DataFrame({
        'attendance': attendance,
        'internal_marks': internal_marks,
        'study_hours': study_hours,
        'prev_exam_score': prev_exam_score,
        'result': pass_fail
    })
    
    return df

print("Generating synthetic data...")
df = generate_data()
print(f"Dataset shape: {df.shape}")
print(df.head())

# 2. Split Data
X = df[['attendance', 'internal_marks', 'study_hours', 'prev_exam_score']]
y = df['result']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Create Pipeline (Scaling + Model)
# Scaling is important effectively using multiple features with different ranges
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

# 4. Train Model
print("\nTraining model...")
pipeline.fit(X_train, y_train)

# 5. Evaluate
y_pred = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\nModel Accuracy: {accuracy * 100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# 6. Save Model
model_filename = 'model.pkl'
joblib.dump(pipeline, model_filename)
print(f"\nModel saved to {model_filename}")
