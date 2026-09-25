import React, { useState } from 'react';
import {
  FolderOpen, Calendar, MapPin, DollarSign, Users, Clock,
  Trash2, ArrowRight, Sparkles, Plus, Search, SortAsc
} from 'lucide-react';

export default function MyTrips({ savedTrips, onLoadTrip, onDeleteTrip, onNewTrip }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'name' | 'duration'
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filteredTrips = savedTrips
    .filter(trip => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        trip.name.toLowerCase().includes(q) ||
        trip.summary?.startingCityName?.toLowerCase().includes(q) ||
        trip.summary?.uniqueCities?.some(c => c.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest': return a.savedAt - b.savedAt;
        case 'name': return a.name.localeCompare(b.name);
        case 'duration': return (b.summary?.durationDays || 0) - (a.summary?.durationDays || 0);
        default: return b.savedAt - a.savedAt; // newest
      }
    });

  const handleDelete = (tripId) => {
    if (deleteConfirm === tripId) {
      onDeleteTrip(tripId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(tripId);
      // Auto-dismiss the confirmation after 3s
      setTimeout(() => setDeleteConfirm(prev => prev === tripId ? null : prev), 3000);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const getBudgetLabel = (budget) => {
    const labels = { budget: 'Backpacker', mid: 'Comfortable', luxury: 'Premium' };
    return labels[budget] || budget;
  };

  const getPaceEmoji = (pace) => {
    const emojis = { relaxed: '🌿', balanced: '⚖️', packed: '⚡' };
    return emojis[pace] || '⚖️';
  };

  return (
    <section id="my-trips-section" style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container">

        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div>
            <div className="badge badge-crimson" style={{ marginBottom: '0.5rem' }}>
              <FolderOpen size={12} /> My Saved Itineraries
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '0.3rem' }}>
              My Trips
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {savedTrips.length === 0
                ? 'You haven\'t saved any trips yet. Create your first itinerary!'
                : `${savedTrips.length} saved itinerar${savedTrips.length === 1 ? 'y' : 'ies'} — click any card to load it.`}
            </p>
          </div>

          <button
            onClick={onNewTrip}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.7rem 1.4rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #e63946, #c1121f)',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: '700',
              boxShadow: '0 4px 18px rgba(230, 57, 70, 0.35)',
              transition: 'all 0.25s ease',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Plus size={18} />
            <span>New Trip</span>
          </button>
        </div>

        {/* Search & Sort Bar */}
        {savedTrips.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}>
            {/* Search */}
            <div style={{
              flex: '1 1 280px',
              position: 'relative',
            }}>
              <Search size={16} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }} />
              <input
                type="text"
                placeholder="Search trips by name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.5rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Sort Dropdown */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <SortAsc size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A–Z)</option>
                <option value="duration">Longest Duration</option>
              </select>
            </div>
          </div>
        )}

        {/* Trip Cards Grid */}
        {savedTrips.length === 0 ? (
          <div className="glass-card" style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.15), rgba(244, 162, 97, 0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Sparkles size={36} style={{ color: 'var(--accent-crimson)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>No Saved Trips Yet</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px' }}>
                Create your perfect Japan itinerary and save it here. You can save multiple trip plans and compare them!
              </p>
            </div>
            <button
              onClick={onNewTrip}
              className="btn-primary"
              style={{ marginTop: '0.5rem' }}
            >
              <Sparkles size={18} />
              Start Planning
            </button>
          </div>
        ) : (
          <>
            {filteredTrips.length === 0 ? (
              <div style={{
                padding: '3rem 1.5rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}>
                <Search size={28} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.5 }} />
                <p>No trips match "{searchQuery}"</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.25rem',
              }}>
                {filteredTrips.map((trip) => {
                  const summary = trip.summary || {};
                  const cities = summary.uniqueCities || [];
                  const isDeletePending = deleteConfirm === trip.id;

                  return (
                    <div
                      key={trip.id}
                      className="glass-card interactive-hover"
                      style={{
                        padding: 0,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {/* Card Header Gradient */}
                      <div
                        onClick={() => onLoadTrip(trip)}
                        style={{
                          background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.12), rgba(244, 162, 97, 0.08))',
                          padding: '1.25rem 1.25rem 0.85rem',
                          borderBottom: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{
                              fontSize: '1.15rem',
                              fontWeight: '800',
                              marginBottom: '0.3rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {trip.name}
                            </h3>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              fontSize: '0.78rem',
                              color: 'var(--text-muted)',
                            }}>
                              <Clock size={12} />
                              <span>Saved {formatDate(trip.savedAt)}</span>
                            </div>
                          </div>
                          <div className="badge badge-crimson" style={{ fontSize: '0.7rem', flexShrink: 0 }}>
                            {summary.durationDays || '?'}d
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div
                        onClick={() => onLoadTrip(trip)}
                        style={{ padding: '1rem 1.25rem' }}
                      >
                        {/* Cities Route */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          marginBottom: '0.85rem',
                          flexWrap: 'wrap',
                        }}>
                          <MapPin size={14} style={{ color: 'var(--accent-crimson)', flexShrink: 0 }} />
                          {cities.slice(0, 5).map((city, i) => (
                            <React.Fragment key={i}>
                              <span style={{
                                fontSize: '0.82rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                              }}>
                                {city}
                              </span>
                              {i < Math.min(cities.length, 5) - 1 && (
                                <ArrowRight size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                              )}
                            </React.Fragment>
                          ))}
                          {cities.length > 5 && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              +{cities.length - 5} more
                            </span>
                          )}
                        </div>

                        {/* Quick Stats */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '0.5rem',
                          marginBottom: '0.75rem',
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                          }}>
                            <Calendar size={13} style={{ color: 'var(--accent-gold)' }} />
                            <span>{summary.durationDays} days</span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                          }}>
                            <Users size={13} style={{ color: 'var(--accent-matcha)' }} />
                            <span>{summary.travelers} traveler{summary.travelers !== 1 ? 's' : ''}</span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                          }}>
                            <DollarSign size={13} style={{ color: 'var(--accent-gold)' }} />
                            <span>~${summary.grandTotalUSD?.toLocaleString() || '?'}</span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                          }}>
                            <span>{getPaceEmoji(summary.pace)}</span>
                            <span>{getBudgetLabel(summary.budget)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.65rem 1.25rem',
                        borderTop: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface-elevated)',
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onLoadTrip(trip);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: '0.82rem',
                            fontWeight: '700',
                            color: 'var(--accent-crimson)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.3rem 0',
                          }}
                        >
                          <ArrowRight size={14} />
                          <span>Load Trip</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(trip.id);
                          }}
                          title={isDeletePending ? 'Click again to confirm deletion' : 'Delete trip'}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            color: isDeletePending ? '#ef4444' : 'var(--text-muted)',
                            background: isDeletePending ? 'rgba(239, 68, 68, 0.1)' : 'none',
                            border: isDeletePending ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent',
                            borderRadius: '8px',
                            padding: '0.3rem 0.6rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Trash2 size={13} />
                          <span>{isDeletePending ? 'Confirm?' : 'Delete'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
