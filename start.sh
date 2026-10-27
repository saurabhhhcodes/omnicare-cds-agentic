#!/usr/bin/env bash
# ==============================================================================
# OmniCare CDS — 1-Click Startup for macOS, Linux, and AWS EC2
# AWS Communication Developer Services (CDS) Agentic AI Partner Hackathon 2026
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "============================================================"
echo "  OmniCare CDS — Clinical Omnichannel AI Platform"
echo "  AWS CDS Agentic AI Partner Hackathon 2026 ($40k Cash)"
echo "============================================================"

# Locate Python 3.10+
PYTHON_BIN=""
for cmd in python3.12 python3.11 python3.10 python3 python; do
    if command -v "$cmd" >/dev/null 2>&1; then
        PY_VER=$("$cmd" -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')" 2>/dev/null || true)
        MAJOR=$(echo "$PY_VER" | cut -d. -f1)
        MINOR=$(echo "$PY_VER" | cut -d. -f2)
        if [ "$MAJOR" -ge 3 ] && [ "$MINOR" -ge 10 ]; then
            PYTHON_BIN="$cmd"
            echo "[OK] Found Python: $PYTHON_BIN (v$PY_VER)"
            break
        fi
    fi
done

if [ -z "$PYTHON_BIN" ]; then
    echo "[ERROR] Python 3.10+ is required but not found in PATH."
    exit 1
fi

# Virtualenv
VENV_DIR=".venv"
if [ ! -d "$VENV_DIR" ]; then
    echo "[Setup] Creating virtual environment in $VENV_DIR..."
    if command -v uv >/dev/null 2>&1; then
        uv venv "$VENV_DIR" --python "$PYTHON_BIN"
    else
        "$PYTHON_BIN" -m venv "$VENV_DIR"
    fi
fi

source "$VENV_DIR/bin/activate"

# Dependencies
if command -v uv >/dev/null 2>&1; then
    uv pip install -r backend/requirements.txt
else
    pip install -r backend/requirements.txt
fi

# Frontend Build
if [ ! -f "frontend/dist/index.html" ]; then
    if command -v npm >/dev/null 2>&1; then
        echo "[Build] Compiling frontend React 18 SPA..."
        (cd frontend && npm install && npm run build)
    fi
fi

export PYTHONPATH="$SCRIPT_DIR"

echo ""
echo "============================================================"
echo "  OmniCare CDS Online: http://127.0.0.1:8000/"
echo "============================================================"
echo "  - Complete Tactical App: http://127.0.0.1:8000/"
echo "  - Interactive Swagger:   http://127.0.0.1:8000/docs"
echo "  - Health Diagnostics:    http://127.0.0.1:8000/health"
echo "  - Real-Time WebSocket:   ws://127.0.0.1:8000/ws"
echo ""
echo "Press Ctrl+C or run ./stop.sh in another terminal to stop."
echo "============================================================"
echo ""

exec python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
