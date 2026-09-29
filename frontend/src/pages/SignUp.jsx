import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import heroBg from "../assets/hero-mars.jpg";
import { useAuth } from "../api/AuthContext";

export default function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await signUp(form);
      navigate("/missions");
    } catch (err) {
      const data = err?.response?.data;
      setError(data ? Object.values(data).flat().join(" ") : "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center flex" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="absolute inset-0 bg-gradient-to-r from-space-950 via-space-950/85 to-space-950/20" />
      <Navbar />

      <div className="relative z-10 w-full max-w-md px-6 md:px-10 pt-32 pb-16 flex flex-col justify-center">
        <h1 className="font-display text-3xl md:text-4xl font-bold">
          Create Your Account,
          <br />
          <span className="text-moon-blue">Begin Your Journey</span>
        </h1>
        <p className="mt-3 text-slate-400 text-sm">
          Join AstraQuest today and start exploring, learning and planning your space mission.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm text-slate-300">Full name</label>
            <input
              required
              value={form.fullName}
              onChange={update("fullName")}
              placeholder="Enter your full name"
              className="mt-1 w-full rounded-md bg-space-900/70 border border-moon-blue/50 px-3 py-2.5 text-sm focus:outline-none focus:border-moon-blue"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="Enter your email"
              className="mt-1 w-full rounded-md bg-space-900/70 border border-moon-blue/50 px-3 py-2.5 text-sm focus:outline-none focus:border-moon-blue"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={update("password")}
              placeholder="Enter your password"
              className="mt-1 w-full rounded-md bg-space-900/70 border border-moon-blue/50 px-3 py-2.5 text-sm focus:outline-none focus:border-moon-blue"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Confirm Password</label>
            <input
              required
              type="password"
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
              placeholder="Enter your password"
              className="mt-1 w-full rounded-md bg-space-900/70 border border-moon-blue/50 px-3 py-2.5 text-sm focus:outline-none focus:border-moon-blue"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-moon-blue hover:bg-blue-500 transition-colors font-medium disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Sign Up →"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-moon-blue hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
