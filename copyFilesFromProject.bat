@echo off
setlocal enabledelayedexpansion

:: Get source and destination paths from user
set /p SOURCE_PATH="Enter source path: "
set /p DEST_PATH="Enter destination path: "
set /p PROJECT_NAME="Enter project sub folder name: "

:: Create destination directories if they don't exist
mkdir "%DEST_PATH%\apps\web\src\api\%PROJECT_NAME%" 2>nul
mkdir "%DEST_PATH%\apps\web\src\pages\%PROJECT_NAME%" 2>nul
mkdir "%DEST_PATH%\apps\web\src\components\%PROJECT_NAME%" 2>nul
mkdir "%DEST_PATH%\apps\web\src\registry\%PROJECT_NAME%" 2>nul
mkdir "%DEST_PATH%\apps\web\src\schemas\%PROJECT_NAME%" 2>nul
mkdir "%DEST_PATH%\apps\server\src\config\%PROJECT_NAME%" 2>nul
mkdir "%DEST_PATH%\apps\server\src\controllers\%PROJECT_NAME%" 2>nul
mkdir "%DEST_PATH%\apps\server\src\models\%PROJECT_NAME%" 2>nul
mkdir "%DEST_PATH%\apps\server\src\routes\%PROJECT_NAME%" 2>nul
mkdir "%DEST_PATH%\apps\server\src\services\%PROJECT_NAME%" 2>nul
mkdir "%DEST_PATH%\packages\types\src\%PROJECT_NAME%" 2>nul

:: Copy files for directories that don't need flattening
xcopy "%SOURCE_PATH%\apps\web\src\api\*.*" "%DEST_PATH%\apps\web\src\api\%PROJECT_NAME%\" /s /i /y
xcopy "%SOURCE_PATH%\apps\web\src\registry\*.*" "%DEST_PATH%\apps\web\src\registry\%PROJECT_NAME%\" /s /i /y
xcopy "%SOURCE_PATH%\apps\web\src\schemas\*.*" "%DEST_PATH%\apps\web\src\schemas\%PROJECT_NAME%\" /s /i /y
xcopy "%SOURCE_PATH%\apps\server\src\config\*.*" "%DEST_PATH%\apps\server\src\config\%PROJECT_NAME%\" /s /i /y
xcopy "%SOURCE_PATH%\apps\server\src\controllers\*.*" "%DEST_PATH%\apps\server\src\controllers\%PROJECT_NAME%\" /s /i /y
xcopy "%SOURCE_PATH%\apps\server\src\models\*.*" "%DEST_PATH%\apps\server\src\models\%PROJECT_NAME%\" /s /i /y
xcopy "%SOURCE_PATH%\apps\server\src\routes\*.*" "%DEST_PATH%\apps\server\src\routes\%PROJECT_NAME%\" /s /i /y
xcopy "%SOURCE_PATH%\apps\server\src\services\*.*" "%DEST_PATH%\apps\server\src\services\%PROJECT_NAME%\" /s /i /y
xcopy "%SOURCE_PATH%\packages\types\src\*.*" "%DEST_PATH%\apps\packages\types\src\%PROJECT_NAME%\" /s /i /y

:: Flatten pages directory
for /r "%SOURCE_PATH%\apps\web\src\pages" %%f in (*.*) do (
    copy "%%f" "%DEST_PATH%\apps\web\src\pages\%PROJECT_NAME%\" /y
)

:: Flatten components directory
for /r "%SOURCE_PATH%\apps\web\src\components" %%f in (*.*) do (
    copy "%%f" "%DEST_PATH%\apps\web\src\components\%PROJECT_NAME%\" /y
)

echo Copy completed successfully!