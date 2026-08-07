@echo off
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
    echo No .venv found. Run start-widget.bat once first to set it up.
    pause
    exit /b 1
)

".venv\Scripts\python.exe" -m pip install pyinstaller -q
".venv\Scripts\python.exe" -m PyInstaller --onefile --icon=app-icon.ico --add-data "static;static" --name "Spotify Now Playing" nowplaying_server.py

echo.
echo Built: dist\Spotify Now Playing.exe
pause
