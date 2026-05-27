const form = document.getElementById('predictionForm');
const submitBtn = document.getElementById('submitBtn');
const loader = document.getElementById('loader');
const btnText = document.querySelector('.btn-text');
const resultContainer = document.getElementById('resultContainer');
const errorContainer = document.getElementById('errorContainer');
const resultValue = document.getElementById('resultValue');
const confidenceValue = document.getElementById('confidenceValue');
const resultMessage = document.getElementById('resultMessage');
const scoreCircle = document.getElementById('scoreCircle');

const API_URL = 'http://localhost:5000/predict';

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // UI Loading State
    setLoading(true);
    resetMessages();

    // Get Data
    const formData = new FormData(form);
    const data = {
        attendance: formData.get('attendance'),
        internal_marks: formData.get('internal_marks'),
        study_hours: formData.get('study_hours'),
        prev_exam_score: formData.get('prev_exam_score')
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Server error occurred');
        }

        displayResult(result);

    } catch (error) {
        console.error(error);
        if (error.message.includes('Failed to fetch')) {
            showError("Backend is offline! Please double-click 'run_system.bat' in the project folder to start the server.");
        } else {
            showError(error.message);
        }
    } finally {
        setLoading(false);
    }
});

function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        loader.style.display = 'block';
        btnText.style.opacity = '0.5';
    } else {
        submitBtn.disabled = false;
        loader.style.display = 'none';
        btnText.style.opacity = '1';
    }
}

function resetMessages() {
    resultContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
    scoreCircle.classList.remove('pass', 'fail');
}

function displayResult(data) {
    resultContainer.classList.remove('hidden');

    resultValue.textContent = data.result;
    confidenceValue.textContent = `${data.confidence}% Prob.`;
    resultMessage.textContent = data.message;

    // Add colorful classes
    if (data.result === 'Pass') {
        scoreCircle.classList.add('pass');
    } else {
        scoreCircle.classList.add('fail');
    }

    // Smooth scroll to result
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

function showError(msg) {
    errorContainer.classList.remove('hidden');
    document.getElementById('errorMessage').textContent = msg;
}
