import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import client from "../api/client";

function toEmbedUrl(youtubeUrl) {
  try {
    const id = new URL(youtubeUrl).searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : youtubeUrl;
  } catch {
    return youtubeUrl;
  }
}

export default function Learn() {
  const { missionId, topicCode } = useParams();
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    client.get(`/learning-topics/${topicCode}/`).then(({ data }) => setTopic(data));
  }, [topicCode]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-space-950 flex items-center justify-center text-slate-400">
        Loading topic…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-950">
      <Navbar />
      <div className="pt-24 px-6 md:px-10 pb-16 max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-wide text-moon-blue">Mission Briefing</p>
        <h1 className="font-display text-3xl font-bold mt-1">{topic.title}</h1>

        {topic.youtube_url && (
          <div className="mt-6 aspect-video rounded-lg overflow-hidden border border-slate-700">
            <iframe
              className="w-full h-full"
              src={toEmbedUrl(topic.youtube_url)}
              title={topic.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <div className="mt-6 rounded-lg border border-slate-700 bg-space-900/70 p-5">
          <p className="text-sm text-slate-300 leading-relaxed">{topic.article_summary}</p>
          {topic.nasa_reference_url && (
            <a
              href={topic.nasa_reference_url}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-3 text-xs text-moon-blue hover:underline"
            >
              Read more on NASA →
            </a>
          )}
        </div>

        <Link
          to={`/missions/${missionId}/quiz/${topicCode}`}
          className="inline-block mt-8 px-8 py-3 rounded-md bg-moon-blue hover:bg-blue-500 transition-colors font-medium"
        >
          Take the Quiz →
        </Link>
        <p className="text-xs text-slate-500 mt-2">Score 3 out of 5 to advance your mission.</p>
      </div>
    </div>
  );
}
