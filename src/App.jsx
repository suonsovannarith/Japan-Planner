import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PlannerForm from './components/PlannerForm';
import ItineraryView from './components/ItineraryView';
import JapanMap from './components/JapanMap';
import TransportGuide from './components/TransportGuide';
import CostBreakdown from './components/CostBreakdown';
import TripPrep from './components/TripPrep';
import ShareExportModal from './components/ShareExportModal';
import Footer from './components/Footer';
import SakuraBackground from './components/SakuraBackground';
import { generateSmartItinerary } from './data/itineraryGenerator';

export default function App() {
  // Theme state: defaults to 'light' (airy sakura theme) with localStorage persistence
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('komorebi_theme') || 'light';
    } catch {
      return 'light';
    }
  });
  const [currency, setCurrency] = useState('USD');
  const [activeTab, setActiveTab] = useState('planner');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedMapCity, setSelectedMapCity] = useState('tokyo');

  // Trip Configuration state
  const [duration, setDuration] = useState(7);
  const [startingCity, setStartingCity] = useState('tokyo');
  const [interests, setInterests] = useState(['culture', 'food', 'metropolis', 'nature']);
  const [pace, setPace] = useState('balanced');
  const [budget, setBudget] = useState('mid');
  const [travelers, setTravelers] = useState(2);
  const [targetBudget, setTargetBudget] = useState(null);

  // Sync theme attribute to document body and save preference
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('komorebi_theme', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  // Read URL query params on initial load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('days')) setDuration(Number(params.get('days')));
      if (params.get('city')) setStartingCity(params.get('city'));
      if (params.get('pace')) setPace(params.get('pace'));
      if (params.get('budget')) setBudget(params.get('budget'));
      if (params.get('travelers')) setTravelers(Number(params.get('travelers')));
      if (params.get('targetBudget')) setTargetBudget(Number(params.get('targetBudget')));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Compute smart itinerary
  const itinerary = useMemo(() => {
    return generateSmartItinerary({
      duration,
      startingCity,
      interests,
      pace,
      budget,
      travelers,
      targetBudget
    });
  }, [duration, startingCity, interests, pace, budget, travelers, targetBudget]);

  // Trigger celebration and navigate to itinerary view
  const handleGenerateItinerary = () => {
    // Cherry blossom / gold celebratory confetti
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffb7c5', '#e63946', '#f4a261', '#ffffff']
      });
    } catch (e) {
      console.warn(e);
    }

    setActiveTab('itinerary');
    setTimeout(() => {
      const el = document.getElementById('itinerary-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSelectPreset = (days) => {
    setDuration(days);
    handleGenerateItinerary();
  };

  const handleStartPlanning = () => {
    const el = document.getElementById('planner-wizard');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewCityOnMap = (cityKey) => {
    setSelectedMapCity(cityKey);
    setActiveTab('map');
    setTimeout(() => {
      const el = document.getElementById('map-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      
      {/* Ambient Sakura Branches & Falling Petals Background Animation */}
      <SakuraBackground theme={theme} />

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        theme={theme}
        setTheme={setTheme}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {/* Hero Section (Always visible or in planner tab) */}
        {activeTab === 'planner' && (
          <HeroSection
            onSelectPreset={handleSelectPreset}
            onStartPlanning={handleStartPlanning}
          />
        )}

        {/* Dynamic Section rendering based on activeTab */}
        {activeTab === 'planner' && (
          <PlannerForm
            duration={duration}
            setDuration={setDuration}
            startingCity={startingCity}
            setStartingCity={setStartingCity}
            interests={interests}
            setInterests={setInterests}
            pace={pace}
            setPace={setPace}
            budget={budget}
            setBudget={setBudget}
            travelers={travelers}
            setTravelers={setTravelers}
            targetBudget={targetBudget}
            setTargetBudget={setTargetBudget}
            onGenerateItinerary={handleGenerateItinerary}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryView
            itinerary={itinerary}
            currency={currency}
            setCurrency={setCurrency}
            onViewCityOnMap={handleViewCityOnMap}
            onRestartCustomizer={() => {
              setActiveTab('planner');
              setTimeout(() => {
                const el = document.getElementById('planner-wizard');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            onOpenExport={() => setIsExportOpen(true)}
          />
        )}

        {activeTab === 'map' && (
          <JapanMap
            itinerary={itinerary}
            selectedCityKey={selectedMapCity}
            onSelectCity={setSelectedMapCity}
          />
        )}

        {activeTab === 'transport' && (
          <TransportGuide
            itinerary={itinerary}
            currency={currency}
          />
        )}

        {activeTab === 'budget' && (
          <CostBreakdown
            itinerary={itinerary}
            currency={currency}
            setCurrency={setCurrency}
          />
        )}

        {activeTab === 'prep' && (
          <TripPrep />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Share / Export Modal */}
      <ShareExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        itinerary={itinerary}
      />
    </div>
  );
}
