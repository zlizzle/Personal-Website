#!/bin/bash
set -e

echo "Setting up backend Python venv and dependencies..."
cd backend
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "Setting up frontend dependencies..."
cd ../frontend
npm install

echo ""
echo "Setup complete!"
echo "To run the backend:"
echo "  cd backend && source .venv/bin/activate && uvicorn app.main:app --reload"
echo ""
echo "To run the frontend (in another terminal):"
echo "  cd frontend && npm run dev"
