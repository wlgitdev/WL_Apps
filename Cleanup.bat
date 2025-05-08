@echo off
SETLOCAL EnableDelayedExpansion

echo cleaning project...

:: Clean root
del /f /q package-lock.json 2>nul
rmdir /s /q node_modules 2>nul
del /f /q tsconfig.tsbuildinfo 2>nul

:: Clean packages/types
rmdir /s /q packages\types\node_modules 2>nul
rmdir /s /q packages\types\dist 2>nul
del /f /q packages\types\tsconfig.tsbuildinfo 2>nul
rmdir /s /q packages\types\.turbo 2>nul

:: Clean packages/utils
rmdir /s /q packages\utils\node_modules 2>nul
rmdir /s /q packages\utils\dist 2>nul
del /f /q packages\utils\tsconfig.tsbuildinfo 2>nul
rmdir /s /q packages\utils\.turbo 2>nul

:: Clean packages/schema-to-ui
rmdir /s /q packages\schema-to-ui\node_modules 2>nul
rmdir /s /q packages\schema-to-ui\dist 2>nul
del /f /q packages\schema-to-ui\tsconfig.tsbuildinfo 2>nul
rmdir /s /q packages\schema-to-ui\.turbo 2>nul

:: Clean packages/pf
rmdir /s /q packages\pf\node_modules 2>nul
rmdir /s /q packages\pf\dist 2>nul
del /f /q packages\pf\tsconfig.tsbuildinfo 2>nul
rmdir /s /q packages\pf\.turbo 2>nul

:: Clean packages/sortify
rmdir /s /q packages\sortify\node_modules 2>nul
rmdir /s /q packages\sortify\dist 2>nul
del /f /q packages\sortify\tsconfig.tsbuildinfo 2>nul
rmdir /s /q packages\sortify\.turbo 2>nul

:: Clean apps/web
rmdir /s /q apps\web\node_modules 2>nul
rmdir /s /q apps\web\dist 2>nul
del /f /q apps\web\tsconfig.tsbuildinfo 2>nul
rmdir /s /q apps\web\.turbo 2>nul

:: Clean apps/server
rmdir /s /q apps\server\node_modules 2>nul
rmdir /s /q apps\server\dist 2>nul
del /f /q apps\server\tsconfig.tsbuildinfo 2>nul
rmdir /s /q apps\server\.turbo 2>nul
del /f /q apps\server\package-lock.json 2>nul

echo cleaned!
pause