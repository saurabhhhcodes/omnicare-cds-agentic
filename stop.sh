#!/usr/bin/env bash
echo "============================================================"
echo "  OmniCare CDS — Stopping Processes on Port 8000"
echo "============================================================"

PIDS=$(lsof -ti:8000 2>/dev/null || true)
if [ -n "$PIDS" ]; then
    echo "Terminating process(es) on port 8000: $PIDS..."
    kill -15 $PIDS 2>/dev/null || true
    sleep 1
    REMAINING=$(lsof -ti:8000 2>/dev/null || true)
    if [ -n "$REMAINING" ]; then
        kill -9 $REMAINING 2>/dev/null || true
    fi
    echo "[OK] OmniCare CDS stopped."
else
    echo "[INFO] No process listening on port 8000."
fi
