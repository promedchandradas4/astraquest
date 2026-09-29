# AstraQuest — Frontend (React + Vite + Tailwind)

## Setup

```bash
cd frontend
npm install
cp .env.example .env        # points at your local Django backend
npm run dev                 # http://localhost:5173
```

Make sure the backend (see `../backend/README.md`) is running on
`http://127.0.0.1:8000` first — sign-up, mission data, the quiz, and the
NASA imagery all come from it.

## Pages / flow (matches the ASTRAVENTURE_DEVELOPMENT_GUIDE brief)

1. **Home** (`/`) — hero, mission teaser cards, "how it works" strip.
2. **Sign Up / Log In** (`/signup`, `/login`) — same background image, per the brief.
3. **Mission Selection** (`/missions`) — Moon (beginner) vs Mars (intermediate).
4. **Mission Prep** (`/missions/:missionType/prepare`) — crew size, duration
   (7/14/21 or 30/45/60 days), total weight (≤1200 kg), objectives.
5. **Resource Allocation** (`/missions/:missionId/resources`) — power / life
   support / radiation shielding / food sliders that must sum to the total.
6. **Dashboard** (`/missions/:missionId/dashboard`) — mission status, base
   image, alerts, crew, resource levels, recent logs, and links into the
   four learning topics.
7. **Learn** (`/missions/:missionId/learn/:topicCode`) — NASA-sourced
   article + embedded YouTube video for one resource topic.
8. **Quiz** (`/missions/:missionId/quiz/:topicCode`) — 5 questions; scoring
   3+ advances mission progress, otherwise you're sent back to review.

## Notes

- Tailwind is configured with `moon-blue` / `mars-orange` accents and a
  `space` dark-navy palette to match the mockups.
- Images from the brief live in `src/assets/` — swap them for your final
  art any time; nothing else needs to change.
- All grading and resource-sum validation happens server-side, so the quiz
  answer key is never sent to the browser.
