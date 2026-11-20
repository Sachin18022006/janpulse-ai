import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HackathonDemoBar from './components/HackathonDemoBar';
import HackathonPitchModal from './components/HackathonPitchModal';
import LandingPage from './pages/LandingPage';
import ReportIssuePage from './pages/ReportIssuePage';
import MapExplorerPage from './pages/MapExplorerPage';
import DashboardPage from './pages/DashboardPage';
import ComplaintDetailsPage from './pages/ComplaintDetailsPage';
import TrackComplaintPage from './pages/TrackComplaintPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

export const App = () => {
  const [pitchOpen, setPitchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal font-sans antialiased relative pb-16">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/map" element={<MapExplorerPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/complaints/:id" element={<ComplaintDetailsPage />} />
          <Route path="/track" element={<TrackComplaintPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Persistent Floating Hackathon Bar for Judges & Live Demonstrations */}
      <HackathonDemoBar onOpenPitch={() => setPitchOpen(true)} />

      {/* 3-Minute Presentation Deck & Architecture Modal */}
      <HackathonPitchModal isOpen={pitchOpen} onClose={() => setPitchOpen(false)} />
    </div>
  );
};

export default App;
