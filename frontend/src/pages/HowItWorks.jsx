import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const STEPS = [
  { title: "Sign up or log in", desc: "Create your commander account to start tracking missions." },
  { title: "Choose your mission", desc: "Pick a Moon mission (beginner) or a Mars mission (intermediate)." },
  { title: "Prepare", desc: "Set crew size, duration, total weight (max 1200 kg), and objectives." },
  { title: "Allocate resources", desc: "Balance power, life support, radiation shielding, and food." },
  { title: "Learn", desc: "Read a NASA-sourced briefing and watch a short video on each resource topic." },
  { title: "Pass the quiz", desc: "Score 3 out of 5 to advance — or review the briefing and try again." },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-space-950">
      <Navbar />
      <div className="pt-28 px-6 md:px-10 pb-16 max-w-3xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold">
          How <span className="text-moon-blue">AstraQuest</span> Works
        </h1>
        <p className="mt-3 text-slate-400">
          Six steps take you from mission commander sign-up to a completed Moon or Mars mission.
        </p>

        <ol className="mt-8 space-y-5">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <div className="w-9 h-9 shrink-0 rounded-full border border-moon-blue/60 flex items-center justify-center text-moon-blue font-medium">
                {i + 1}
              </div>
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <Link
          to="/missions"
          className="inline-block mt-10 px-6 py-3 rounded-md bg-moon-blue hover:bg-blue-500 font-medium transition-colors"
        >
          Start Your Mission →
        </Link>
      </div>
    </div>
  );
}
