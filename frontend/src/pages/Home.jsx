import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import heroBg from "../assets/hero-mars.jpg";

const STEPS = [
  { title: "Choose", desc: "Moon or Mars" },
  { title: "Plan", desc: "Manage your resources" },
  { title: "Decide", desc: "Respond to mission events" },
  { title: "Learn", desc: "See why your decision matters" },
];

export default function Home() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-space-950 via-space-950/80 to-transparent" />
      <Navbar />

      <div className="relative z-10 max-w-3xl px-6 md:px-10 pt-40 pb-16">
        <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
          BECOME THE
          <br />
          <span className="text-moon-blue">MISSION</span>
          <br />
          COMMANDER
        </h1>
        <p className="mt-6 text-xl text-slate-200 font-medium">Plan. Decide. Explore.</p>
        <p className="mt-2 text-slate-400 max-w-md">
          Learn real space engineering through mission decisions.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/missions"
            className="px-6 py-3 rounded-md bg-moon-blue hover:bg-blue-500 transition-colors font-medium"
          >
            Start Mission →
          </Link>
          <Link
            to="/how-it-works"
            className="px-6 py-3 rounded-md border border-slate-500 hover:border-slate-300 transition-colors font-medium"
          >
            How It Works
          </Link>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-xl">
          <div className="rounded-lg border border-slate-700 bg-space-900/70 backdrop-blur p-4">
            <p className="font-display text-lg font-semibold">MOON MISSION</p>
            <p className="text-sm text-slate-400 mt-1">Build and survive a lunar mission.</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-moon-blue">● Beginner</span>
              <Link to="/missions" className="text-xs text-moon-blue hover:underline">Explore →</Link>
            </div>
          </div>
          <div className="rounded-lg border border-mars-orange/60 bg-space-900/70 backdrop-blur p-4">
            <p className="font-display text-lg font-semibold">MARS MISSION</p>
            <p className="text-sm text-slate-400 mt-1">Manage a longer and more challenging mission.</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-mars-orange">● Intermediate</span>
              <Link to="/missions" className="text-xs text-mars-orange hover:underline">Explore →</Link>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-slate-400">
          Build with <span className="text-moon-blue font-medium">NASA supported</span> data and references.
        </p>
      </div>

      <div className="relative z-10 bg-space-900/90 backdrop-blur border-t border-slate-800 px-6 md:px-10 py-10">
        <p className="text-xs uppercase tracking-wide text-moon-blue font-semibold">How it works</p>
        <h2 className="font-display text-2xl md:text-3xl font-bold mt-1">Your Mission Journey</h2>
        <p className="text-slate-400 mt-1 max-w-lg text-sm">
          From training to debrief, experience the full cycle of a real-life space mission.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-6 sm:gap-4 flex-wrap">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.title}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border border-moon-blue/60 flex items-center justify-center text-moon-blue">
                  {i + 1}
                </div>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-xs text-slate-400">{step.desc}</p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden sm:block w-8 h-px bg-slate-700 self-center" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
