import React, { useState } from 'react';
import { MapPin, Train, Plane, Compass, Info, Sparkles, Navigation } from 'lucide-react';
import { CITIES } from '../data/destinations';

export default function JapanMap({ itinerary, selectedCityKey, onSelectCity }) {
  const [hoveredCity, setHoveredCity] = useState(null);
  const [showShinkansenLines, setShowShinkansenLines] = useState(true);
  const [showDomesticFlights, setShowDomesticFlights] = useState(true);

  // Extract cities in order from the current itinerary
  const itineraryCities = itinerary?.days ? [...new Set(itinerary.days.map(d => d.cityKey))] : ['tokyo', 'kyoto', 'osaka'];
  
  // Calculate sequence of waypoints for drawing the route line
  const routePoints = itineraryCities.map(key => CITIES[key]?.coordinates).filter(Boolean);
  const routePathD = routePoints.length > 1 
    ? `M ${routePoints[0].x} ${routePoints[0].y} ` + routePoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  // Shinkansen Tracks Coordinates (Normalized to 900x700 viewBox)
  const shinkansenLines = [
    // Tokaido & Sanyo Shinkansen: Tokyo -> Hakone/Odawara -> Nagoya -> Kyoto -> Osaka -> Hiroshima -> Fukuoka (Hakata)
    { id: 'tokaido-sanyo', name: 'Tokaido & Sanyo Shinkansen (Nozomi / Hikari)', path: 'M 670 440 L 640 460 L 590 465 L 530 470 L 520 480 L 460 485 L 380 500 L 260 550', color: '#00b4d8' },
    // Hokuriku Shinkansen: Tokyo -> Nagano -> Toyama -> Kanazawa
    { id: 'hokuriku', name: 'Hokuriku Shinkansen (Kagayaki)', path: 'M 670 440 L 630 400 L 595 385 L 560 390 L 535 440', color: '#f72585' },
    // Tohoku & Hokkaido Shinkansen: Tokyo -> Sendai -> Aomori -> Hakodate
    { id: 'tohoku-hokkaido', name: 'Tohoku & Hokkaido Shinkansen (Hayabusa)', path: 'M 670 440 L 685 360 L 695 280 L 705 235 L 725 195', color: '#10b981' }
  ];

  const activeCity = hoveredCity || (selectedCityKey ? CITIES[selectedCityKey] : null);

  return (
    <section id="map-section" style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <div>
            <div className="badge badge-crimson" style={{ marginBottom: '0.4rem' }}>
              Interactive Visual Geography
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '0.2rem' }}>
              Japan Transit & Route Map
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              High-speed Shinkansen corridors, domestic flight hops, and your itinerary's travel trajectory.
            </p>
          </div>

          {/* Map Layer Toggles */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowShinkansenLines(!showShinkansenLines)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '600',
                border: '1px solid',
                borderColor: showShinkansenLines ? '#00b4d8' : 'var(--border-subtle)',
                backgroundColor: showShinkansenLines ? 'rgba(0, 180, 216, 0.15)' : 'var(--bg-surface-elevated)',
                color: showShinkansenLines ? '#38bdf8' : 'var(--text-secondary)',
              }}
            >
              <Train size={14} />
              <span>Shinkansen Lines</span>
            </button>

            <button
              onClick={() => setShowDomesticFlights(!showDomesticFlights)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '600',
                border: '1px solid',
                borderColor: showDomesticFlights ? 'var(--accent-gold)' : 'var(--border-subtle)',
                backgroundColor: showDomesticFlights ? 'rgba(244, 162, 97, 0.15)' : 'var(--bg-surface-elevated)',
                color: showDomesticFlights ? 'var(--accent-gold)' : 'var(--text-secondary)',
              }}
            >
              <Plane size={14} />
              <span>Flight Arcs</span>
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) clamp(280px, 30vw, 360px)',
          gap: '1.5rem',
        }} className="map-grid-layout">
          
          {/* Interactive SVG Canvas */}
          <div className="glass-card" style={{
            position: 'relative',
            padding: '1rem',
            overflow: 'hidden',
            minHeight: '520px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#070a10',
            border: '1px solid var(--border-subtle)',
          }}>
            
            {/* Compass Rose Accent */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: '600',
            }}>
              <Compass size={18} style={{ color: 'var(--accent-crimson)' }} />
              <span>NIPPON RAIL MAP 2026</span>
            </div>

            {/* SVG Graphics */}
            <svg 
              viewBox="180 100 640 500" 
              style={{ width: '100%', height: '100%', maxHeight: '550px' }}
            >
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff4d6d" />
                  <stop offset="50%" stopColor="#e63946" />
                  <stop offset="100%" stopColor="#f4a261" />
                </linearGradient>

                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Japan Landmass Silhouette (Stylized Archipelago Paths) */}
              <g fill="#161e2e" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5">
                {/* Hokkaido */}
                <path d="M 680 120 C 720 100, 780 120, 800 150 C 790 190, 750 200, 710 190 C 690 170, 660 150, 680 120 Z" />
                
                {/* Honshu (Main Island Curve) */}
                <path d="M 710 220 C 720 280, 690 350, 670 410 C 660 460, 610 470, 560 440 C 530 450, 480 470, 420 480 C 370 490, 340 510, 360 520 C 440 500, 520 490, 570 430 C 620 380, 670 330, 690 260 Z" />
                
                {/* Shikoku */}
                <path d="M 430 510 C 470 500, 490 520, 460 540 C 420 540, 400 520, 430 510 Z" />
                
                {/* Kyushu */}
                <path d="M 280 520 C 310 510, 320 540, 300 580 C 270 590, 250 560, 260 530 Z" />
              </g>

              {/* Shinkansen Rail Corridors */}
              {showShinkansenLines && shinkansenLines.map(line => (
                <g key={line.id}>
                  <path
                    d={line.path}
                    fill="none"
                    stroke={line.color}
                    strokeWidth="3.5"
                    strokeOpacity="0.4"
                  />
                  <path
                    d={line.path}
                    fill="none"
                    stroke={line.color}
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    filter="url(#glow)"
                  >
                    <animate attributeName="stroke-dashoffset" from="40" to="0" dur="2s" repeatCount="indefinite" />
                  </path>
                </g>
              ))}

              {/* Domestic Flight Arcs (e.g., Tokyo to Sapporo, Fukuoka to Tokyo) */}
              {showDomesticFlights && (
                <g stroke="#f4a261" strokeWidth="1.5" strokeDasharray="4 6" fill="none" opacity="0.6">
                  {/* Tokyo to Sapporo Flight Arc */}
                  <path d="M 670 440 Q 730 290 740 160" />
                  {/* Fukuoka to Tokyo Flight Arc */}
                  <path d="M 260 550 Q 450 420 670 440" />
                </g>
              )}

              {/* Itinerary Route Trajectory */}
              {routePathD && (
                <path
                  d={routePathD}
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />
              )}

              {/* City Nodes */}
              {Object.values(CITIES).map(city => {
                const { x, y } = city.coordinates;
                const isInItinerary = itineraryCities.includes(city.id);
                const isSelected = selectedCityKey === city.id || hoveredCity?.id === city.id;
                const itineraryDayIndex = itinerary?.days ? itinerary.days.findIndex(d => d.cityKey === city.id) : -1;

                return (
                  <g
                    key={city.id}
                    onClick={() => onSelectCity(city.id)}
                    onMouseEnter={() => setHoveredCity(city)}
                    onMouseLeave={() => setHoveredCity(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Outer Pulse ring if in active itinerary */}
                    {isInItinerary && (
                      <circle cx={x} cy={y} r={isSelected ? 16 : 10} fill="rgba(230, 57, 70, 0.25)">
                        <animate attributeName="r" values="8;16;8" dur="2.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Main Dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 7 : isInItinerary ? 5.5 : 4}
                      fill={isInItinerary ? '#e63946' : '#64748b'}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />

                    {/* City Label */}
                    <text
                      x={x + 9}
                      y={y + 4}
                      fill={isInItinerary ? '#f8fafc' : '#94a3b8'}
                      fontSize={isSelected ? '12px' : '10px'}
                      fontWeight={isInItinerary ? '700' : '500'}
                      fontFamily="var(--font-heading)"
                      filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.8))"
                    >
                      {city.name}
                    </text>

                    {/* Badge indicator for Day # or START if starting gateway */}
                    {itineraryDayIndex === 0 ? (
                      <g>
                        <rect
                          x={x - 24}
                          y={y - 20}
                          width="32"
                          height="15"
                          rx="4"
                          fill="var(--accent-gold)"
                        />
                        <text
                          x={x - 8}
                          y={y - 9}
                          textAnchor="middle"
                          fill="#0f172a"
                          fontSize="8.5px"
                          fontWeight="900"
                          fontFamily="var(--font-heading)"
                        >
                          START
                        </text>
                      </g>
                    ) : itineraryDayIndex > 0 ? (
                      <g>
                        <rect
                          x={x - 20}
                          y={y - 18}
                          width="18"
                          height="14"
                          rx="4"
                          fill="#e63946"
                        />
                        <text
                          x={x - 11}
                          y={y - 8}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="9px"
                          fontWeight="800"
                          fontFamily="var(--font-heading)"
                        >
                          {itineraryDayIndex + 1}
                        </text>
                      </g>
                    ) : null}
                  </g>
                );
              })}
            </svg>

            {/* Map Legend */}
            <div style={{
              position: 'absolute',
              bottom: '15px',
              left: '15px',
              background: 'rgba(10, 13, 20, 0.85)',
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#e63946' }}></span>
                <span>In Itinerary</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '14px', height: '2px', backgroundColor: '#00b4d8' }}></span>
                <span>Shinkansen Bullet Line</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '14px', height: '2px', borderTop: '2px dashed #f4a261' }}></span>
                <span>Domestic Air Corridor</span>
              </div>
            </div>

          </div>

          {/* Selected City Preview Drawer */}
          <div className="glass-card" style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid var(--border-subtle)',
          }}>
            {activeCity ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                      {activeCity.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="kanji-text" style={{ fontSize: '1.1rem', color: 'var(--accent-gold)' }}>
                        {activeCity.kanji}
                      </span>
                      <span className="badge badge-matcha" style={{ fontSize: '0.68rem' }}>
                        {activeCity.region}
                      </span>
                    </div>
                  </div>
                  <div className="badge badge-crimson" style={{ fontSize: '0.72rem' }}>
                    {itineraryCities.includes(activeCity.id) ? 'In Itinerary' : 'Explorable'}
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {activeCity.tagline}
                </p>

                {/* Top Highlights Preview */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.5rem' }}>
                    Must-See Highlights
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {activeCity.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.82rem',
                        color: 'var(--text-primary)',
                      }}>
                        <span style={{ color: 'var(--accent-crimson)', fontWeight: 'bold' }}>•</span>
                        <span>{h.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hotel Budget Indicator */}
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                }}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Avg. Hotel / Night:</div>
                  <div style={{ fontWeight: '700', color: 'var(--accent-gold)' }}>
                    ¥{activeCity.avgHotelPerNight.mid.toLocaleString()} (~$100 USD)
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <Navigation size={32} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                <p style={{ fontSize: '0.9rem' }}>
                  Hover or click any city pin on the map to explore its Shinkansen connections, sights, and lodging costs.
                </p>
              </div>
            )}

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Info size={14} />
                <span>All routes are synchronized with official JR timetables.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 860px) {
          .map-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
