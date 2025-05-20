@echo off
setlocal enabledelayedexpansion

echo Environment Switcher
echo -------------------
echo Please choose an environment:
echo 1. Development (dev)
echo 2. Production (prod)

set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    set env=dev
) else if "%choice%"=="2" (
    set env=prod
) else (
    echo Invalid choice. Exiting.
    exit /b 1
)

echo.
echo Switching to %env% environment...

rem Update server environment
cd apps\server
if exist .env (
    del /f .env
    echo Removed existing .env in server
)
copy .env.%env% .env > nul
if %errorlevel% equ 0 (
    echo Server: .env.%env% copied to .env
) else (
    echo Error: Failed to copy .env.%env% to .env in server
)

rem Update web environment
cd ..\web
if exist .env (
    del /f .env
    echo Removed existing .env in web
)
copy .env.%env% .env > nul
if %errorlevel% equ 0 (
    echo Web: .env.%env% copied to .env
) else (
    echo Error: Failed to copy .env.%env% to .env in web
)

echo.
echo Environment switched to %env% successfully.
pause