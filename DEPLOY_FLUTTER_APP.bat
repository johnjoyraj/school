@echo off
title EduSaaS Flutter Compilation & Deployment (Step 5)
cd /d "%~dp0mobile_app"

echo ======================================================================
echo    STEP 5: FLUTTER APP COMPILATION & RELEASE WORKFLOW
echo ======================================================================
echo  1. Checking Flutter Environment...
where flutter >nul 2>nul
if %errorlevel% neq 0 (
    echo [NOTICE] Flutter CLI is not detected in system PATH.
    echo To build native Android APK/AAB:
    echo   1. Install Flutter SDK or open the mobile_app folder in Android Studio.
    echo   2. Run: flutter pub get
    echo   3. Run: flutter build apk --release
    echo.
    echo In the meantime, you can test the mobile client immediately using
    echo student_parent_app.html and teacher_staff_app.html in your browser!
    echo ======================================================================
    pause
    exit /b
)

echo [OK] Flutter CLI detected.
echo Cleaning previous build artifacts...
flutter clean
echo Fetching Flutter dependencies...
flutter pub get
echo Building release APK...
flutter build apk --release

echo ======================================================================
echo Build Complete! Check build/app/outputs/flutter-apk/app-release.apk
echo ======================================================================
pause
