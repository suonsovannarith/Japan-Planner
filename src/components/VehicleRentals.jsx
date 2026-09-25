import React, { useState } from 'react';
import { 
  Car, ShieldCheck, CreditCard, Compass, Navigation, Fuel, AlertTriangle, 
  ExternalLink, CheckCircle2, Users, Briefcase, Sparkles, MapPin, ChevronRight, Phone
} from 'lucide-react';
import { RENTAL_AGENCIES, VEHICLE_CLASSES, DRIVING_GUIDE_RULES, ROAD_TRIP_RECOMMENDATIONS } from '../data/rentalData';
import { formatDualPrice } from '../data/currency';

export default function VehicleRentals({ currency = 'USD', selectedAirport = 'HND' }) {
  const [selectedHub, setSelectedHub] = useState(selectedAirport);
  const [selectedClass, setSelectedClass] = useState('compact');
  const [activeGuideTab, setActiveGuideTab] = useState('idp');

  const hubs = [
    { id: 'all', label: 'All Japan Gateways' },
    { id: 'HND', label: 'Tokyo Haneda (HND)' },
    { id: 'NRT', label: 'Tokyo Narita (NRT)' },
    { id: 'KIX', label: 'Osaka Kansai (KIX)' },
    { id: 'CTS', label: 'Sapporo Chitose (CTS)' },
    { id: 'FUK', label: 'Fukuoka Airport (FUK)' },
  ];

  return (
    <section id="rentals-section" style={{ padding: '2rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '1180px' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-crimson" style={{ marginBottom: '0.6rem' }}>
            Road Trips & Self-Driving Japan
          </div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.7rem)', fontWeight: '800', marginBottom: '0.6rem' }}>
            Tourist Car & Vehicle Rental Finder
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
            Discover verified Japanese car rental agencies, compare vehicle classes with transparent daily rates, and master the essential rules of driving on the left.
          </p>
        </div>

        {/* Essential Tourist Driving Alert Bar */}
        <div className="glass-card" style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2.5rem',
          borderRadius: '16px',
          border: '1px solid rgba(230, 57, 70, 0.35)',
          background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.12), rgba(244, 162, 97, 0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(230, 57, 70, 0.25)',
              color: 'var(--accent-crimson)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-crimson" style={{ fontSize: '0.7rem' }}>
                  Mandatory Legal Requirement
                </span>
                <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Physical 1949 Geneva Convention IDP Required
                </span>
              </div>
              <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                You must obtain a physical International Driving Permit in your home country before departure. Digital permits are NOT accepted by Japanese law.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <span className="badge badge-matcha" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={12} /> ETC Toll Card Rental
            </span>
            <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={12} /> English GPS / CarPlay
            </span>
          </div>
        </div>

        {/* Airport / City Hub Filter */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                Vehicle Class Deals & Rates
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Average daily rates including unlimited mileage and standard insurance
              </p>
            </div>

            {/* Hub Selector Pills */}
            <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingBottom: '4px' }}>
              {hubs.map(hub => {
                const isActive = selectedHub === hub.id;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => setSelectedHub(hub.id)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: isActive ? '800' : '500',
                      backgroundColor: isActive ? 'var(--accent-crimson)' : 'var(--bg-surface-elevated)',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {hub.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vehicle Comparison Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 265px), 1fr))',
            gap: '1.25rem',
          }}>
            {VEHICLE_CLASSES.map(vClass => {
              const isSelected = selectedClass === vClass.id;
              const priceDual = formatDualPrice(vClass.dailyPriceJPY, currency);

              return (
                <div
                  key={vClass.id}
                  onClick={() => setSelectedClass(vClass.id)}
                  className="glass-card interactive-hover"
                  style={{
                    padding: '1.5rem',
                    borderRadius: '18px',
                    border: '2px solid',
                    borderColor: isSelected ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                    backgroundColor: isSelected ? 'rgba(230, 57, 70, 0.08)' : 'var(--bg-surface-elevated)',
                    boxShadow: isSelected ? '0 10px 30px rgba(230, 57, 70, 0.2)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <div>
                    {/* Top Class Name & Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                        {vClass.badge}
                      </span>
                      {isSelected && (
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-crimson)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </div>

                    <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.35rem' }}>
                      {vClass.name}
                    </h4>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      <strong>Examples:</strong> {vClass.sampleModels}
                    </div>

                    {/* Capacity & Fuel Economy Strip */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      fontSize: '0.8rem',
                      marginBottom: '1rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
                        <Users size={14} style={{ color: '#60a5fa' }} />
                        <span>{vClass.passengers} Seats</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
                        <Briefcase size={14} style={{ color: '#f59e0b' }} />
                        <span>{vClass.luggage}</span>
                      </div>
                    </div>

                    {/* Feature bullet points */}
                    <ul style={{ paddingLeft: '1.1rem', margin: '0 0 1.25rem 0', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {vClass.features.map((feat, fIdx) => (
                        <li key={fIdx}>{feat}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Daily Rate & Selection Button */}
                  <div style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                        Avg. Daily Rate
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
                        {priceDual.primary}
                        <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginLeft: '3px' }}>
                          / day
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        (~{priceDual.secondary})
                      </div>
                    </div>

                    <a
                      href="https://rent.toyota.co.jp/en/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.5rem 0.9rem',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? 'var(--accent-crimson)' : 'var(--bg-surface-elevated)',
                        color: isSelected ? '#ffffff' : 'var(--text-primary)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span>Check Rates</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verified Japanese Rental Agencies Directory */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.3rem' }}>
              Verified Japanese Rental Agencies
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Direct airport terminal pickup with bilingual English counter support and nationwide one-way drop-off
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))',
            gap: '1.25rem',
          }}>
            {RENTAL_AGENCIES.map(agency => (
              <div
                key={agency.id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <span className="badge badge-matcha" style={{ fontSize: '0.7rem' }}>
                      {agency.badge}
                    </span>
                    <span className="kanji-text" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {agency.kanji}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                    {agency.name}
                  </h4>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    📍 {agency.coverage}
                  </div>

                  <p style={{ fontSize: '0.83rem', color: 'var(--accent-gold)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                    ⭐ <em>{agency.recommendedFor}</em>
                  </p>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <strong>Key Perks:</strong>
                    <ul style={{ paddingLeft: '1.1rem', margin: '0.3rem 0 0 0', lineHeight: 1.5 }}>
                      {agency.perks.slice(0, 3).map((perk, pIdx) => (
                        <li key={pIdx}>{perk}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href={agency.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.65rem',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    fontWeight: '700',
                  }}
                >
                  <span>Official English Booking</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Tourist Driving Guide & Rules of the Road */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.3rem' }}>
              Essential Tourist Driving Guide (Rules of the Road)
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Everything foreigners need to know about driving on the left, toll expressways, and gas station etiquette
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '1.25rem',
          }}>
            {DRIVING_GUIDE_RULES.map((rule, rIdx) => (
              <div
                key={rIdx}
                className="glass-card"
                style={{
                  padding: '1.35rem',
                  borderRadius: '16px',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: `${rule.color}20`,
                  color: rule.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '0.2rem',
                }}>
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', margin: 0 }}>
                      {rule.title}
                    </h4>
                    <span style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      backgroundColor: `${rule.color}15`,
                      color: rule.color,
                      fontSize: '0.7rem',
                      fontWeight: '800',
                    }}>
                      {rule.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                    {rule.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Scenic Road Trip Itinerary Inspirations */}
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.3rem' }}>
              Top Scenic Japan Road Trips
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Where renting a car unlocks breathtaking landscapes unreachable by bullet train
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '1.5rem',
          }}>
            {ROAD_TRIP_RECOMMENDATIONS.map(trip => (
              <div
                key={trip.id}
                className="glass-card"
                style={{
                  borderRadius: '18px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{
                  height: '160px',
                  backgroundImage: `url(${trip.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(10, 13, 20, 0.9) 0%, rgba(10, 13, 20, 0.25) 100%)',
                  }} />

                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge" style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff' }}>
                      {trip.region}
                    </span>
                    <span className="badge badge-gold">
                      {trip.duration}
                    </span>
                  </div>

                  <h4 style={{ position: 'relative', fontSize: '1.2rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                    {trip.title}
                  </h4>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-matcha)', fontWeight: '700', marginBottom: '0.5rem' }}>
                      Best Season: {trip.bestSeason}
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                      <strong>Top Highlights:</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                        {trip.highlights.map((h, hIdx) => (
                          <span key={hIdx} style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(148, 163, 184, 0.12)',
                            fontSize: '0.75rem',
                          }}>
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.75rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                  }}>
                    🚗 Recommended: <strong>{trip.recommendedVehicle}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
