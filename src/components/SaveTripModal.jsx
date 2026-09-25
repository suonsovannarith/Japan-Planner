import React, { useState, useRef, useEffect } from 'react';
import { Save, X, Sparkles, Tag } from 'lucide-react';

const SUGGESTED_NAMES = [
  'Family Summer Trip',
  'Solo Kyoto Run',
  'Tokyo Weekend Blitz',
  'Golden Week Adventure',
  'Cherry Blossom Tour',
  'Autumn Leaves Journey',
  'Foodie Paradise Trip',
  'Culture Deep-Dive',
  'Honeymoon Escape',
  'Friends Reunion Trip',
];

export default function SaveTripModal({ isOpen, onClose, onSave, itinerary }) {
  const [tripName, setTripName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Generate a smart default name based on itinerary
      const cities = itinerary?.summary?.uniqueCities || [];
      const days = itinerary?.summary?.durationDays || 7;
      const defaultName = cities.length > 0
        ? `${cities.slice(0, 3).join(' → ')} (${days}d)`
        : `Japan ${days}-Day Trip`;
      setTripName(defaultName);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, itinerary]);

  if (!isOpen) return null;

  const handleSave = () => {
    const name = tripName.trim() || 'Untitled Trip';
    onSave(name);
    setTripName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          borderRadius: '20px',
          background: 'var(--bg-surface)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.1), rgba(244, 162, 97, 0.06))',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #e63946, #c1121f)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}>
              <Save size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', lineHeight: 1.2 }}>
                Save Your Trip
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Give your itinerary a memorable name
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Name Input */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: '700',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem',
            }}>
              <Tag size={13} />
              Trip Name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Family Summer Trip"
              maxLength={80}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '2px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontWeight: '600',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '0.3rem',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
            }}>
              {tripName.length}/80
            </div>
          </div>

          {/* Quick Suggestions */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              fontSize: '0.78rem',
              fontWeight: '600',
              color: 'var(--text-muted)',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}>
              <Sparkles size={12} />
              Quick suggestions
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
            }}>
              {SUGGESTED_NAMES.slice(0, 6).map((name) => (
                <button
                  key={name}
                  onClick={() => setTripName(name)}
                  style={{
                    padding: '0.3rem 0.7rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: tripName === name
                      ? 'rgba(230, 57, 70, 0.15)'
                      : 'var(--bg-surface-elevated)',
                    color: tripName === name
                      ? 'var(--accent-crimson)'
                      : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: tripName === name
                      ? 'rgba(230, 57, 70, 0.3)'
                      : 'var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Itinerary Summary Preview */}
          {itinerary?.summary && (
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.5rem',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
            }}>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <span><strong>{itinerary.summary.durationDays}</strong> days</span>
                <span><strong>{itinerary.summary.travelers}</strong> traveler{itinerary.summary.travelers !== 1 ? 's' : ''}</span>
                <span>~<strong>${itinerary.summary.grandTotalUSD?.toLocaleString()}</strong></span>
              </div>
              <div style={{ marginTop: '0.4rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                {itinerary.summary.uniqueCities?.join(' → ')}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                flex: 2,
                padding: '0.75rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #e63946, #c1121f)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(230, 57, 70, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <Save size={16} />
              Save Trip
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
