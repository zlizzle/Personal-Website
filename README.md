# Personal Website

A minimal React + FastAPI app.

## Tech Stack
- Frontend: React (Vite)
- Backend: FastAPI (Python)

## Setup

### Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Initialize the database and add a sample blog post
cd app
python init_db.py
cd ..

# Start the server
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment
- Frontend: Deploy the `frontend` folder to Vercel or Netlify. Build command: `npm run build`. Output: `dist`.
- Backend: Deploy the `backend` folder to Fly.io, Render, or your VPS. Entrypoint: `uvicorn app.main:app`. Make sure to set the correct CORS origins in `main.py`.
- Custom Domain: Set up via your hosting provider's dashboard.

## License
MIT
