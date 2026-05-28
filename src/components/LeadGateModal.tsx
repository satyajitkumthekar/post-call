import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface LeadData {
  firstName: string;
  whatsappNumber: string;
}

interface LeadGateModalProps {
  onComplete: (data: LeadData) => void;
}

const COUNTRY_CODES = [
  { code: '+1', label: '+1 US' },
  { code: '+91', label: '+91 IN' },
  { code: '+44', label: '+44 UK' },
  { code: '+61', label: '+61 AU' },
  { code: '+971', label: '+971 AE' },
  { code: '+65', label: '+65 SG' },
  { code: '+60', label: '+60 MY' },
];

function isValidWhatsApp(full: string): boolean {
  // Must be + followed by 7-15 digits
  return /^\+\d{7,15}$/.test(full.replace(/[\s\-()]/g, ''));
}

export default function LeadGateModal({ onComplete }: LeadGateModalProps) {
  const [visible, setVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [exiting, setExiting] = useState(false);
  const firstNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Trigger slide-in animation after mount
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (visible && firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, [visible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;

    if (!firstName.trim()) {
      setFirstNameError('Please enter your first name.');
      valid = false;
    } else {
      setFirstNameError('');
    }

    const fullNumber = (countryCode + phoneNumber.replace(/[\s\-()]/g, '')).replace(/\s/g, '');
    if (!phoneNumber.trim()) {
      setPhoneError('Please enter your WhatsApp number.');
      valid = false;
    } else if (!isValidWhatsApp(fullNumber)) {
      setPhoneError('Please enter a valid phone number (digits only).');
      valid = false;
    } else {
      setPhoneError('');
    }

    if (!valid) return;

    setSubmitting(true);

    const { error } = await supabase.from('leads').insert({
      first_name: firstName.trim(),
      whatsapp_number: fullNumber,
    });

    if (error) {
      // Still let them through — don't block on DB errors
      console.error('Lead save error:', error);
    }

    sessionStorage.setItem('lead_submitted', 'true');
    sessionStorage.setItem('lead_first_name', firstName.trim());
    sessionStorage.setItem('lead_whatsapp', fullNumber);

    // Fade out then complete
    setExiting(true);
    setTimeout(() => {
      onComplete({ firstName: firstName.trim(), whatsappNumber: fullNumber });
    }, 320);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ padding: '16px' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.68)' }}
      />

      {/* Modal card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#0A0A0A',
          border: '1px solid rgba(201,168,76,0.22)',
          borderRadius: '16px',
          padding: 'clamp(24px, 5vw, 32px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
          transform: visible && !exiting ? 'translateY(0)' : exiting ? 'translateY(0)' : 'translateY(40px)',
          opacity: exiting ? 0 : visible ? 1 : 0,
          transition: exiting
            ? 'opacity 300ms ease-in'
            : 'transform 300ms ease-out, opacity 300ms ease-out',
        }}
      >
        {/* Gold caps label */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            color: '#C9A84C',
            textAlign: 'center',
            marginBottom: '16px',
            textTransform: 'uppercase',
          }}
        >
          Before You Watch
        </p>

        {/* Serif italic headline */}
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 'clamp(24px, 5vw, 32px)',
            color: '#F0EDE8',
            lineHeight: 1.2,
            textAlign: 'center',
            marginBottom: '14px',
          }}
        >
          See exactly why your body is the one piece that hasn't moved.
        </h2>

        {/* Subhead */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: '0.95rem',
            color: '#8A8680',
            lineHeight: 1.65,
            textAlign: 'center',
            marginBottom: '28px',
          }}
        >
          In the next 8 minutes, we'll show you the real reason fitness keeps slipping, and the exact system our clients have used to finally fix it.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* First name */}
          <div style={{ marginBottom: '14px' }}>
            <input
              ref={firstNameRef}
              type="text"
              placeholder="Your first name"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); setFirstNameError(''); }}
              autoComplete="given-name"
              style={{
                width: '100%',
                height: '56px',
                backgroundColor: '#141414',
                border: firstNameError
                  ? '1px solid rgba(220,80,80,0.7)'
                  : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '0 16px',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: '0.95rem',
                color: '#F0EDE8',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 200ms',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)';
              }}
              onBlur={(e) => {
                if (!firstNameError) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            />
            {firstNameError && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#e05050', marginTop: '6px' }}>
                {firstNameError}
              </p>
            )}
          </div>

          {/* WhatsApp number */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                height: '56px',
                backgroundColor: '#141414',
                border: phoneError
                  ? '1px solid rgba(220,80,80,0.7)'
                  : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                overflow: 'hidden',
                transition: 'border-color 200ms',
              }}
              onFocus={() => {}}
            >
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                style={{
                  height: '100%',
                  backgroundColor: '#1E1E1E',
                  border: 'none',
                  borderRight: '1px solid rgba(255,255,255,0.08)',
                  color: '#C9A84C',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: '0.85rem',
                  padding: '0 10px',
                  outline: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code} style={{ backgroundColor: '#1E1E1E', color: '#F0EDE8' }}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="WhatsApp number"
                value={phoneNumber}
                onChange={(e) => { setPhoneNumber(e.target.value); setPhoneError(''); }}
                autoComplete="tel"
                style={{
                  flex: 1,
                  height: '100%',
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '0 16px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: '0.95rem',
                  color: '#F0EDE8',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent) parent.style.borderColor = 'rgba(201,168,76,0.6)';
                }}
                onBlur={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent && !phoneError) parent.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              />
            </div>
            {phoneError && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#e05050', marginTop: '6px' }}>
                {phoneError}
              </p>
            )}
          </div>

          {/* CTA button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              height: '56px',
              backgroundColor: submitting ? 'rgba(201,168,76,0.7)' : '#C9A84C',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: '10px',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: '0.95rem',
              letterSpacing: '0.02em',
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'background-color 200ms, transform 150ms',
            }}
            onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.transform = 'scale(1.015)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {submitting ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="animate-spin">
                  <circle cx="12" cy="12" r="10" stroke="rgba(10,10,10,0.3)" strokeWidth="2.5" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Saving...
              </>
            ) : (
              'Show me how this works'
            )}
          </button>

          {/* Caption */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: '0.75rem',
              color: '#5A5855',
              textAlign: 'center',
              marginTop: '12px',
              lineHeight: 1.5,
            }}
          >
            We'll text you the video link too, in case you want to come back to it.
          </p>
        </form>
      </div>
    </div>
  );
}
