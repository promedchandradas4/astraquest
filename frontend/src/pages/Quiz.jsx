import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import client from "../api/client";

const CHOICE_KEYS = ["A", "B", "C", "D"];

export default function Quiz() {
  const { missionId, topicCode } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null); // score/passed once submitted

  useEffect(() => {
    client.get(`/learning-topics/${topicCode}/`).then(({ data }) => setTopic(data));
  }, [topicCode]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-space-950 flex items-center justify-center text-slate-400">
        Loading quiz…
      </div>
    );
  }

  const questions = topic.questions;
  const question = questions[index];

  const choiceText = (letter) => question[`choice_${letter.toLowerCase()}`];

  const handleSelect = (letter) => {
    if (selected) return; // lock after first pick, like the mockup
    setSelected(letter);
    setAnswers((a) => ({ ...a, [question.id]: letter }));
  };

  const handleNext = async () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
      return;
    }
    // last question — submit to backend for grading
    try {
      const { data } = await client.post(
        `/missions/${missionId}/quiz/${topicCode}/submit/`,
        { answers: { ...answers, [question.id]: selected } }
      );
      setResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-space-950">
        <Navbar />
        <div className="pt-32 px-6 max-w-lg mx-auto text-center">
          <p className="text-xs uppercase tracking-wide text-moon-blue">{topic.title} Quiz</p>
          <h1 className="font-display text-4xl font-bold mt-2">{result.score} / 5</h1>
          {result.passed ? (
            <p className="mt-4 text-green-400 font-medium">
              Passed! Mission progress is now {result.mission_progress}%.
            </p>
          ) : (
            <p className="mt-4 text-amber-400 font-medium">
              You need 3 correct to pass. Review the material and try again.
            </p>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {!result.passed && (
              <Link
                to={`/missions/${missionId}/learn/${topicCode}`}
                className="px-6 py-3 rounded-md border border-slate-500 hover:border-slate-300 font-medium"
              >
                Review Briefing
              </Link>
            )}
            <button
              onClick={() => navigate(`/missions/${missionId}/dashboard`)}
              className="px-6 py-3 rounded-md bg-moon-blue hover:bg-blue-500 font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-950">
      <Navbar />
      <div className="pt-28 px-6 max-w-2xl mx-auto pb-16">
        <div className="flex justify-between text-sm text-slate-400">
          <span>Question {index + 1} / {questions.length}</span>
          <span>Answered: {Object.keys(answers).length}</span>
        </div>

        <h1 className="font-display text-xl md:text-2xl font-bold mt-3">{question.prompt}</h1>

        <div className="mt-6 space-y-3">
          {CHOICE_KEYS.map((letter) => {
            const isSelected = selected === letter;
            return (
              <button
                key={letter}
                onClick={() => handleSelect(letter)}
                className={`w-full text-left px-4 py-3 rounded-md border transition-colors ${
                  isSelected
                    ? "border-moon-blue bg-space-800"
                    : "border-slate-700 bg-space-900/60 hover:border-slate-500"
                }`}
              >
                {choiceText(letter)}
              </button>
            );
          })}
        </div>

        {selected && (
          <button
            onClick={handleNext}
            className="mt-8 px-8 py-3 rounded-md bg-moon-blue hover:bg-blue-500 transition-colors font-medium"
          >
            {index < questions.length - 1 ? "Next →" : "Submit →"}
          </button>
        )}
      </div>
    </div>
  );
}
