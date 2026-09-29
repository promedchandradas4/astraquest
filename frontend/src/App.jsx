import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import MissionSelection from "./pages/MissionSelection.jsx";
import MissionPrep from "./pages/MissionPrep.jsx";
import ResourceAllocation from "./pages/ResourceAllocation.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Learn from "./pages/Learn.jsx";
import Quiz from "./pages/Quiz.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import NasaData from "./pages/NasaData.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/nasa-data" element={<NasaData />} />

      <Route path="/missions" element={<ProtectedRoute><MissionSelection /></ProtectedRoute>} />
      <Route path="/missions/:missionType/prepare" element={<ProtectedRoute><MissionPrep /></ProtectedRoute>} />
      <Route path="/missions/:missionId/resources" element={<ProtectedRoute><ResourceAllocation /></ProtectedRoute>} />
      <Route path="/missions/:missionId/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/missions/:missionId/learn/:topicCode" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
      <Route path="/missions/:missionId/quiz/:topicCode" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
    </Routes>
  );
}
