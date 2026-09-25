import React from 'react';
import { 
  Landmark, Utensils, Gamepad2, Mountain, Sparkles, Building2, Brush, Wine, 
  Clock, MapPin, Users, Check, ChevronRight, Zap
} from 'lucide-react';
import { INTEREST_CATEGORIES, PACE_OPTIONS, BUDGET_TIERS } from '../data/interests';

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
  onGenerateItinerary
}) {
  const toggleInterest = (id) => {
    if (interests.includes(id)) {
      if (interests.length > 1) {
        setInterests(interests.filter(item => item !== id));
      }
    } else {
      setInterests([...interests, id]);
    }
  };

  const cities = [
    { id: 'tokyo', name: 'Tokyo', sub: 'Narita / Haneda (NRT/HND)', kanji: '東京' },
    { id: 'osaka', name: 'Osaka', sub: 'Kansai Airport (KIX)', kanji: '大阪' },
    { id: 'kyoto', name: 'Kyoto', sub: 'Historical Heartland', kanji: '京都' },
    { id: 'fukuoka', name: 'Fukuoka', sub: 'Kyushu Gateway (FUK)', kanji: '福岡' },
    { id: 'hokkaido', name: 'Sapporo', sub: 'New Chitose (CTS)', kanji: '札幌' }
  ];

  return (
    <section id="planner-wizard" style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container">
        <div className="glass-card" style={{
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
        }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="badge badge-crimson" style={{ marginBottom: '0.6rem' }}>
              Step-by-Step Customization
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', marginBottom: '0.5rem' }}>
              Tell Us About Your Trip
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
              We'll calculate realistic transit times, day-by-day itineraries, Shinkansen hops, and precise budget estimates.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

            {/* 1. Trip Duration */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <label style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={20} style={{ color: 'var(--accent-crimson)' }} />
                  <span>1. How long will you be in Japan?</span>
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.4rem',
                  background: 'var(--bg-surface-elevated)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-crimson)' }}>
                    {duration}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    Days ({duration - 1} Nights)
                  </span>
                </div>
              </div>

              {/* Slider */}
              <div style={{ marginBottom: '1.25rem', padding: '0 0.5rem' }}>
                <input
                  type="range"
                  min="3"
                  max="30"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    accentColor: 'var(--accent-crimson)',
                    cursor: 'pointer',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  <span>3 Days (Weekend)</span>
                  <span>7 Days (1 Week)</span>
                  <span>14 Days (2 Weeks)</span>
                  <span>21 Days (3 Weeks)</span>
                  <span>30 Days (1 Month)</span>
                </div>
              </div>

              {/* Quick Duration Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[
                  { d: 4, label: '3-4 Days (Express)' },
                  { d: 7, label: '7 Days (1 Week)' },
                  { d: 10, label: '10 Days' },
                  { d: 14, label: '14 Days (2 Weeks)' },
                  { d: 21, label: '21 Days (3 Weeks)' },
                  { d: 28, label: '28 Days (1 Month)' }
                ].map(item => (
                  <button
                    key={item.d}
                    type="button"
                    onClick={() => setDuration(item.d)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: duration === item.d ? '700' : '500',
                      border: '1px solid',
                      borderColor: duration === item.d ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                      backgroundColor: duration === item.d ? 'rgba(230, 57, 70, 0.15)' : 'var(--bg-surface-elevated)',
                      color: duration === item.d ? '#ff4d6d' : 'var(--text-secondary)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Starting City */}
            <div>
              <label style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <MapPin size={20} style={{ color: 'var(--accent-gold)' }} />
                <span>2. Where will you start your journey?</span>
              </label>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem',
              }}>
                {cities.map(city => {
                  const isSelected = startingCity === city.id;
                  return (
                    <div
                      key={city.id}
                      onClick={() => setStartingCity(city.id)}
                      className="glass-card"
                      style={{
                        padding: '1rem',
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                        backgroundColor: isSelected ? 'rgba(230, 57, 70, 0.12)' : 'var(--bg-surface-elevated)',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <div style={{ fontWeight: '700', fontSize: '1.05rem', color: isSelected ? '#ff4d6d' : 'var(--text-primary)' }}>
                          {city.name}
                        </div>
                        <span className="kanji-text" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {city.kanji}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {city.sub}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Interests & Hobbies */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <label style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={20} style={{ color: 'var(--accent-sakura)' }} />
                  <span>3. What activities and hobbies interest you?</span>
                </label>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Selected ({interests.length} of {INTEREST_CATEGORIES.length})
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '0.85rem',
              }}>
                {INTEREST_CATEGORIES.map(category => {
                  const Icon = iconMap[category.icon] || Sparkles;
                  const isSelected = interests.includes(category.id);
                  return (
                    <div
                      key={category.id}
                      onClick={() => toggleInterest(category.id)}
                      className="glass-card interactive-hover"
                      style={{
                        padding: '1.1rem',
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: isSelected ? category.color : 'var(--border-subtle)',
                        backgroundColor: isSelected ? `${category.color}15` : 'var(--bg-surface-elevated)',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                      }}
                    >
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: category.color,
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: `${category.color}25`,
                          color: category.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                            {category.title}
                          </div>
                          <div className="kanji-text" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {category.kanji}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {category.subtitle}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Travel Pace & Budget Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.75rem',
            }}>
              
              {/* Pace Selection */}
              <div>
                <label style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Zap size={20} style={{ color: 'var(--accent-matcha)' }} />
                  <span>4. Travel Pace</span>
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {PACE_OPTIONS.map(opt => {
                    const isSelected = pace === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setPace(opt.id)}
                        className="glass-card"
                        style={{
                          padding: '0.95rem 1.1rem',
                          cursor: 'pointer',
                          border: '1px solid',
                          borderColor: isSelected ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                          backgroundColor: isSelected ? 'rgba(230, 57, 70, 0.1)' : 'var(--bg-surface-elevated)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.95rem', color: isSelected ? '#ff4d6d' : 'var(--text-primary)' }}>
                            {opt.title}
                          </span>
                          <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                            {opt.spotsPerDay}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {opt.subtitle}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Budget Tier Selection */}
              <div>
                <label style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Users size={20} style={{ color: 'var(--accent-indigo)' }} />
                  <span>5. Travel Style & Budget</span>
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {BUDGET_TIERS.map(tier => {
                    const isSelected = budget === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setBudget(tier.id)}
                        className="glass-card"
                        style={{
                          padding: '0.95rem 1.1rem',
                          cursor: 'pointer',
                          border: '1px solid',
                          borderColor: isSelected ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                          backgroundColor: isSelected ? 'rgba(230, 57, 70, 0.1)' : 'var(--bg-surface-elevated)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.95rem', color: isSelected ? '#ff4d6d' : 'var(--text-primary)' }}>
                            {tier.title}
                          </span>
                          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-gold)' }}>
                            ~¥{tier.dailyJPY.toLocaleString()}/day
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {tier.sub}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Travelers Count */}
            <div>
              <label style={{ fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span>Travelers in your party:</span>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {[1, 2, 3, 4, 6].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTravelers(num)}
                    style={{
                      padding: '0.5rem 1.2rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: travelers === num ? '700' : '500',
                      border: '1px solid',
                      borderColor: travelers === num ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                      backgroundColor: travelers === num ? 'var(--accent-crimson)' : 'var(--bg-surface-elevated)',
                      color: travelers === num ? '#ffffff' : 'var(--text-primary)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {num === 1 ? 'Solo (1)' : num === 2 ? 'Couple (2)' : `${num} People`}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Itinerary Button */}
            <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={onGenerateItinerary}
                className="btn-primary"
                style={{
                  fontSize: '1.15rem',
                  padding: '1.1rem 2.8rem',
                  borderRadius: '12px',
                  width: '100%',
                  maxWidth: '480px',
                }}
              >
                <Sparkles size={22} />
                <span>Generate Smart Japan Itinerary</span>
              </button>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                Generates day-by-day stops, bullet train connections, route map & estimated cost analysis
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
