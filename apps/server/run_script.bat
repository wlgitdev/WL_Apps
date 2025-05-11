@echo off
set /p script_name=Enter script name (without .ts extension): 
npx ts-node -r dotenv/config ./src/scripts/%script_name%.ts
pause