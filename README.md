# AstraQuest — Junior Astronaut Mission Trainer

Built from the ASTRAVENTURE_DEVELOPMENT_GUIDE brief: a full-stack app
(React + Django REST Framework + SQLite, with NASA API data) where kids
plan a Moon or Mars mission, balance resources, and pass short quizzes
built from NASA-sourced material to advance.

- `backend/` — Django + DRF + SQLite API. See `backend/README.md` to run it.
- `frontend/` — React + Vite + Tailwind UI. See `frontend/README.md` to run it.

## Quick start

```bash
# Terminal 1
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py makemigrations missions && python manage.py migrate
python manage.py seed_data
python manage.py runserver

# Terminal 2
cd frontend
npm install
cp .env.example .env
npm run dev
```

Then open http://localhost:5173, sign up, and pick a mission.

## What's implemented

- Sign up / log in / log out (token auth)
- Mission selection → prep (crew, duration, weight ≤1200 kg, objectives) →
  resource allocation (power / life support / radiation shielding / food,
  validated server-side to sum to the total)
- Mission dashboard with live status, resource levels, and a log feed
- Four learning topics (Power, Life Support, Radiation Shielding, Food),
  each with an article summary, the YouTube video from the brief, and a
  5-question quiz; scoring 3+/5 advances mission progress
- A `/api/nasa/apod/` endpoint that proxies NASA's Astronomy Picture of the
  Day using your API key, kept server-side

## What you'll likely want to refine next

- Swap in your own art direction / fonts if you want something beyond the
  mockup's palette
- Add password reset ("Forgot password?" is currently just a placeholder link)
- Deploy: e.g. Django on Render/Railway with a Postgres upgrade path, React
  build on Vercel/Netlify, pointing `VITE_API_BASE_URL` at the live API
- Add more quiz questions per topic, or randomize which 5 are shown
