@echo off
setlocal enabledelayedexpansion

:: Get user input
set /p SOURCE_PATH="Enter source path: "
set /p DEST_PATH="Enter destination path: "
set /p PROJECT_NAME="Enter project sub folder name: "

:: Define directory structures in arrays
set "WEB_DIRS=api registry schemas pages components"
set "SERVER_DIRS=config controllers models routes services"

:: Create all destination directories
for %%d in (%WEB_DIRS%) do mkdir "%DEST_PATH%\apps\web\src\%%d\%PROJECT_NAME%" 2>nul
for %%d in (%SERVER_DIRS%) do mkdir "%DEST_PATH%\apps\server\src\%%d\%PROJECT_NAME%" 2>nul
mkdir "%DEST_PATH%\packages\types\src\%PROJECT_NAME%" 2>nul

:: Copy web files with conditional placement
for %%d in (%WEB_DIRS%) do (
    if exist "%SOURCE_PATH%\apps\web\src\%%d\" (
        for /f "delims=" %%f in ('dir /b /s "%SOURCE_PATH%\apps\web\src\%%d\*.*"') do (
            set "fname=%%~nxf"
            if exist "%DEST_PATH%\apps\web\src\%%d\!fname!" (
                copy "%%f" "%DEST_PATH%\apps\web\src\%%d\" /y
            ) else (
                copy "%%f" "%DEST_PATH%\apps\web\src\%%d\%PROJECT_NAME%\" /y
            )
        )
    )
)

:: Copy server files with conditional placement
for %%d in (%SERVER_DIRS%) do (
    if exist "%SOURCE_PATH%\apps\server\src\%%d\" (
        for /f "delims=" %%f in ('dir /b /s "%SOURCE_PATH%\apps\server\src\%%d\*.*"') do (
            set "fname=%%~nxf"
            if exist "%DEST_PATH%\apps\server\src\%%d\!fname!" (
                copy "%%f" "%DEST_PATH%\apps\server\src\%%d\" /y
            ) else (
                copy "%%f" "%DEST_PATH%\apps\server\src\%%d\%PROJECT_NAME%\" /y
            )
        )
    )
)

:: Handle packages/types directory
if exist "%SOURCE_PATH%\packages\types\src\" (
    for /f "delims=" %%f in ('dir /b /s "%SOURCE_PATH%\packages\types\src\*.*"') do (
        set "fname=%%~nxf"
        if exist "%DEST_PATH%\packages\types\src\!fname!" (
            copy "%%f" "%DEST_PATH%\packages\types\src\" /y
        ) else (
            copy "%%f" "%DEST_PATH%\packages\types\src\%PROJECT_NAME%\" /y
        )
    )
)

echo Copy completed successfully!