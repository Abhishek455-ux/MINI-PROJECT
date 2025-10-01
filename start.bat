@echo off
echo ========================================
echo    Smart Attendance System
echo ========================================
echo.
echo Starting the Smart Attendance System...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Start the server
echo Starting server on http://localhost:5000
echo.
echo Admin Dashboard: http://localhost:5000/
echo Student Portal: http://localhost:5000/student.html
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

node server/index.js
