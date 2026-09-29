import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { isAuthenticated, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 py-4">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="AstraQuest" className="h-10 md:h-12" />
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-200">
        <Link to="/how-it-works" className="hover:text-moon-blue transition-colors">How it works</Link>
        <Link to="/learn" className="hover:text-moon-blue transition-colors">Learn</Link>
        <Link to="/nasa-data" className="hover:text-moon-blue transition-colors">NASA Data</Link>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <Link
              to="/missions"
              className="w-9 h-9 rounded-full bg-space-700 border border-slate-600 flex items-center justify-center hover:border-moon-blue transition-colors"
              title="Mission selection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm rounded-md border border-slate-500 text-slate-100 hover:border-moon-blue transition-colors"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-sm rounded-md bg-moon-blue text-white hover:bg-blue-500 transition-colors"
            >
              Log In
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
