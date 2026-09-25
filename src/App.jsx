import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PlannerForm from './components/PlannerForm';
import ItineraryView from './components/ItineraryView';
import InteractiveMap from './components/InteractiveMap';
import TransportGuide from './components/TransportGuide';
import CostBreakdown from './components/CostBreakdown';
import TripPrep from './components/TripPrep';
import ShareExportModal from './components/ShareExportModal';
import Footer from './components/Footer';
import SakuraBackground from './components/SakuraBackground';
import MyTrips from './components/MyTrips';
import SaveTripModal from './components/SaveTripModal';
import VehicleRentals from './components/VehicleRentals';
import { generateSmartItinerary } from './data/itineraryGenerator';

// localStorage helpers for saved trips
const TRIPS_STORAGE_KEY = 'komorebi_saved_trips';

function loadSavedTrips() {
  try {
    const raw = localStorage.getItem(TRIPS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistTrips(trips) {
  try {
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
  } catch {
    // ignore storage errors
  }
}

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

  // Arrival Logistics state
  const [arrivalAirport, setArrivalAirport] = useState('HND');
  const [arrivalTime, setArrivalTime] = useState('afternoon');
  const [needAirportHotel, setNeedAirportHotel] = useState(false);
  const [selectedAirportHotel, setSelectedAirportHotel] = useState(null);

  // Multi-trip state
  const [savedTrips, setSavedTrips] = useState(() => loadSavedTrips());
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

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
      targetBudget,
      arrivalAirport,
      arrivalTime,
      needAirportHotel,
      selectedAirportHotel
    });
  }, [duration, startingCity, interests, pace, budget, travelers, targetBudget, arrivalAirport, arrivalTime, needAirportHotel, selectedAirportHotel]);

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

  // --- Multi-Trip Management ---
  const handleSaveTrip = useCallback((tripName) => {
    const newTrip = {
      id: `trip_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: tripName,
      savedAt: Date.now(),
      // Store the configuration so we can regenerate
      config: {
        duration,
        startingCity,
        interests: [...interests],
        pace,
        budget,
        travelers,
        targetBudget,
        arrivalAirport,
        arrivalTime,
        needAirportHotel,
        selectedAirportHotel,
      },
      // Store the summary for card display without regenerating
      summary: itinerary?.summary ? { ...itinerary.summary } : null,
    };

    const updated = [newTrip, ...savedTrips];
    setSavedTrips(updated);
    persistTrips(updated);
    setIsSaveModalOpen(false);

    // Show success confetti
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#2dd4bf', '#f4a261', '#60a5fa'],
      });
    } catch {}
  }, [savedTrips, duration, startingCity, interests, pace, budget, travelers, targetBudget, itinerary]);

  const handleDeleteTrip = useCallback((tripId) => {
    const updated = savedTrips.filter(t => t.id !== tripId);
    setSavedTrips(updated);
    persistTrips(updated);
  }, [savedTrips]);

  const handleLoadTrip = useCallback((trip) => {
    if (trip.config) {
      setDuration(trip.config.duration);
      setStartingCity(trip.config.startingCity);
      setInterests(trip.config.interests);
      setPace(trip.config.pace);
      setBudget(trip.config.budget);
      setTravelers(trip.config.travelers);
      setTargetBudget(trip.config.targetBudget);
      if (trip.config.arrivalAirport) setArrivalAirport(trip.config.arrivalAirport);
      if (trip.config.arrivalTime) setArrivalTime(trip.config.arrivalTime);
      if (trip.config.needAirportHotel !== undefined) setNeedAirportHotel(trip.config.needAirportHotel);
      if (trip.config.selectedAirportHotel !== undefined) setSelectedAirportHotel(trip.config.selectedAirportHotel);
    }
    setActiveTab('itinerary');
    setTimeout(() => {
      const el = document.getElementById('itinerary-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  }, []);

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
        savedTripsCount={savedTrips.length}
        onSaveTrip={() => setIsSaveModalOpen(true)}
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
            arrivalAirport={arrivalAirport}
            setArrivalAirport={setArrivalAirport}
            arrivalTime={arrivalTime}
            setArrivalTime={setArrivalTime}
            needAirportHotel={needAirportHotel}
            setNeedAirportHotel={setNeedAirportHotel}
            selectedAirportHotel={selectedAirportHotel}
            setSelectedAirportHotel={setSelectedAirportHotel}
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
            onSaveTrip={() => setIsSaveModalOpen(true)}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveMap
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

        {activeTab === 'rentals' && (
          <VehicleRentals
            currency={currency}
            selectedAirport={arrivalAirport}
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

        {activeTab === 'trips' && (
          <MyTrips
            savedTrips={savedTrips}
            onLoadTrip={handleLoadTrip}
            onDeleteTrip={handleDeleteTrip}
            onNewTrip={() => setActiveTab('planner')}
          />
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

      {/* Save Trip Modal */}
      <SaveTripModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveTrip}
        itinerary={itinerary}
      />
    </div>
  );
}
