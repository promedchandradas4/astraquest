import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import client from "../api/client";
import { useAuth } from "../api/AuthContext";

export default function NasaData() {
  const { isAuthenticated } = useAuth();
  const [apod, setApod] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;
    client
      .get("/nasa/apod/")
      .then(({ data }) => setApod(data))
      .catch(() => setError("Couldn't reach NASA's API right now. Try again shortly."));
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-space-950">
      <Navbar />
      <div className="pt-28 px-6 md:px-10 pb-16 max-w-3xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold">
          NASA <span className="text-moon-blue">Data</span>
        </h1>
        <p className="mt-3 text-slate-400 text-sm">
          Astronomy Picture of the Day, pulled live from{" "}
          <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer" className="text-moon-blue hover:underline">
            api.nasa.gov
          </a>{" "}
          through AstraQuest's backend.
        </p>

        {!isAuthenticated && (
          <p className="mt-6 text-sm text-amber-400">Log in to load live NASA imagery.</p>
        )}
        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

        {apod && (
          <div className="mt-8 rounded-lg border border-slate-700 bg-space-900/70 overflow-hidden">
            {apod.media_type === "image" ? (
              <img src={apod.url} alt={apod.title} className="w-full max-h-96 object-cover" />
            ) : (
              <div className="aspect-video">
                <iframe className="w-full h-full" src={apod.url} title={apod.title} allowFullScreen />
              </div>
            )}
            <div className="p-5">
              <p className="font-medium">{apod.title}</p>
              <p className="text-xs text-slate-500 mt-1">{apod.date}</p>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">{apod.explanation}</p>
            </div>
          </div>
        )}

        <div className="mt-10 border-t border-slate-800 pt-6">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">More NASA references</p>
          <ul className="text-sm space-y-1">
            <li><a className="text-moon-blue hover:underline" href="https://data.nasa.gov/" target="_blank" rel="noreferrer">data.nasa.gov</a></li>
            <li><a className="text-moon-blue hover:underline" href="https://power.larc.nasa.gov/data-access-viewer/" target="_blank" rel="noreferrer">NASA POWER Data Access Viewer</a></li>
            <li><a className="text-moon-blue hover:underline" href="https://science.nasa.gov/" target="_blank" rel="noreferrer">science.nasa.gov</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
