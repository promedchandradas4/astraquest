# AstraQuest — Backend (Django + DRF + SQLite)

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then edit .env if needed (NASA key is pre-filled)

python manage.py makemigrations missions
python manage.py migrate
python manage.py seed_data      # loads the 4 learning topics + 20 quiz questions
python manage.py createsuperuser  # optional, for /admin/

python manage.py runserver      # http://127.0.0.1:8000
```

## API overview

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/signup/` | POST | `full_name, email, password, confirm_password` → token |
| `/api/auth/login/` | POST | `email, password` → token |
| `/api/auth/logout/` | POST | invalidates the token |
| `/api/auth/me/` | GET | current user |
| `/api/missions/` | GET/POST | list or create a mission run (Moon/Mars, crew size, duration, weight ≤1200kg, objectives) |
| `/api/missions/<id>/` | GET/PATCH | mission detail / dashboard data |
| `/api/missions/<id>/allocate-resources/` | POST | set power/life-support/radiation/food units (must sum to total_units) |
| `/api/learning-topics/` | GET | the 4 topics with article text, YouTube link, and 5 quiz questions each |
| `/api/learning-topics/<topic>/` | GET | one topic (`POWER`, `LIFE_SUPPORT`, `RADIATION_SHIELDING`, `FOOD`) |
| `/api/missions/<id>/quiz/<topic>/submit/` | POST | `{"answers": {"<question_id>": "A", ...}}` → score, pass/fail (≥3/5 passes), updated mission progress |
| `/api/nasa/apod/` | GET | proxies NASA's Astronomy Picture of the Day using your server-side API key |

All endpoints except signup/login require `Authorization: Token <token>` header.

Send this header from the React app after login/signup (the token is returned
in the response body — store it and attach it to every subsequent request).

## Notes

- The NASA API key lives in `.env` (server-side only) and is never sent to the browser —
  the frontend calls `/api/nasa/apod/` on *your* backend, which calls NASA on its behalf.
- Quiz pass threshold (3/5) and resource-unit validation are enforced server-side so the
  frontend can't be tricked into skipping ahead.
