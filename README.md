# Student Performance Prediction System

A Machine Learning powered web application to predict student academic performance (Pass/Fail) based on attendance, internal marks, and study habits.

## 📂 Project Structure
```
student_performance_system/
├── backend/
│   ├── app.py                # Flask API Server
│   ├── train_model.py        # ML Training Script
│   ├── model.pkl             # Trained AI Model
│   └── requirements.txt      # Python Dependencies
└── frontend/
    ├── index.html            # Web Interface
    ├── style.css             # Glassmorphism Styles
    └── script.js             # Logic & API Connectivity
```

## 🚀 Setup Instructions

### 1. Prerequisites
- Python 3.8 or higher
- Node.js (Optional, only if using advanced tooling, this project is Vanilla JS)

### 2. Backend Setup
1.  Navigate to the `backend` folder.
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Train the Model (One time setup):
    ```bash
    python train_model.py
    ```
    *This will generate `model.pkl`.*

4.  Start the Server:
    ```bash
    python app.py
    ```
    The server will run at `http://localhost:5000`.

### 3. Frontend Setup
1.  Simply open `frontend/index.html` in your browser.
2.  Or use a live server (VS Code Extension) or simple python http server:
    ```bash
    cd frontend
    python -m http.server 8000
    ```

## 🧠 Model & Architecture
- **Algorithm**: Random Forest Classifier
- **Preprocessing**: StandardScaler (Normalization)
- **Features**:
    - Attendance (%)
    - Internal Marks (%)
    - Study Hours/Day
    - Previous Exam Score (%)
- **Accuracy**: ~90%+ on synthetic data.

## 🔮 Future Enhancements
- Database integration (SQLite/PostgreSQL) to save student records.
- Detailed report generation (PDF).
- Multi-class classification (Grade A, B, C, etc).

## ⚠️ Troubleshooting
- **"Model not loaded"**: Ensure you ran `python train_model.py` first.
- **CORS Errors**: The backend is configured to allow CORS, ensure you are accessing via `localhost`.
