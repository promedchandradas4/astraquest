import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import heroBg from "../assets/hero-mars.jpg";
import { useAuth } from "../api/AuthContext";

export default function Login() {
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await logIn(form);
      navigate("/missions");
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid email or password.");
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
          Welcome Back,
          <br />
          <span className="text-moon-blue">Mission Commander</span>
        </h1>
        <p className="mt-3 text-slate-400 text-sm">
          Log in to continue your journey and explore the universe of possibilities.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
            <div className="text-right mt-1">
              <span className="text-xs text-moon-blue cursor-pointer hover:underline">Forgot password?</span>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-moon-blue hover:bg-blue-500 transition-colors font-medium disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log In →"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-moon-blue hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
