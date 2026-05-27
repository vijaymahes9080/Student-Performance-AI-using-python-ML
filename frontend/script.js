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

// Model Parameters (Trained Logistic Regression - 90% Accuracy)
const MODEL_CONFIG = {
    coefficients: [1.15147998, 2.28904204, 0.42831730, 2.69327777],
    intercept: 3.44630921,
    scalerMean: [69.83325, 59.542125, 4.96784661, 64.81675],
    scalerStd: [17.32975604, 23.21597458, 2.88130514, 20.25432471]
};

function predictClientSide(attendance, internalMarks, studyHours, prevExamScore) {
    // 1. Scale Features
    const attScaled = (attendance - MODEL_CONFIG.scalerMean[0]) / MODEL_CONFIG.scalerStd[0];
    const intScaled = (internalMarks - MODEL_CONFIG.scalerMean[1]) / MODEL_CONFIG.scalerStd[1];
    const studyScaled = (studyHours - MODEL_CONFIG.scalerMean[2]) / MODEL_CONFIG.scalerStd[2];
    const prevScaled = (prevExamScore - MODEL_CONFIG.scalerMean[3]) / MODEL_CONFIG.scalerStd[3];

    // 2. Compute Log-odds (z)
    const z = MODEL_CONFIG.intercept +
              (MODEL_CONFIG.coefficients[0] * attScaled) +
              (MODEL_CONFIG.coefficients[1] * intScaled) +
              (MODEL_CONFIG.coefficients[2] * studyScaled) +
              (MODEL_CONFIG.coefficients[3] * prevScaled);

    // 3. Compute Sigmoid Probability of Passing
    const probability = 1 / (1 + Math.exp(-z));
    const isPass = probability >= 0.5;

    // 4. Calculate Confidence Percentage
    const confidence = isPass ? probability : (1 - probability);
    const confidencePct = Math.round(confidence * 10000) / 100; // e.g. 88.45%

    const resultWord = isPass ? "Pass" : "Fail";
    
    // Custom premium recommendation messages based on thresholds
    let message = ``;
    if (isPass) {
        if (confidencePct > 85) {
            message = `Excellent profile! You are highly likely to pass with a strong score (${confidencePct}% confidence). Keep up the fantastic study habits!`;
        } else {
            message = `You are on track to pass (${confidencePct}% confidence). Tips to improve: try boosting daily study hours by 30 minutes to secure an A grade!`;
        }
    } else {
        if (confidencePct > 85) {
            message = `Alert: High academic risk predicted (${confidencePct}% failure probability). Action plan: Immediately increase study hours, improve attendance, and attend remedial sessions.`;
        } else {
            message = `Caution: Borderline risk predicted (${confidencePct}% failure probability). Just 1 additional hour of daily study or a 5% bump in internal marks will push you into the Pass zone!`;
        }
    }

    return {
        result: resultWord,
        confidence: confidencePct,
        message: message
    };
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // UI Loading State
    setLoading(true);
    resetMessages();

    // Get Data
    const formData = new FormData(form);
    const attendance = parseFloat(formData.get('attendance'));
    const internalMarks = parseFloat(formData.get('internal_marks'));
    const studyHours = parseFloat(formData.get('study_hours'));
    const prevExamScore = parseFloat(formData.get('prev_exam_score'));

    // Artificial tiny delay (600ms) for excellent premium loading animation feel
    setTimeout(() => {
        try {
            // Predict Client-Side
            const result = predictClientSide(attendance, internalMarks, studyHours, prevExamScore);
            displayResult(result);
        } catch (error) {
            console.error(error);
            showError("An error occurred while computing the prediction. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    }, 600);
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
