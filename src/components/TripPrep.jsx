import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Shield, CreditCard, Smartphone, Luggage, ExternalLink, Sparkles } from 'lucide-react';

const INITIAL_CHECKLIST = [
  { id: 'vjw', category: 'docs', label: 'Complete Visit Japan Web Online (Immigration & Customs QR code)', essential: true, tip: 'Fills out digital disembarkation and customs cards to skip paperwork lines at NRT/HND/KIX.' },
  { id: 'passport', category: 'docs', label: 'Verify Passport has at least 6 months validity', essential: true, tip: 'Airlines will deny boarding if passport expires within 6 months.' },
  { id: 'insurance', category: 'docs', label: 'Purchase Travel Health Insurance', essential: true, tip: 'Japanese medical care is world-class, but clinics require upfront payment if uninsured.' },
  { id: 'idp', category: 'docs', label: 'Obtain Physical 1949 Geneva Convention IDP (If driving)', essential: false, tip: 'Strictly required by car rental companies and Japanese police.' },

  { id: 'cash', category: 'money', label: 'Withdraw ¥15,000 - ¥30,000 in physical cash', essential: true, tip: 'Temple entry booths, Goshuin book stamps, and vending machines are cash-only.' },
  { id: 'suica', category: 'money', label: 'Load Suica or Pasmo onto Apple Wallet', essential: true, tip: 'iPhone users can tap and go at all turnstiles without buying tickets.' },
  { id: 'card_notify', category: 'money', label: 'Notify Bank / Credit Card of Japan travel', essential: true, tip: 'Prevents fraud freezes when buying Shinkansen tickets or dining.' },

  { id: 'esim', category: 'tech', label: 'Set up Japan 5G eSIM (e.g. Ubigi / Airalo) or Pocket WiFi', essential: true, tip: 'Essential for Google Maps train platform navigation in sprawling Tokyo stations.' },
  { id: 'plug_adapter', category: 'tech', label: 'Pack 2-Prong Type A ungrounded plug adapters', essential: true, tip: 'Japan uses 100V flat two-prong sockets. Three-prong grounded plugs will not fit!' },
  { id: 'powerbank', category: 'tech', label: 'Pack 10,000+ mAh portable battery bank', essential: true, tip: 'All-day photo taking and GPS navigation will drain your phone by 3 PM.' },

  { id: 'shoes', category: 'packing', label: 'Break in cushioned, slip-on walking shoes', essential: true, tip: 'Expect 18,000 to 25,000 steps a day. You will remove shoes constantly at temples.' },
  { id: 'hand_towel', category: 'packing', label: 'Pack a small pocket hand towel / handkerchief', essential: true, tip: 'Many traditional Japanese public restrooms do not have hand dryers or paper towels.' },
  { id: 'coin_purse', category: 'packing', label: 'Bring a dedicated coin purse or zipper pouch', essential: true, tip: 'You will accumulate many ¥1, ¥5, ¥10, ¥50, ¥100, and ¥500 coins.' }
];

export default function TripPrep() {
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('komorebi_japan_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('komorebi_japan_checklist', JSON.stringify(checkedItems));
    } catch (e) {
      console.error(e);
    }
  }, [checkedItems]);

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalCount = INITIAL_CHECKLIST.length;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const sections = [
    { id: 'docs', title: 'Passports, Visas & Customs', icon: Shield, color: 'var(--accent-crimson)' },
    { id: 'money', title: 'Money, Yen & Contactless Cards', icon: CreditCard, color: 'var(--accent-gold)' },
    { id: 'tech', title: 'Mobile Connectivity & Electronics', icon: Smartphone, color: 'var(--accent-indigo)' },
    { id: 'packing', title: 'Footwear, Packing & Daily Essentials', icon: Luggage, color: 'var(--accent-matcha)' }
  ];

  return (
    <section id="prep-section" style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-crimson" style={{ marginBottom: '0.5rem' }}>
            Pre-Departure Readiness
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '0.4rem' }}>
            Japan Travel Preparation Checklist
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', fontSize: '0.95rem' }}>
            Interactive checklist saved to your browser: ensure smooth entry through Tokyo immigration, seamless internet, and hassle-free transit.
          </p>
        </div>

        {/* Progress Card */}
        <div className="glass-card" style={{
          padding: '1.5rem',
          marginBottom: '2.5rem',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
              Checklist Readiness
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: progressPercent === 100 ? 'var(--accent-matcha)' : 'var(--text-primary)' }}>
              {completedCount} of {totalCount} Completed ({progressPercent}%)
            </div>
          </div>

          <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
            <div style={{
              height: '10px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: progressPercent === 100 ? 'var(--accent-matcha)' : 'linear-gradient(90deg, #e63946, #f4a261)',
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        </div>

        {/* Categorized Checklist Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
        }}>
          {sections.map(sec => {
            const Icon = sec.icon;
            const items = INITIAL_CHECKLIST.filter(item => item.category === sec.id);

            return (
              <div key={sec.id} className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: `${sec.color}20`,
                    color: sec.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={18} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>
                    {sec.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {items.map(item => {
                    const isChecked = !!checkedItems[item.id];

                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          backgroundColor: isChecked ? 'rgba(42, 157, 143, 0.08)' : 'var(--bg-surface-elevated)',
                          border: '1px solid',
                          borderColor: isChecked ? 'rgba(42, 157, 143, 0.35)' : 'var(--border-subtle)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <div style={{ marginTop: '0.15rem', color: isChecked ? 'var(--accent-matcha)' : 'var(--text-muted)' }}>
                            {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontWeight: '600',
                              fontSize: '0.9rem',
                              color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)',
                              textDecoration: isChecked ? 'line-through' : 'none',
                              marginBottom: '0.2rem',
                            }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                              💡 {item.tip}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
