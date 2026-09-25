import React, { useState } from 'react';
import { 
  Calendar, Train, Clock, MapPin, DollarSign, Lightbulb, 
  CheckCircle, Bookmark, ExternalLink, ChevronDown, ChevronUp, Sparkles, AlertCircle 
} from 'lucide-react';

export default function ItineraryView({ itinerary, currency, onViewCityOnMap }) {
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');
  const [expandedDays, setExpandedDays] = useState({});
  const [completedActivities, setCompletedActivities] = useState({});

  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return null;
  }

  const toggleDayExpand = (dayNum) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayNum]: prev[dayNum] === undefined ? false : !prev[dayNum]
    }));
  };

  const toggleActivityComplete = (actKey) => {
    setCompletedActivities(prev => ({
      ...prev,
      [actKey]: !prev[actKey]
    }));
  };

  const filteredDays = selectedDayFilter === 'all' 
    ? itinerary.days 
    : itinerary.days.filter(d => d.dayNumber === Number(selectedDayFilter));

  const formatCost = (costJPY) => {
    if (currency === 'USD') {
      return `$${Math.round(costJPY / 149)}`;
    }
    return `¥${costJPY.toLocaleString()}`;
  };

  return (
    <section id="itinerary-section" style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container">
        
        {/* Section Heading */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div>
            <div className="badge badge-crimson" style={{ marginBottom: '0.5rem' }}>
              Your Tailored Schedule
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '0.3rem' }}>
              {itinerary.summary.durationDays}-Day Japan Itinerary
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Spanning {itinerary.summary.uniqueCities.join(' → ')} • {itinerary.summary.pace.toUpperCase()} Pace
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'var(--bg-surface-elevated)',
            padding: '0.6rem 1.2rem',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Est. Total Trip
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
                {currency === 'USD' ? `$${itinerary.summary.grandTotalUSD.toLocaleString()}` : `¥${itinerary.summary.grandTotalJPY.toLocaleString()}`}
              </div>
            </div>
            <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Per Person / Day
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {currency === 'USD' ? `$${itinerary.summary.dailyAverageUSD}` : `¥${itinerary.summary.dailyAverageJPY.toLocaleString()}`}
              </div>
            </div>
          </div>
        </div>

        {/* Day Selector Pills */}
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '0.5rem',
          paddingBottom: '1rem',
          marginBottom: '2rem',
        }}>
          <button
            onClick={() => setSelectedDayFilter('all')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: selectedDayFilter === 'all' ? '700' : '500',
              border: '1px solid',
              borderColor: selectedDayFilter === 'all' ? 'var(--accent-crimson)' : 'var(--border-subtle)',
              backgroundColor: selectedDayFilter === 'all' ? 'var(--accent-crimson)' : 'var(--bg-surface-elevated)',
              color: selectedDayFilter === 'all' ? '#fff' : 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >
            All Days ({itinerary.days.length})
          </button>
          
          {itinerary.days.map(d => (
            <button
              key={d.dayNumber}
              onClick={() => setSelectedDayFilter(String(d.dayNumber))}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: selectedDayFilter === String(d.dayNumber) ? '700' : '500',
                border: '1px solid',
                borderColor: selectedDayFilter === String(d.dayNumber) ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                backgroundColor: selectedDayFilter === String(d.dayNumber) ? 'var(--accent-crimson)' : 'var(--bg-surface-elevated)',
                color: selectedDayFilter === String(d.dayNumber) ? '#fff' : 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              Day {d.dayNumber}: {d.cityName}
            </button>
          ))}
        </div>

        {/* Days List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {filteredDays.map(day => {
            const isCollapsed = expandedDays[day.dayNumber] === false;

            return (
              <div 
                key={day.dayNumber} 
                className="glass-card" 
                style={{
                  padding: '0',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {/* Day Header Banner */}
                <div style={{
                  position: 'relative',
                  padding: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'linear-gradient(to right, rgba(22, 29, 44, 0.95), rgba(30, 39, 58, 0.7))',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #e63946, #c1121f)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: '0 4px 15px rgba(230, 57, 70, 0.35)',
                      flexShrink: 0,
                    }}>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: '700' }}>Day</span>
                      <span style={{ fontSize: '1.4rem', fontWeight: '800', lineHeight: 1 }}>{day.dayNumber}</span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                          {day.cityName}
                        </h3>
                        <span className="kanji-text" style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', opacity: 0.9 }}>
                          {day.cityKanji}
                        </span>
                        <span className="badge badge-matcha" style={{ fontSize: '0.7rem' }}>
                          {day.region}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {day.tagline}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* View on Map Button */}
                    <button
                      onClick={() => onViewCityOnMap(day.cityKey)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.8rem',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        color: 'var(--accent-indigo)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <MapPin size={14} />
                      <span>View on Map</span>
                    </button>

                    {/* Expand/Collapse Toggle */}
                    <button
                      onClick={() => toggleDayExpand(day.dayNumber)}
                      style={{
                        padding: '0.4rem',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        color: 'var(--text-secondary)',
                      }}
                      title={isCollapsed ? 'Expand Day' : 'Collapse Day'}
                    >
                      {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </button>
                  </div>
                </div>

                {!isCollapsed && (
                  <div style={{ padding: '1.5rem' }}>
                    
                    {/* Intercity Transit Hop Banner (If Any) */}
                    {day.transitHop && (
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(0, 119, 182, 0.15), rgba(58, 134, 255, 0.08))',
                        border: '1px solid rgba(58, 134, 255, 0.3)',
                        borderRadius: '12px',
                        padding: '1rem 1.25rem',
                        marginBottom: '1.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(58, 134, 255, 0.25)',
                              color: '#3a86ff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <Train size={18} />
                            </div>
                            <div>
                              <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#60a5fa' }}>
                                Transit Hop: {day.transitHop.mode}
                              </span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                                ({day.transitHop.type})
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Clock size={14} /> {day.transitHop.duration}
                            </span>
                            <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
                              {formatCost(day.transitHop.priceJPY)}
                            </span>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '2.6rem' }}>
                          💡 <strong>Travel Tip:</strong> {day.transitHop.tip}
                        </div>
                      </div>
                    )}

                    {/* Activities List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {day.activities.map((act, idx) => {
                        const actKey = `${day.dayNumber}-${idx}`;
                        const isDone = completedActivities[actKey];

                        return (
                          <div
                            key={idx}
                            style={{
                              padding: '1.2rem',
                              borderRadius: '12px',
                              backgroundColor: isDone ? 'rgba(42, 157, 143, 0.08)' : 'var(--bg-surface-elevated)',
                              border: '1px solid',
                              borderColor: isDone ? 'rgba(42, 157, 143, 0.4)' : 'var(--border-subtle)',
                              transition: 'all 0.25s ease',
                              display: 'flex',
                              gap: '1rem',
                            }}
                          >
                            {/* Checkmark Button */}
                            <button
                              onClick={() => toggleActivityComplete(actKey)}
                              style={{
                                color: isDone ? 'var(--accent-matcha)' : 'var(--text-muted)',
                                marginTop: '0.2rem',
                                flexShrink: 0,
                              }}
                              title={isDone ? 'Mark as pending' : 'Mark as completed'}
                            >
                              <CheckCircle size={22} fill={isDone ? 'var(--accent-matcha)' : 'none'} color={isDone ? '#fff' : 'currentColor'} />
                            </button>

                            <div style={{ flex: 1 }}>
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                                marginBottom: '0.35rem',
                              }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span className="badge badge-crimson" style={{ fontSize: '0.68rem' }}>
                                      {act.timeSlot.toUpperCase()}
                                    </span>
                                    <h4 style={{
                                      fontSize: '1.1rem',
                                      fontWeight: '700',
                                      textDecoration: isDone ? 'line-through' : 'none',
                                      color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                                    }}>
                                      {act.name}
                                    </h4>
                                    <span className="kanji-text" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                      {act.kanji}
                                    </span>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Clock size={13} /> {act.duration}
                                  </span>
                                  <span style={{
                                    fontSize: '0.85rem',
                                    fontWeight: '700',
                                    color: act.cost === 0 ? 'var(--accent-matcha)' : 'var(--accent-gold)',
                                  }}>
                                    {act.cost === 0 ? 'FREE' : formatCost(act.cost)}
                                  </span>
                                </div>
                              </div>

                              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.6rem' }}>
                                {act.description}
                              </p>

                              {act.tip && (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  fontSize: '0.8rem',
                                  color: 'var(--accent-gold)',
                                  backgroundColor: 'rgba(244, 162, 97, 0.08)',
                                  padding: '0.4rem 0.75rem',
                                  borderRadius: '8px',
                                  width: 'fit-content',
                                }}>
                                  <Lightbulb size={14} />
                                  <span>{act.tip}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Daily Footer: Daily Cost Summary & Insider Etiquette Tip */}
                    <div style={{
                      marginTop: '1.5rem',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      fontSize: '0.82rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <Sparkles size={14} style={{ color: 'var(--accent-crimson)' }} />
                        <span><strong>Day Tip:</strong> {day.insiderTip}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
                        <span>Hotel: <strong>{formatCost(day.estimatedDailyCost.hotelJPY)}</strong></span>
                        <span>Food: <strong>{formatCost(day.estimatedDailyCost.foodJPY)}</strong></span>
                        <span>Transit: <strong>{formatCost(day.estimatedDailyCost.transitJPY)}</strong></span>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
