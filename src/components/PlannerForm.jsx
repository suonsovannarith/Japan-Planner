import React, { useState } from 'react';
import { 
  Clock, MapPin, Sparkles, Zap, Users, ArrowRight, ArrowLeft, 
  Check, Landmark, Utensils, Gamepad2, Mountain, Building2, Brush, Wine, Compass, CheckCircle2, DollarSign, Wallet,
  Plane, Sun, Sunset, Moon, BedDouble, Building, ExternalLink, ShieldCheck, Info
} from 'lucide-react';
import { INTEREST_CATEGORIES, PACE_OPTIONS, BUDGET_TIERS } from '../data/interests';
import { JPY_PER_USD, formatDualPrice } from '../data/currency';
import { AIRPORTS, ARRIVAL_TIME_SLOTS } from '../data/arrivalLogistics';

// Icon Map helper
const iconMap = {
  Landmark,
  Utensils,
  Gamepad2,
  Mountain,
  Sparkles,
  Building2,
  Brush,
  Wine
};

export default function PlannerForm({
  duration,
  setDuration,
  startingCity,
  setStartingCity,
  interests,
  setInterests,
  pace,
  setPace,
  budget,
  setBudget,
  travelers,
  setTravelers,
  targetBudget,
  setTargetBudget,
  arrivalAirport = 'HND',
  setArrivalAirport,
  arrivalTime = 'afternoon',
  setArrivalTime,
  needAirportHotel = false,
  setNeedAirportHotel,
  selectedAirportHotel = null,
  setSelectedAirportHotel,
  onGenerateItinerary
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [budgetCurrency, setBudgetCurrency] = useState('USD'); // 'USD' | 'JPY'
  const [customBudgetValue, setCustomBudgetValue] = useState(() => {
    if (targetBudget && targetBudget > 0) {
      return budgetCurrency === 'USD' ? Math.round(targetBudget / JPY_PER_USD) : targetBudget;
    }
    return '';
  });

  // Slider bounds
  const minDays = 3;
  const maxDays = 30;

  // Accurate slider percentage calculation
  const sliderPercentage = Math.max(0, Math.min(100, ((duration - minDays) / (maxDays - minDays)) * 100));

  // Key duration tick marks mapped accurately to their mathematical percentage
  const durationTicks = [
    { val: 3, label: '3d', fullLabel: '3 Days' },
    { val: 7, label: '7d', fullLabel: '1 Week (7d)' },
    { val: 14, label: '14d', fullLabel: '2 Weeks (14d)' },
    { val: 21, label: '21d', fullLabel: '3 Weeks (21d)' },
    { val: 30, label: '30d', fullLabel: '1 Month (30d)' },
  ];

  // Quick preset pills
  const presets = [
    { d: 4, label: '3-4 Days', sub: 'Tokyo or Kansai Express' },
    { d: 7, label: '7 Days', sub: 'Classic 1-Week Golden Route' },
    { d: 10, label: '10 Days', sub: 'Kanto, Fuji & Kansai' },
    { d: 14, label: '14 Days', sub: '2-Week Deep Dive Odyssey' },
    { d: 21, label: '21 Days', sub: '3-Week Multi-Region' },
    { d: 28, label: '28 Days', sub: '1-Month Grand Expedition' }
  ];


  const toggleInterest = (id) => {
    if (interests.includes(id)) {
      if (interests.length > 1) {
        setInterests(interests.filter(item => item !== id));
      }
    } else {
      setInterests([...interests, id]);
    }
  };

  const stepsMeta = [
    { num: 1, title: 'Trip Duration', short: 'Duration' },
    { num: 2, title: 'Arrival Details & Airport Lodging', short: 'Arrival Hub' },
    { num: 3, title: 'Travel Passions', short: 'Vibes' },
    { num: 4, title: 'Pace & Budget', short: 'Pace & Budget' },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onGenerateItinerary();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Quick budget presets calculation based on duration & travelers
  const budgetPresets = [
    {
      tierId: 'budget',
      name: 'Backpacker / Value',
      usd: Math.round(duration * travelers * 85),
      jpy: Math.round(duration * travelers * 85 * JPY_PER_USD),
      desc: 'Hostels, business hotels, IC card transit, ramen & conbini gems'
    },
    {
      tierId: 'mid',
      name: 'Balanced Explorer',
      usd: Math.round(duration * travelers * 175),
      jpy: Math.round(duration * travelers * 175 * JPY_PER_USD),
      desc: '3-4 star modern hotels, Shinkansen travel, diverse dining & sights'
    },
    {
      tierId: 'luxury',
      name: 'Luxury / Ryokan',
      usd: Math.round(duration * travelers * 380),
      jpy: Math.round(duration * travelers * 380 * JPY_PER_USD),
      desc: '5-star premier hotels, private onsen ryokan with Kaiseki feasts'
    }
  ];

  const handleSelectBudgetPreset = (preset) => {
    setBudget(preset.tierId);
    setTargetBudget(preset.jpy);
    setCustomBudgetValue(budgetCurrency === 'USD' ? preset.usd : preset.jpy);
  };

  const handleCustomBudgetChange = (valStr) => {
    setCustomBudgetValue(valStr);
    const num = parseFloat(valStr.replace(/[^0-9.]/g, ''));
    if (!isNaN(num) && num > 0) {
      const jpyVal = budgetCurrency === 'USD' ? Math.round(num * JPY_PER_USD) : Math.round(num);
      setTargetBudget(jpyVal);
    } else {
      setTargetBudget(null);
    }
  };

  const handleToggleBudgetCurrency = (newCurr) => {
    if (newCurr === budgetCurrency) return;
    setBudgetCurrency(newCurr);
    if (targetBudget && targetBudget > 0) {
      setCustomBudgetValue(newCurr === 'USD' ? Math.round(targetBudget / JPY_PER_USD) : targetBudget);
    }
  };

  return (
    <section id="planner-wizard" style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        
        {/* Multi-Step Wizard Card */}
        <div className="glass-card" style={{
          padding: 'clamp(1.25rem, 4vw, 3rem)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '24px',
          boxShadow: 'var(--glass-shadow)',
          position: 'relative',
        }}>

          {/* Stepper Header (Typeform / Airbnb Style) */}
          <div style={{ marginBottom: '2.5rem' }}>
            
            {/* Top Step Breadcrumb & Status */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="badge badge-crimson" style={{ letterSpacing: '0.08em', fontWeight: '800' }}>
                  PHASE 0{currentStep} / 04
                </span>
                <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', fontWeight: '700' }}>
                  {stepsMeta[currentStep - 1].title}
                </span>
              </div>

              {/* Step indicator pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {stepsMeta.map((s) => {
                  const isDone = currentStep > s.num;
                  const isCurrent = currentStep === s.num;
                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => setCurrentStep(s.num)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.8rem',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: isCurrent ? '800' : '600',
                        backgroundColor: isCurrent 
                          ? 'rgba(230, 57, 70, 0.18)' 
                          : isDone 
                          ? 'rgba(42, 157, 143, 0.14)' 
                          : 'var(--bg-surface-elevated)',
                        color: isCurrent 
                          ? 'var(--accent-crimson)' 
                          : isDone 
                          ? 'var(--accent-matcha)' 
                          : 'var(--text-muted)',
                        border: '1px solid',
                        borderColor: isCurrent 
                          ? 'var(--accent-crimson)' 
                          : isDone 
                          ? 'rgba(42, 157, 143, 0.35)' 
                          : 'var(--border-subtle)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isDone ? (
                        <Check size={12} strokeWidth={3} />
                      ) : (
                        <span>{s.num}</span>
                      )}
                      <span className="hide-on-mobile">{s.short}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Top Animated Progress Bar */}
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'rgba(148, 163, 184, 0.15)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${(currentStep / 4) * 100}%`,
                background: 'linear-gradient(90deg, #e63946 0%, #f4a261 100%)',
                boxShadow: '0 0 12px rgba(230, 57, 70, 0.6)',
                borderRadius: '9999px',
                transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }} />
            </div>

          </div>

          {/* ============================================================== */}
          {/* PHASE 1: DURATION & SCOPE                                      */}
          {/* ============================================================== */}
          {currentStep === 1 && (
            <div className="wizard-step-enter" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              <div>
                <h2 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)', fontWeight: '800', marginBottom: '0.6rem' }}>
                  How long is your Japan journey?
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.65' }}>
                  Slide to any custom length from 3 to 30 days, or pick a curated travel duration below.
                </p>
              </div>

              {/* Large Dynamic Day Counter Banner */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '1.5rem 1.8rem',
                borderRadius: '16px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(230, 57, 70, 0.15)',
                    color: 'var(--accent-crimson)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(230, 57, 70, 0.25)',
                  }}>
                    <Clock size={28} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-crimson)', lineHeight: 1 }}>
                        {duration}
                      </span>
                      <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                        Days
                      </span>
                      <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                        ({duration - 1} Nights)
                      </span>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {duration <= 5 
                        ? 'Quick City Sprint — Focused on 1 core region'
                        : duration <= 10 
                        ? 'Golden Route Explorer — Tokyo, Kyoto & Osaka'
                        : duration <= 18 
                        ? 'Grand Deep Dive — Golden Route + Hiroshima, Alps & Onsens'
                        : 'Comprehensive Cross-Country Tour — Hokkaido to Kyushu'}
                    </div>
                  </div>
                </div>

                <div className="badge badge-gold" style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}>
                  {duration >= 14 ? 'Ideal for JR Passes' : 'Point-to-Point Transit'}
                </div>
              </div>

              {/* Precision Range Slider */}
              <div style={{ padding: '0.5rem 0.25rem' }}>
                <div style={{ position: 'relative', width: '100%', marginBottom: '0.5rem' }}>
                  <input
                    type="range"
                    min={minDays}
                    max={maxDays}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="custom-range-slider"
                    style={{
                      background: `linear-gradient(to right, #e63946 0%, #e63946 ${sliderPercentage}%, rgba(148, 163, 184, 0.2) ${sliderPercentage}%, rgba(148, 163, 184, 0.2) 100%)`,
                    }}
                  />
                </div>

                {/* Mathematically Aligned Landmark Ticks */}
                <div style={{ position: 'relative', width: '100%', height: '42px', marginTop: '10px' }}>
                  {durationTicks.map((tick) => {
                    const tickPct = ((tick.val - minDays) / (maxDays - minDays)) * 100;
                    const isSelected = duration === tick.val;

                    return (
                      <button
                        key={tick.val}
                        type="button"
                        onClick={() => setDuration(tick.val)}
                        style={{
                          position: 'absolute',
                          left: `${tickPct}%`,
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          background: 'none',
                          border: 'none',
                          padding: '0 4px',
                        }}
                      >
                        <div style={{
                          width: '2px',
                          height: '9px',
                          backgroundColor: isSelected ? 'var(--accent-crimson)' : 'rgba(148, 163, 184, 0.4)',
                          marginBottom: '6px',
                          transition: 'all 0.2s ease',
                        }} />
                        <span className="tick-label-full" style={{
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? '800' : '600',
                          color: isSelected ? 'var(--accent-crimson)' : 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s ease',
                        }}>
                          {tick.fullLabel}
                        </span>
                        <span className="tick-label-short" style={{
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? '800' : '600',
                          color: isSelected ? 'var(--accent-crimson)' : 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s ease',
                        }}>
                          {tick.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Preset Cards Grid */}
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', display: 'block', marginBottom: '1rem' }}>
                  Or Choose a Popular Preset:
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                  gap: '0.9rem',
                }}>
                  {presets.map((preset) => {
                    const isActive = duration === preset.d;
                    return (
                      <div
                        key={preset.d}
                        onClick={() => setDuration(preset.d)}
                        className="glass-card interactive-hover"
                        style={{
                          padding: '1.1rem 1.25rem',
                          cursor: 'pointer',
                          borderRadius: '14px',
                          border: '2px solid',
                          borderColor: isActive ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                          backgroundColor: isActive ? 'rgba(230, 57, 70, 0.12)' : 'var(--bg-surface-elevated)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                          <span style={{
                            fontWeight: '800',
                            fontSize: '1.05rem',
                            color: isActive ? 'var(--accent-crimson)' : 'var(--text-primary)',
                          }}>
                            {preset.label}
                          </span>
                          {isActive && (
                            <CheckCircle2 size={18} style={{ color: 'var(--accent-crimson)' }} />
                          )}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          {preset.sub}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* PHASE 2: ARRIVAL DETAILS & AIRPORT LODGING QUESTIONNAIRE       */}
          {/* ============================================================== */}
          {currentStep === 2 && (
            <div className="wizard-step-enter" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              <div>
                <h2 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)', fontWeight: '800', marginBottom: '0.6rem' }}>
                  Arrival Logistics & First Night Stay
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.65' }}>
                  Tell us where and when your flight touches down in Japan. We will automatically calibrate your Day 1 schedule and offer curated transit-accessible airport accommodations.
                </p>
              </div>

              {/* 1. Port of Entry Selection */}
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1rem' }}>
                  <Plane size={16} style={{ color: 'var(--accent-crimson)' }} />
                  <span>1. Select Port of Entry (Arrival Airport Hub):</span>
                </label>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                  gap: '1.1rem',
                }}>
                  {AIRPORTS.map((airport) => {
                    const isSelected = arrivalAirport === airport.id;
                    return (
                      <div
                        key={airport.id}
                        onClick={() => {
                          if (setArrivalAirport) setArrivalAirport(airport.id);
                          if (setStartingCity) setStartingCity(airport.cityKey);
                          if (setSelectedAirportHotel && airport.hotels && airport.hotels.length > 0) {
                            setSelectedAirportHotel(airport.hotels[0]);
                          }
                        }}
                        className="glass-card interactive-hover"
                        style={{
                          overflow: 'hidden',
                          cursor: 'pointer',
                          borderRadius: '16px',
                          border: '2.5px solid',
                          borderColor: isSelected ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                          backgroundColor: 'var(--bg-surface-elevated)',
                          boxShadow: isSelected ? '0 12px 28px rgba(230, 57, 70, 0.25)' : 'none',
                          transition: 'all 0.25s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        {/* Airport Header */}
                        <div style={{
                          height: '110px',
                          backgroundImage: `url(${airport.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative',
                          padding: '0.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}>
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(10, 13, 20, 0.95) 0%, rgba(10, 13, 20, 0.3) 100%)',
                          }} />

                          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="badge" style={{ backgroundColor: '#e63946', color: '#fff', fontWeight: '800', fontSize: '0.85rem' }}>
                              {airport.code}
                            </span>
                            {isSelected && (
                              <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: '#fff',
                                color: 'var(--accent-crimson)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                              }}>
                                <Check size={16} strokeWidth={3} />
                              </div>
                            )}
                          </div>

                          <div style={{ position: 'relative' }}>
                            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff' }}>
                              {airport.city}
                            </div>
                            <div className="kanji-text" style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
                              {airport.kanji}
                            </div>
                          </div>
                        </div>

                        {/* Airport Details */}
                        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                              {airport.name}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--accent-matcha)', fontWeight: '600' }}>
                              ⏱️ {airport.transferTime}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.4 }}>
                              {airport.transferSummary}
                            </div>
                          </div>

                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                            💳 {airport.icCardPickup}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Initial Itinerary Gateway Confirmation */}
                <div style={{
                  marginTop: '1rem',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    🎯 <strong>First Destination City:</strong> Starting itinerary in{' '}
                    <span style={{ color: 'var(--accent-crimson)', fontWeight: '800', textTransform: 'capitalize' }}>
                      {startingCity}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {['tokyo', 'osaka', 'kyoto', 'fukuoka', 'sapporo'].map(cKey => (
                      <button
                        key={cKey}
                        type="button"
                        onClick={() => setStartingCity && setStartingCity(cKey)}
                        style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          fontWeight: startingCity === cKey ? '800' : '500',
                          backgroundColor: startingCity === cKey ? 'var(--accent-crimson)' : 'transparent',
                          color: startingCity === cKey ? '#fff' : 'var(--text-muted)',
                          border: '1px solid',
                          borderColor: startingCity === cKey ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                          cursor: 'pointer',
                          textTransform: 'capitalize',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {cKey}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Estimated Arrival Time Selection */}
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1rem' }}>
                  <Clock size={16} style={{ color: 'var(--accent-gold)' }} />
                  <span>2. Estimated Landing Time at Airport:</span>
                </label>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
                  gap: '0.9rem',
                }}>
                  {ARRIVAL_TIME_SLOTS.map((slot) => {
                    const isSelected = arrivalTime === slot.id;
                    const SlotIcon = slot.icon === 'Sun' ? Sun : slot.icon === 'Sunset' ? Sunset : slot.icon === 'Moon' ? Moon : Plane;

                    return (
                      <div
                        key={slot.id}
                        onClick={() => setArrivalTime && setArrivalTime(slot.id)}
                        className="glass-card interactive-hover"
                        style={{
                          padding: '1.1rem',
                          cursor: 'pointer',
                          borderRadius: '14px',
                          border: '2px solid',
                          borderColor: isSelected ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                          backgroundColor: isSelected ? 'rgba(230, 57, 70, 0.1)' : 'var(--bg-surface-elevated)',
                          boxShadow: isSelected ? '0 8px 20px rgba(230, 57, 70, 0.2)' : 'none',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: isSelected ? 'var(--accent-crimson)' : 'rgba(148, 163, 184, 0.15)',
                              color: isSelected ? '#fff' : 'var(--text-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <SlotIcon size={16} />
                            </div>
                            {isSelected && (
                              <CheckCircle2 size={18} style={{ color: 'var(--accent-crimson)' }} />
                            )}
                          </div>

                          <div style={{ fontWeight: '800', fontSize: '0.95rem', color: isSelected ? 'var(--accent-crimson)' : 'var(--text-primary)', marginBottom: '0.2rem' }}>
                            {slot.label}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                            {slot.desc}
                          </div>
                        </div>

                        <div style={{ marginTop: '0.85rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: '700' }}>
                          ⚡ {slot.impact}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Day 1 Calibration Notice Banner */}
              <div style={{
                padding: '1.1rem 1.4rem',
                borderRadius: '14px',
                border: '1px solid',
                borderColor: (arrivalTime === 'evening' || arrivalTime === 'late-night') ? 'rgba(230, 57, 70, 0.35)' : 'rgba(42, 157, 143, 0.35)',
                backgroundColor: (arrivalTime === 'evening' || arrivalTime === 'late-night') ? 'rgba(230, 57, 70, 0.08)' : 'rgba(42, 157, 143, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.9rem',
              }}>
                <span style={{ fontSize: '1.4rem' }}>
                  {(arrivalTime === 'evening' || arrivalTime === 'late-night') ? '🛬' : '☀️'}
                </span>
                <div style={{ fontSize: '0.86rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  {(arrivalTime === 'evening' || arrivalTime === 'late-night') ? (
                    <>
                      <strong>Dynamic Day 1 Calibration Active:</strong> Because your flight arrives in the {arrivalTime === 'late-night' ? 'late night' : 'evening'}, daytime sightseeing activities will be gracefully skipped on Day 1. Instead, your schedule will focus strictly on customs clearance, pocket WiFi / IC card pickup, stress-free hotel check-in, convenience store conbini snacks, and an unwinding casual dinner before starting full adventures on Day 2!
                    </>
                  ) : (
                    <>
                      <strong>Standard Daytime Arrival:</strong> Your daytime schedule is fully active. You will drop luggage at your hotel and begin exploring in the afternoon.
                    </>
                  )}
                </div>
              </div>

              {/* 3. Airport Accommodation Assistance */}
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
                  <BedDouble size={16} style={{ color: '#38bdf8' }} />
                  <span>3. Airport Accommodation Assistance:</span>
                </label>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Do you need accommodations near the airport for Night 1?
                </p>

                {/* Yes/No Choice Toggle */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                }}>
                  <div
                    onClick={() => {
                      if (setNeedAirportHotel) setNeedAirportHotel(false);
                      if (setSelectedAirportHotel) setSelectedAirportHotel(null);
                    }}
                    className="glass-card interactive-hover"
                    style={{
                      padding: '1.25rem',
                      cursor: 'pointer',
                      borderRadius: '14px',
                      border: '2px solid',
                      borderColor: !needAirportHotel ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                      backgroundColor: !needAirportHotel ? 'rgba(230, 57, 70, 0.1)' : 'var(--bg-surface-elevated)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: !needAirportHotel ? 'var(--accent-crimson)' : 'rgba(148, 163, 184, 0.15)',
                      color: !needAirportHotel ? '#fff' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Building size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '800', fontSize: '0.95rem', color: !needAirportHotel ? 'var(--accent-crimson)' : 'var(--text-primary)' }}>
                        No, I have my stay planned
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Proceed directly into main city routing and hotels
                      </div>
                    </div>
                    {!needAirportHotel && (
                      <CheckCircle2 size={20} style={{ color: 'var(--accent-crimson)' }} />
                    )}
                  </div>

                  <div
                    onClick={() => {
                      if (setNeedAirportHotel) setNeedAirportHotel(true);
                      const currentAirportObj = AIRPORTS.find(a => a.id === arrivalAirport) || AIRPORTS[0];
                      if (setSelectedAirportHotel && currentAirportObj.hotels && currentAirportObj.hotels.length > 0) {
                        setSelectedAirportHotel(currentAirportObj.hotels[0]);
                      }
                    }}
                    className="glass-card interactive-hover"
                    style={{
                      padding: '1.25rem',
                      cursor: 'pointer',
                      borderRadius: '14px',
                      border: '2px solid',
                      borderColor: needAirportHotel ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                      backgroundColor: needAirportHotel ? 'rgba(230, 57, 70, 0.1)' : 'var(--bg-surface-elevated)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: needAirportHotel ? 'var(--accent-crimson)' : 'rgba(148, 163, 184, 0.15)',
                      color: needAirportHotel ? '#fff' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <BedDouble size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '800', fontSize: '0.95rem', color: needAirportHotel ? 'var(--accent-crimson)' : 'var(--text-primary)' }}>
                        Yes, show nearby transit stays
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Suggest 2–3 curated transit-accessible hotels
                      </div>
                    </div>
                    {needAirportHotel && (
                      <CheckCircle2 size={20} style={{ color: 'var(--accent-crimson)' }} />
                    )}
                  </div>
                </div>

                {/* Curated Airport Hotels List (if user selected Yes) */}
                {needAirportHotel && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                      Curated Transit Hotels near {AIRPORTS.find(a => a.id === arrivalAirport)?.name || 'Arrival Airport'}:
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                      gap: '1rem',
                    }}>
                      {(() => {
                        const currentAirportObj = AIRPORTS.find(a => a.id === arrivalAirport) || AIRPORTS[0];
                        return currentAirportObj.hotels.map((hotel) => {
                          const isHotelActive = selectedAirportHotel?.id === hotel.id || (!selectedAirportHotel && hotel === currentAirportObj.hotels[0]);
                          const hotelPriceDual = formatDualPrice(hotel.priceJPY, budgetCurrency);

                          return (
                            <div
                              key={hotel.id}
                              onClick={() => setSelectedAirportHotel && setSelectedAirportHotel(hotel)}
                              className="glass-card"
                              style={{
                                padding: '1.25rem',
                                borderRadius: '16px',
                                border: '2px solid',
                                borderColor: isHotelActive ? 'var(--accent-matcha)' : 'var(--border-subtle)',
                                backgroundColor: isHotelActive ? 'rgba(42, 157, 143, 0.08)' : 'var(--bg-surface-elevated)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                  <span className="badge badge-matcha" style={{ fontSize: '0.7rem' }}>
                                    {hotel.badge}
                                  </span>
                                  {isHotelActive && (
                                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-matcha)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                      <CheckCircle2 size={14} /> Selected
                                    </span>
                                  )}
                                </div>

                                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                                  {hotel.name}
                                </h4>

                                <div style={{ fontSize: '0.8rem', color: 'var(--accent-indigo)', fontWeight: '600', marginBottom: '0.5rem' }}>
                                  📍 {hotel.distance}
                                </div>

                                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.85rem' }}>
                                  💡 {hotel.tip}
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                                  {hotel.features.map((feat, fIdx) => (
                                    <span key={fIdx} style={{
                                      padding: '0.15rem 0.5rem',
                                      borderRadius: '6px',
                                      backgroundColor: 'rgba(148, 163, 184, 0.1)',
                                      fontSize: '0.72rem',
                                      color: 'var(--text-secondary)',
                                    }}>
                                      {feat}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div style={{
                                borderTop: '1px solid var(--border-subtle)',
                                paddingTop: '0.85rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                                <div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                                    Est. Night 1 Rate
                                  </div>
                                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
                                    {hotelPriceDual.primary}
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '500', marginLeft: '3px' }}>
                                      ({hotelPriceDual.secondary})
                                    </span>
                                  </div>
                                </div>

                                <a
                                  href={hotel.bookingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    padding: '0.4rem 0.75rem',
                                    borderRadius: '8px',
                                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                                    color: '#38bdf8',
                                    fontSize: '0.78rem',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                  }}
                                >
                                  <span>Details</span>
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}


          {/* ============================================================== */}
          {/* PHASE 3: TRAVEL VIBE & INTERESTS                               */}
          {/* ============================================================== */}
          {currentStep === 3 && (
            <div className="wizard-step-enter" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)', fontWeight: '800', marginBottom: '0.6rem' }}>
                    What excites you most?
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.65' }}>
                    Select your personal passions. We’ll prioritize morning, afternoon, and evening sights around them.
                  </p>
                </div>

                <div style={{
                  background: 'var(--bg-surface-elevated)',
                  padding: '0.45rem 1.1rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  color: 'var(--accent-gold)',
                }}>
                  {interests.length} of {INTEREST_CATEGORIES.length} Selected
                </div>
              </div>

              {/* Visual Vibe Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                gap: '1.1rem',
              }}>
                {INTEREST_CATEGORIES.map((category) => {
                  const Icon = iconMap[category.icon] || Sparkles;
                  const isSelected = interests.includes(category.id);

                  return (
                    <div
                      key={category.id}
                      onClick={() => toggleInterest(category.id)}
                      className="glass-card interactive-hover"
                      style={{
                        padding: '1.35rem',
                        cursor: 'pointer',
                        borderRadius: '16px',
                        border: '2px solid',
                        borderColor: isSelected ? category.color : 'var(--border-subtle)',
                        backgroundColor: isSelected ? `${category.color}15` : 'var(--bg-surface-elevated)',
                        boxShadow: isSelected ? `0 10px 25px ${category.color}25` : 'none',
                        transition: 'all 0.25s ease',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      {/* Checkmark icon */}
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: category.color,
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Check size={13} strokeWidth={3} />
                        </div>
                      )}

                      <div>
                        {/* Icon & Title */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.6rem' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            backgroundColor: `${category.color}25`,
                            color: category.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <Icon size={22} />
                          </div>

                          <div>
                            <div style={{ fontWeight: '800', fontSize: '1.05rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-primary)' }}>
                              {category.title}
                            </div>
                            <span className="kanji-text" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {category.kanji}
                            </span>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                          {category.subtitle}
                        </p>
                      </div>

                      {/* Popular Tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {category.popularTags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.72rem',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(148, 163, 184, 0.12)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* PHASE 4: PACING, BUDGET & TRAVEL PARTY                         */}
          {/* ============================================================== */}
          {currentStep === 4 && (
            <div className="wizard-step-enter" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              <div>
                <h2 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)', fontWeight: '800', marginBottom: '0.6rem' }}>
                  Set your pace, budget & travel party
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.65' }}>
                  Tailor the intensity of your days, lodging comfort tier, and your target trip budget.
                </p>
              </div>

              {/* 1. Daily Pace Section */}
              <div>
                <label style={{ fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Zap size={18} style={{ color: 'var(--accent-matcha)' }} />
                  <span>1. Daily Pace & Intensity</span>
                </label>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                  gap: '1rem',
                }}>
                  {PACE_OPTIONS.map((opt) => {
                    const isSelected = pace === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setPace(opt.id)}
                        className="glass-card interactive-hover"
                        style={{
                          padding: '1.25rem',
                          cursor: 'pointer',
                          borderRadius: '14px',
                          border: '2px solid',
                          borderColor: isSelected ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                          backgroundColor: isSelected ? 'rgba(230, 57, 70, 0.12)' : 'var(--bg-surface-elevated)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span style={{ fontWeight: '800', fontSize: '1rem', color: isSelected ? 'var(--accent-crimson)' : 'var(--text-primary)' }}>
                            {opt.title}
                          </span>
                          <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>
                            {opt.spotsPerDay}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                          {opt.subtitle}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Target Total Trip Budget Input */}
              <div style={{
                padding: '1.5rem',
                borderRadius: '16px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Wallet size={18} style={{ color: 'var(--accent-gold)' }} />
                    <span>2. Target Total Trip Budget (Optional Target)</span>
                  </label>

                  {/* Currency Toggle */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-primary)',
                    padding: '0.25rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    <button
                      type="button"
                      onClick={() => handleToggleBudgetCurrency('USD')}
                      style={{
                        padding: '0.35rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: budgetCurrency === 'USD' ? '800' : '600',
                        backgroundColor: budgetCurrency === 'USD' ? 'var(--accent-crimson)' : 'transparent',
                        color: budgetCurrency === 'USD' ? '#fff' : 'var(--text-secondary)',
                      }}
                    >
                      $ USD
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleBudgetCurrency('JPY')}
                      style={{
                        padding: '0.35rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: budgetCurrency === 'JPY' ? '800' : '600',
                        backgroundColor: budgetCurrency === 'JPY' ? 'var(--accent-crimson)' : 'transparent',
                        color: budgetCurrency === 'JPY' ? '#fff' : 'var(--text-secondary)',
                      }}
                    >
                      ¥ JPY
                    </button>
                  </div>
                </div>

                {/* Quick Budget Tier Presets */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                  gap: '0.85rem',
                  marginBottom: '1.25rem',
                }}>
                  {budgetPresets.map((preset) => {
                    const isSelected = budget === preset.tierId;
                    const priceLabel = budgetCurrency === 'USD' 
                      ? `$${preset.usd.toLocaleString()}` 
                      : `¥${preset.jpy.toLocaleString()}`;
                    const secondaryPrice = budgetCurrency === 'USD'
                      ? `~¥${preset.jpy.toLocaleString()}`
                      : `~$${preset.usd.toLocaleString()} USD`;

                    return (
                      <div
                        key={preset.tierId}
                        onClick={() => handleSelectBudgetPreset(preset)}
                        className="glass-card interactive-hover"
                        style={{
                          padding: '1rem',
                          cursor: 'pointer',
                          borderRadius: '12px',
                          border: '2px solid',
                          borderColor: isSelected ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                          backgroundColor: isSelected ? 'rgba(230, 57, 70, 0.12)' : 'var(--bg-primary)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: '800', fontSize: '0.95rem', color: isSelected ? 'var(--accent-crimson)' : 'var(--text-primary)' }}>
                            {preset.name}
                          </span>
                          <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--accent-gold)' }}>
                            {priceLabel}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                          {secondaryPrice}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {preset.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Number Input Field */}
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                    Or enter your exact custom target budget for all {travelers} travelers:
                  </label>
                  <div style={{ position: 'relative', maxWidth: '320px' }}>
                    <div style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontWeight: '800',
                      color: 'var(--accent-gold)',
                      fontSize: '1.1rem',
                    }}>
                      {budgetCurrency === 'USD' ? '$' : '¥'}
                    </div>
                    <input
                      type="number"
                      placeholder={budgetCurrency === 'USD' ? 'e.g. 3000' : 'e.g. 450000'}
                      value={customBudgetValue}
                      onChange={(e) => handleCustomBudgetChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.4rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        fontWeight: '700',
                        outline: 'none',
                      }}
                    />
                  </div>
                  {targetBudget && targetBudget > 0 && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                      Active Target: <strong>{formatDualPrice(targetBudget, budgetCurrency).full}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Travel Party Size Section */}
              <div>
                <label style={{ fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Users size={18} style={{ color: 'var(--accent-indigo)' }} />
                  <span>3. Who are you traveling with?</span>
                </label>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {[
                    { num: 1, label: 'Solo Adventurer' },
                    { num: 2, label: 'Couple (2)' },
                    { num: 3, label: 'Small Group (3)' },
                    { num: 4, label: 'Family / Friends (4)' },
                    { num: 6, label: 'Large Group (6+)' }
                  ].map((item) => (
                    <button
                      key={item.num}
                      type="button"
                      onClick={() => setTravelers(item.num)}
                      style={{
                        padding: '0.65rem 1.25rem',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        fontWeight: travelers === item.num ? '800' : '600',
                        border: '1px solid',
                        borderColor: travelers === item.num ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                        backgroundColor: travelers === item.num ? 'var(--accent-crimson)' : 'var(--bg-surface-elevated)',
                        color: travelers === item.num ? '#ffffff' : 'var(--text-secondary)',
                        boxShadow: travelers === item.num ? '0 4px 15px rgba(230, 57, 70, 0.4)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* BOTTOM STEP CONTROLS (Back & Next / Generate)                  */}
          {/* ============================================================== */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '2.5rem',
            marginTop: '2.5rem',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            {/* Back Button */}
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="btn-secondary"
                style={{ padding: '0.85rem 1.6rem', fontSize: '0.95rem' }}
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
            ) : (
              <div /> /* Spacer */
            )}

            {/* Next / Submit Button */}
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
                style={{ padding: '0.85rem 2rem', fontSize: '0.98rem' }}
              >
                <span>Next: {stepsMeta[currentStep].title}</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={onGenerateItinerary}
                className="btn-primary"
                style={{
                  padding: '1rem 2.4rem',
                  fontSize: '1.05rem',
                  background: 'linear-gradient(135deg, #e63946, #c1121f, #f4a261)',
                  boxShadow: '0 6px 25px rgba(230, 57, 70, 0.55)',
                }}
              >
                <Sparkles size={20} />
                <span>Generate Smart Japan Itinerary</span>
              </button>
            )}
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .hide-on-mobile {
            display: none !important;
          }
        }
        @media (max-width: 580px) {
          .tick-label-full {
            display: none !important;
          }
          .tick-label-short {
            display: inline !important;
          }
        }
        @media (min-width: 581px) {
          .tick-label-full {
            display: inline !important;
          }
          .tick-label-short {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
