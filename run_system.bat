@echo off
cd /d "%~dp0"
echo ============================================
echo   Student Performance Prediction System
echo ============================================

REM Explicitly set Python Path (Bypassing PATH issues)
set "PYTHON_EXE=C:\Users\vijay\AppData\Local\Programs\Python\Python312\python.exe"

if exist "%PYTHON_EXE%" (
    echo [INFO] Found Python at: %PYTHON_EXE%
) else (
    echo [WARNING] Could not find explicit Python. Falling back to system PATH...
    set "PYTHON_EXE=python"
)

echo.
echo [1/3] Checking Python Version...
"%PYTHON_EXE%" --version
if %errorlevel% neq 0 (
    echo [CRITICAL ERROR] Python is not working.
    echo Please restart your computer to finish the Python installation.
    pause
    exit /b 1
)

echo.
echo [2/3] Installing Dependencies...
"%PYTHON_EXE%" -m pip install -r backend/requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b %errorlevel%
)

echo.
echo [3/4] Training Machine Learning Model...
"%PYTHON_EXE%" backend/train_model.py
if %errorlevel% neq 0 (
    echo [ERROR] Failed to train model.
    pause
    exit /b %errorlevel%
)

echo.
echo [4/4] Starting Backend Server...
echo The server will start at http://localhost:5000
echo Open 'frontend/index.html' in your browser to use the app.
echo.
echo Press CTRL+C to stop the server.
"%PYTHON_EXE%" backend/app.py
pause
