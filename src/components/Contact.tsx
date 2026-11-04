import React, { useState } from 'react';
import { Send, MapPin, Check, Copy, AlertCircle, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { MaskedHeading } from './motion/MaskedHeading';
import { Magnetic } from './motion/Magnetic';
import { ScrollRevealBox, CardItem } from './motion/ScrollRevealBox';

interface ContactProps {
  language: Language;
}

export const Contact: React.FC<ContactProps> = ({ language }) => {
  const t = translations[language].contact;

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', botField: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [isCopied, setIsCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Web3Forms Access Key from client-safe Vite environment configuration
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions if already submitting
    if (status === 'submitting') return;

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedSubject = form.subject.trim();
    const trimmedMessage = form.message.trim();

    // 1. Validation
    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setErrorMessage(
        language === 'en'
          ? 'Please fill in all required fields (Name, Email, Message).'
          : 'कृपया सबै आवश्यक विवरणहरू (नाम, इमेल, सन्देश) भर्नुहोस्।'
      );
      setStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage(
        language === 'en'
          ? 'Please enter a valid email address.'
          : 'कृपया मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्।'
      );
      setStatus('error');
      return;
    }

    // Bot honeypot check (silently trap spam bots)
    if (form.botField) {
      setStatus('success');
      return;
    }

    setErrorMessage('');
    setStatus('submitting');

    try {
      // 2. Official Web3Forms Submission via JSON API
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: trimmedName,
          email: trimmedEmail,
          subject: trimmedSubject || `Portfolio Message from ${trimmedName}`,
          message: trimmedMessage,
          from_name: 'Dibash Lamichhane Portfolio',
          botcheck: form.botField,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '', botField: '' });
      } else {
        setStatus('error');
        if (!accessKey) {
          setErrorMessage(
            language === 'en'
              ? 'Web3Forms access key is missing. Please add VITE_WEB3FORMS_ACCESS_KEY to your .env file.'
              : 'Web3Forms access key कन्फिगर गरिएको छैन। कृपया .env मा VITE_WEB3FORMS_ACCESS_KEY राख्नुहोस्।'
          );
        } else {
          setErrorMessage(data.message || t.form.sendError);
        }
      }
    } catch {
      setStatus('error');
      setErrorMessage(t.form.sendError);
    }
  };

  const copyToClipboard = () => {
    const text = `From: ${form.name || 'Visitor'} (${form.email || 'No email'})\nSubject: ${form.subject || 'Portfolio Connect'}\n\n${form.message}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <section
      id="contact"
      className="section-padding"
      style={{
        backgroundColor: 'var(--contact-bg)',
        borderTop: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Restrained closing atmosphere: subtle metallic copper & obsidian vignette */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-custom" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ maxWidth: '780px', marginBottom: '3.75rem' }}>
          <ScrollRevealBox variant="restrained" delay={0.05}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--contact-accent)',
                background: 'rgba(249, 115, 22, 0.08)',
                border: '1px solid var(--contact-border)',
                borderRadius: 'var(--radius-full)',
                marginBottom: '1rem',
              }}
            >
              <Sparkles size={12} />
              <span>{t.label}</span>
            </div>
          </ScrollRevealBox>

          <MaskedHeading
            text={t.heading}
            as="h2"
            className="kinetic-heading"
            style={{ color: 'var(--contact-text)' }}
          />
          <ScrollRevealBox variant="restrained" delay={0.15}>
            <p style={{ fontSize: '1.08rem', color: 'var(--contact-muted)', lineHeight: 1.75 }}>
              {t.subheading}
            </p>
          </ScrollRevealBox>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Direct verified channels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Location Card */}
            <ScrollRevealBox
              variant="restrained"
              delay={0.1}
              hoverEffect="border-glow"
              hoverAccentColor="var(--contact-accent)"
              style={{
                padding: '2rem',
                borderRadius: '20px',
                background: 'var(--contact-surface)',
                border: '1px solid var(--contact-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
              }}
            >
              <CardItem step={1} direction="pop">
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: 'rgba(249, 115, 22, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MapPin size={24} color="var(--contact-accent)" />
                </div>
              </CardItem>

              <CardItem step={2} direction="up">
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: 'var(--contact-muted)',
                    }}
                  >
                    {t.locationTitle}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--contact-text)' }}>
                    {t.locationValue}
                  </div>
                </div>
              </CardItem>
            </ScrollRevealBox>

            {/* GitHub Card */}
            <ScrollRevealBox
              variant="restrained"
              delay={0.18}
              hoverEffect="border-glow"
              hoverAccentColor="var(--contact-accent)"
              as="a"
              href="https://github.com/dibash792"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Dibash Lamichhane GitHub Profile"
              style={{
                padding: '2rem',
                borderRadius: '20px',
                background: 'var(--contact-surface)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
              }}
            >
              <CardItem step={1} direction="pop">
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <GithubIcon size={24} color="var(--contact-text)" />
                </div>
              </CardItem>

              <CardItem step={2} direction="up">
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: 'var(--contact-muted)',
                    }}
                  >
                    {t.githubTitle}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--contact-text)' }}>
                    {t.githubValue}
                  </div>
                </div>
              </CardItem>
            </ScrollRevealBox>

            {/* LinkedIn Card */}
            <ScrollRevealBox
              variant="restrained"
              delay={0.26}
              hoverEffect="border-glow"
              hoverAccentColor="#0a66c2"
              as="a"
              href="https://www.linkedin.com/in/dibash-lamichhane-47871b434"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Dibash Lamichhane LinkedIn Profile"
              style={{
                padding: '2rem',
                borderRadius: '20px',
                background: 'var(--contact-surface)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
              }}
            >
              <CardItem step={1} direction="pop">
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: 'rgba(249, 115, 22, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LinkedinIcon size={24} color="var(--contact-accent)" />
                </div>
              </CardItem>

              <CardItem step={2} direction="up">
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: 'var(--contact-muted)',
                    }}
                  >
                    {t.linkedinTitle}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--contact-text)' }}>
                    {t.linkedinValue}
                  </div>
                </div>
              </CardItem>
            </ScrollRevealBox>
          </div>

          {/* Right Column: Direct Netlify Message Form */}
          <ScrollRevealBox
            variant="restrained"
            delay={0.2}
            style={{
              padding: '2.75rem',
              borderRadius: '24px',
              background: 'var(--contact-surface)',
              border: '1px solid var(--contact-border)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
            }}
          >
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--contact-text)' }}>
              {t.form.title}
            </h3>

            {/* Web3Forms Contact Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}
            >
              {/* Web3Forms Anti-Spam Honeypot */}
              <input
                type="checkbox"
                name="botcheck"
                checked={!!form.botField}
                onChange={(e) => setForm({ ...form, botField: e.target.checked ? 'bot' : '' })}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <CardItem step={1} direction="up">
                <div>
                  <input
                    type="text"
                    name="name"
                    required
                    disabled={status === 'submitting'}
                    placeholder={t.form.namePlaceholder}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.95rem 1.25rem',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--contact-text)',
                      fontFamily: 'inherit',
                      fontSize: '0.96rem',
                      opacity: status === 'submitting' ? 0.7 : 1,
                    }}
                  />
                </div>
              </CardItem>

              <CardItem step={2} direction="up">
                <div>
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={status === 'submitting'}
                    placeholder={t.form.emailPlaceholder}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.95rem 1.25rem',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--contact-text)',
                      fontFamily: 'inherit',
                      fontSize: '0.96rem',
                      opacity: status === 'submitting' ? 0.7 : 1,
                    }}
                  />
                </div>
              </CardItem>

              <CardItem step={3} direction="up">
                <div>
                  <input
                    type="text"
                    name="subject"
                    disabled={status === 'submitting'}
                    placeholder={t.form.subjectPlaceholder}
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.95rem 1.25rem',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--contact-text)',
                      fontFamily: 'inherit',
                      fontSize: '0.96rem',
                      opacity: status === 'submitting' ? 0.7 : 1,
                    }}
                  />
                </div>
              </CardItem>

              <CardItem step={4} direction="up">
                <div>
                  <textarea
                    name="message"
                    required
                    disabled={status === 'submitting'}
                    rows={4}
                    placeholder={t.form.messagePlaceholder}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.95rem 1.25rem',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--contact-text)',
                      fontFamily: 'inherit',
                      fontSize: '0.96rem',
                      resize: 'vertical',
                      opacity: status === 'submitting' ? 0.7 : 1,
                    }}
                  />
                </div>
              </CardItem>

              {errorMessage && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#f87171',
                    fontSize: '0.85rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                  }}
                >
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <CardItem step={5} direction="up">
                <Magnetic strength={0.16} style={{ width: '100%' }}>
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, var(--contact-accent), #ea580c)',
                      color: '#fff',
                      opacity: status === 'submitting' ? 0.75 : 1,
                      cursor: status === 'submitting' ? 'wait' : 'pointer',
                    }}
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>{t.form.sending}</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>{t.form.sendBtn}</span>
                      </>
                    )}
                  </button>
                </Magnetic>
              </CardItem>

              {/* Polished Success State */}
              {status === 'success' && (
                <div
                  style={{
                    marginTop: '0.5rem',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <Check size={20} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ fontSize: '0.9rem', color: 'var(--contact-text)', lineHeight: 1.5 }}>
                      {t.form.sentSuccess}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setErrorMessage('');
                    }}
                    className="btn-secondary"
                    style={{
                      alignSelf: 'flex-start',
                      fontSize: '0.82rem',
                      padding: '0.4rem 0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                    }}
                  >
                    <RefreshCw size={13} />
                    <span>{language === 'en' ? 'Send another message' : 'अर्को सन्देश पठाउनुहोस्'}</span>
                  </button>
                </div>
              )}

              {/* Error State with Message Preservation & Copy Fallback */}
              {status === 'error' && (
                <div
                  style={{
                    marginTop: '0.5rem',
                    padding: '1.15rem',
                    borderRadius: '12px',
                    background: 'rgba(249, 115, 22, 0.08)',
                    border: '1px solid var(--contact-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <p style={{ fontSize: '0.85rem', color: 'var(--contact-muted)', lineHeight: 1.5 }}>
                    Your typed message is safely preserved above. You can also copy it:
                  </p>

                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    {isCopied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                    <span>{isCopied ? t.form.copied : t.form.copyBtn}</span>
                  </button>
                </div>
              )}

              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--contact-muted)',
                  lineHeight: 1.5,
                  marginTop: '0.35rem',
                }}
              >
                {t.form.mailNotice}
              </p>
            </form>
          </ScrollRevealBox>
        </div>
      </div>
    </section>
  );
};
