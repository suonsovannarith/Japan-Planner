import React, { useState } from 'react';
import { Compass, Calendar, MapPin, Train, DollarSign, CheckSquare, Moon, Sun, Share2, Sparkles } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  theme,
  setTheme,
  onOpenExport
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'planner', label: 'Plan Trip', icon: Sparkles },
    { id: 'itinerary', label: 'Day-by-Day', icon: Calendar },
    { id: 'map', label: 'Japan Route Map', icon: MapPin },
    { id: 'transport', label: 'Trains & Flights', icon: Train },
    { id: 'budget', label: 'Estimated Costs', icon: DollarSign },
    { id: 'prep', label: 'Travel Checklist', icon: CheckSquare },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '74px',
        height: 'auto',
        paddingTop: '0.65rem',
        paddingBottom: '0.65rem',
        gap: '0.75rem',
        flexWrap: 'nowrap',
      }}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('planner')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            cursor: 'pointer',
            flexShrink: 0,
            minWidth: 0,
            userSelect: 'none'
          }}
          className="brand-container"
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #e63946, #c1121f)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(230, 57, 70, 0.4)',
            color: '#fff',
            flexShrink: 0,
          }}>
            {/* Torii Gate SVG Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16" />
              <path d="M2 9h20" />
              <path d="M7 6v14" />
              <path d="M17 6v14" />
              <path d="M7 11h10" />
            </svg>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            lineHeight: 1.15,
            minWidth: 0,
            padding: '2px 0',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.45rem',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}>
              <span style={{
                fontSize: 'clamp(1.1rem, 3.2vw, 1.28rem)',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                display: 'inline-block',
              }}>
                Komorebi <span style={{ color: 'var(--accent-crimson)' }}>Japan</span>
              </span>
              <span className="kanji-text" style={{
                fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                color: 'var(--accent-gold)',
                opacity: 0.95,
                lineHeight: 1,
                display: 'inline-block',
              }}>
                木漏れ日
              </span>
            </div>
            <div style={{
              fontSize: 'clamp(0.62rem, 1.8vw, 0.72rem)',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
              fontWeight: '600',
              lineHeight: 1.25,
              marginTop: '3px',
              whiteSpace: 'nowrap',
            }}>
              SMART TRIP & TRANSIT PLANNER
            </div>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.4rem' }} className="desktop-nav-menu">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 0.95rem',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--accent-crimson)' : 'transparent',
                  boxShadow: isActive ? '0 4px 14px rgba(230, 57, 70, 0.35)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                className="interactive-nav-btn"
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls: Currency, Theme & Share */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Currency Toggle */}
          <button
            onClick={() => setCurrency(currency === 'JPY' ? 'USD' : 'JPY')}
            title="Toggle Currency"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.45rem 0.65rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--accent-gold)',
              fontWeight: '700',
              fontSize: '0.85rem',
              flexShrink: 0,
            }}
          >
            {currency === 'JPY' ? '¥ JPY' : '$ USD'}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Dark / Light Theme"
            style={{
              padding: '0.45rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Export / Share Button */}
          <button
            onClick={onOpenExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2a9d8f, #264653)',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: '600',
              boxShadow: '0 2px 10px rgba(42, 157, 143, 0.3)',
              flexShrink: 0,
            }}
          >
            <Share2 size={16} />
            <span className="export-btn-text">Export</span>
          </button>
        </div>
      </div>

      {/* Mobile Subnav Strip */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-secondary)',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }} className="mobile-nav-strip">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--accent-crimson)' : 'transparent',
                flexShrink: 0,
              }}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav-menu {
            display: flex !important;
          }
          .mobile-nav-strip {
            display: none !important;
          }
        }
        @media (max-width: 520px) {
          .export-btn-text {
            display: none !important;
          }
        }
        @media (max-width: 380px) {
          .kanji-text {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
