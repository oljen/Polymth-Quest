import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Sparkles, CheckCircle2, XCircle, ExternalLink, Loader2, BookOpen, Video, Globe, FileText } from 'lucide-react';

// --- Topics: hand-picked palette per topic, single-letter monogram ---
const TOPICS = [
  { id: 'electronics',  name: 'ELECTRONICS',  letter: 'E', bg: '#FFD83D', shadow: '#C99A00' },
  { id: 'philosophy',   name: 'PHILOSOPHY',   letter: 'Φ', bg: '#B8A3E3', shadow: '#6E58A3' },
  { id: 'mathematics',  name: 'MATHEMATICS',  letter: '∑', bg: '#7FC7E8', shadow: '#3F87A8' },
  { id: 'music',        name: 'MUSIC',        letter: '♪', bg: '#FF7E6B', shadow: '#B53B2A' },
  { id: 'programming',  name: 'PROGRAMMING',  letter: '<>',color: '#FAF6EC', bg: '#1A2B4D', shadow: '#000820' },
  { id: 'astronomy',    name: 'ASTRONOMY',    letter: '★', bg: '#3D2952', shadow: '#1A0E29', color: '#FFD83D' },
  { id: 'biology',      name: 'BIOLOGY',      letter: '✿', bg: '#93E6A8', shadow: '#3F9F58' },
  { id: 'art',          name: 'ART',          letter: '◐', bg: '#FFB67A', shadow: '#B5642A' },
  { id: 'writing',      name: 'WRITING',      letter: '✎', bg: '#FAF6EC', shadow: '#A89B7A', color: '#3D2952' },
  { id: 'languages',    name: 'LANGUAGES',    letter: 'あ', bg: '#FF7E6B', shadow: '#B53B2A' },
  { id: 'psychology',   name: 'PSYCHOLOGY',   letter: 'Ψ', bg: '#B8A3E3', shadow: '#6E58A3' },
  { id: 'physics',      name: 'PHYSICS',      letter: '⚛', bg: '#7FC7E8', shadow: '#3F87A8' },
];

const RESOURCE_TYPES = [
  { id: 'video',   label: 'VIDEO',   Icon: Video },
  { id: 'article', label: 'ARTICLE', Icon: FileText },
  { id: 'website', label: 'WEBSITE', Icon: Globe },
  { id: 'book',    label: 'BOOK',    Icon: BookOpen },
];

// Seed resources so the prototype isn't empty on first load
const SEED = [
  { id: 's1', topic: 'electronics', title: 'Ben Eater - Build an 8-bit computer from scratch', url: 'https://eater.net/8bit', desc: 'Legendary breadboard series. Solder, blink, understand.', type: 'video', submittedBy: 'circuit_witch', stars: 42, status: 'approved' },
  { id: 's2', topic: 'electronics', title: 'All About Circuits Textbook', url: 'https://www.allaboutcircuits.com/textbook/', desc: 'Free, deep, the canon for hobbyist EE.', type: 'website', submittedBy: 'voltmaster', stars: 28, status: 'approved' },
  { id: 's3', topic: 'philosophy', title: 'Philosophize This! Podcast', url: 'https://www.philosophizethis.org/', desc: 'Stephen West makes every philosopher feel like a friend.', type: 'website', submittedBy: 'cave_dweller', stars: 51, status: 'approved' },
  { id: 's4', topic: 'mathematics', title: '3Blue1Brown - Essence of Linear Algebra', url: 'https://www.3blue1brown.com/topics/linear-algebra', desc: 'You will SEE the math. Cannot recommend enough.', type: 'video', submittedBy: 'pi_pilgrim', stars: 89, status: 'approved' },
  { id: 's5', topic: 'music', title: 'Adam Neely on YouTube', url: 'https://www.youtube.com/@AdamNeely', desc: 'Music theory but the cool, curious version.', type: 'video', submittedBy: 'bass_clef', stars: 36, status: 'approved' },
  { id: 's6', topic: 'programming', title: 'CS50 by Harvard', url: 'https://cs50.harvard.edu/', desc: 'The intro course everyone wishes they had first.', type: 'video', submittedBy: 'malloc_wizard', stars: 67, status: 'approved' },
  { id: 's7', topic: 'astronomy', title: 'Stellarium (free planetarium)', url: 'https://stellarium.org/', desc: 'Point at the sky tonight. Learn what you see.', type: 'website', submittedBy: 'star_walker', stars: 22, status: 'approved' },
  { id: 's8', topic: 'biology', title: 'Crash Course Biology', url: 'https://www.youtube.com/playlist?list=PL3EED4C1D684D3ADF', desc: 'Hank Green at full speed. Cells to ecosystems.', type: 'video', submittedBy: 'mitochondria_fan', stars: 31, status: 'approved' },
  { id: 's9', topic: 'art', title: 'DrawABox', url: 'https://drawabox.com/', desc: 'Free curriculum. The boxes feel pointless until they dont.', type: 'website', submittedBy: 'pencil_pusher', stars: 44, status: 'approved' },
  { id: 's10', topic: 'writing', title: 'On Writing Well by William Zinsser', url: 'https://www.harpercollins.com/products/on-writing-well-william-zinsser', desc: 'Cut every other word. Then cut more.', type: 'book', submittedBy: 'verbose_no_more', stars: 38, status: 'approved' },
  { id: 's11', topic: 'languages', title: 'Anki', url: 'https://apps.ankiweb.net/', desc: 'Spaced repetition flashcards. The boring tool that actually works.', type: 'website', submittedBy: 'memorywalker', stars: 55, status: 'approved' },
  { id: 's12', topic: 'psychology', title: 'Thinking, Fast and Slow', url: 'https://us.macmillan.com/books/9780374533557/thinkingfastandslow', desc: 'Kahneman on how your brain lies to you.', type: 'book', submittedBy: 'system_two', stars: 73, status: 'approved' },
  { id: 's13', topic: 'physics', title: 'Feynman Lectures (free online)', url: 'https://www.feynmanlectures.caltech.edu/', desc: 'The complete lectures. Free. Yes really.', type: 'website', submittedBy: 'curious_character', stars: 92, status: 'approved' },
];

// --- Pixel sun mascot (CSS box-shadow pixel art) ---
function PixelSun() {
  // 11x11 grid of pixels for a chunky sun
  const grid = [
    '...........',
    '....yyy....',
    '..yyyYYyyy.',
    '.yYYYYYYYy.',
    '.yYYWWYYYy.',
    'yyYYWWYYYyy',
    '.yYYYYYYYy.',
    '.yYYYYYYYy.',
    '..yyyYYyyy.',
    '....yyy....',
    '...........',
  ];
  const colors = { y: '#FFD83D', Y: '#FFB200', W: '#FFF4E0' };
  const size = 8;
  return (
    <div style={{ width: size * 11, height: size * 11, position: 'relative' }} className="pixel-sun">
      {grid.map((row, y) => row.split('').map((c, x) => {
        if (c === '.') return null;
        return (
          <div key={`${x}-${y}`} style={{
            position: 'absolute',
            left: x * size, top: y * size,
            width: size, height: size,
            background: colors[c],
          }} />
        );
      }))}
    </div>
  );
}

// --- Pixel cloud ---
function PixelCloud({ scale = 4, color = '#FFFFFF' }) {
  const grid = [
    '..wwww..',
    '.wwwwww.',
    'wwwwwwww',
    '.wwwwww.',
  ];
  return (
    <div style={{ width: scale * 8, height: scale * 4, position: 'relative' }}>
      {grid.map((row, y) => row.split('').map((c, x) => c === 'w' && (
        <div key={`${x}-${y}`} style={{
          position: 'absolute', left: x * scale, top: y * scale,
          width: scale, height: scale, background: color,
        }} />
      )))}
    </div>
  );
}

// --- Pixel star ---
function PixelStar({ scale = 3, color = '#FFD83D' }) {
  const grid = [
    '..s..',
    '.sss.',
    'sssss',
    '.sss.',
    '..s..',
  ];
  return (
    <div style={{ width: scale * 5, height: scale * 5, position: 'relative', display: 'inline-block' }}>
      {grid.map((row, y) => row.split('').map((c, x) => c === 's' && (
        <div key={`${x}-${y}`} style={{
          position: 'absolute', left: x * scale, top: y * scale,
          width: scale, height: scale, background: color,
        }} />
      )))}
    </div>
  );
}

// --- Pixel button: chunky NES-style ---
function PixelButton({ children, onClick, color = '#FF7E6B', textColor = '#FFF4E0', shadow = '#B53B2A', size = 'md', disabled }) {
  const padding = size === 'lg' ? '16px 28px' : size === 'sm' ? '8px 14px' : '12px 20px';
  const fontSize = size === 'lg' ? 14 : size === 'sm' ? 9 : 11;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="pixel-btn"
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize,
        padding,
        background: color,
        color: textColor,
        border: 'none',
        boxShadow: `inset -4px -4px 0 0 ${shadow}, inset 4px 4px 0 0 rgba(255,255,255,0.25)`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        transition: 'transform 0.05s, box-shadow 0.05s',
      }}
    >
      {children}
    </button>
  );
}

// --- Topic card ---
function TopicCard({ topic, count, onClick }) {
  return (
    <button onClick={onClick} className="topic-card" style={{
      background: topic.bg,
      color: topic.color || '#1A2B4D',
      border: 'none',
      padding: '20px 16px',
      cursor: 'pointer',
      boxShadow: `inset -6px -6px 0 0 ${topic.shadow}, inset 6px 6px 0 0 rgba(255,255,255,0.3), 6px 6px 0 0 #1A2B4D`,
      fontFamily: "'Press Start 2P', monospace",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      transition: 'transform 0.08s ease, box-shadow 0.08s ease',
    }}>
      <div style={{ fontSize: 38, lineHeight: 1, marginTop: 6 }}>{topic.letter}</div>
      <div style={{ fontSize: 9, letterSpacing: '1px', textAlign: 'center' }}>{topic.name}</div>
      <div style={{ opacity: 0.85, fontFamily: "'VT323', monospace", fontSize: 14 }}>
        {count} {count === 1 ? 'RESOURCE' : 'RESOURCES'}
      </div>
    </button>
  );
}

// --- Resource card ---
function ResourceCard({ resource, onStar }) {
  const type = RESOURCE_TYPES.find(t => t.id === resource.type) || RESOURCE_TYPES[2];
  const TypeIcon = type.Icon;
  return (
    <div className="resource-card" style={{
      background: '#FAF6EC',
      padding: '18px 20px',
      boxShadow: 'inset -4px -4px 0 0 #A89B7A, inset 4px 4px 0 0 #FFFFFF, 4px 4px 0 0 #1A2B4D',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#1A2B4D', color: '#FFD83D',
          padding: '4px 8px',
          fontFamily: "'Press Start 2P', monospace", fontSize: 8,
        }}>
          <TypeIcon size={10} strokeWidth={3} /> {type.label}
        </div>
        <button onClick={() => onStar(resource.id)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#FFD83D', color: '#1A2B4D',
          padding: '4px 10px', border: 'none',
          boxShadow: 'inset -3px -3px 0 0 #C99A00, inset 3px 3px 0 0 rgba(255,255,255,0.4)',
          fontFamily: "'Press Start 2P', monospace", fontSize: 9,
          cursor: 'pointer',
        }}>
          <PixelStar scale={2} /> {resource.stars}
        </button>
      </div>
      <a href={resource.url} target="_blank" rel="noopener noreferrer" style={{
        fontFamily: "'Press Start 2P', monospace", fontSize: 12,
        color: '#1A2B4D', textDecoration: 'none', lineHeight: 1.6,
        display: 'inline-flex', gap: 8, alignItems: 'flex-start',
      }} className="resource-title">
        <span style={{ flex: 1 }}>{resource.title}</span>
        <ExternalLink size={14} strokeWidth={3} style={{ flexShrink: 0, marginTop: 2 }} />
      </a>
      <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: '#3D2952', margin: 0, lineHeight: 1.3 }}>
        {resource.desc}
      </p>
      <div style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: '#7A6E5A' }}>
        submitted by <span style={{ color: '#FF7E6B' }}>@{resource.submittedBy}</span>
      </div>
    </div>
  );
}

// --- AI Moderation: actually calls Claude ---
async function moderateSubmission({ topic, title, url, desc }) {
  const prompt = `You are a moderator for a community learning-resource site. Decide if this submission is a genuine learning resource for the stated topic, or spam/troll/off-topic/malicious.

Topic: ${topic}
Title: ${title}
URL: ${url}
Description: ${desc}

Respond with ONLY a JSON object, no other text, no markdown fences:
{"verdict": "approved" | "rejected" | "review", "reason": "one short sentence, max 12 words"}

Rules:
- "approved" = clearly a genuine learning resource for the topic
- "rejected" = obvious spam, troll, off-topic, NSFW, malicious, or gibberish
- "review" = unclear, low-quality but not obviously bad, or you cannot tell from the info given
- Be optimistic by default. If it plausibly helps someone learn the topic, approve.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await response.json();
    const text = data.content?.map(b => b.text || '').join('').trim() || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return parsed;
  } catch (err) {
    console.error('Moderation error:', err);
    return { verdict: 'review', reason: 'Could not reach the AI moderator just now.' };
  }
}

// --- Submit modal ---
function SubmitModal({ open, onClose, onSubmit, defaultTopic }) {
  const [topic, setTopic] = useState(defaultTopic || 'electronics');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('website');
  const [status, setStatus] = useState('idle'); // idle, checking, approved, rejected, review
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (defaultTopic) setTopic(defaultTopic);
  }, [defaultTopic]);

  if (!open) return null;

  const reset = () => {
    setTitle(''); setUrl(''); setDesc(''); setStatus('idle'); setReason('');
  };

  const handleSubmit = async () => {
    if (!title || !url) return;
    setStatus('checking');
    setReason('');
    const result = await moderateSubmission({ topic, title, url, desc });
    setStatus(result.verdict);
    setReason(result.reason);
    if (result.verdict === 'approved' || result.verdict === 'review') {
      onSubmit({
        id: 'u' + Date.now(),
        topic, title, url, desc, type,
        submittedBy: 'you',
        stars: result.verdict === 'approved' ? 1 : 0,
        status: result.verdict,
      });
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(26, 43, 77, 0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#FFF4E0', maxWidth: 560, width: '100%',
        boxShadow: 'inset -6px -6px 0 0 #A89B7A, inset 6px 6px 0 0 #FFFFFF, 8px 8px 0 0 #1A2B4D',
        padding: 28, position: 'relative', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, margin: 0, color: '#1A2B4D' }}>
            ADD A RESOURCE
          </h2>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: '#1A2B4D',
          }}>✕</button>
        </div>

        {status === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="TOPIC">
              <select value={topic} onChange={e => setTopic(e.target.value)} style={inputStyle}>
                {TOPICS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </Field>
            <Field label="TYPE">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {RESOURCE_TYPES.map(rt => (
                  <button key={rt.id} onClick={() => setType(rt.id)} style={{
                    ...inputStyle,
                    flex: '1 1 auto',
                    background: type === rt.id ? '#FFD83D' : '#FAF6EC',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '8px 10px',
                  }}>
                    <rt.Icon size={12} strokeWidth={3} /> {rt.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="TITLE">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What's it called?" style={inputStyle} />
            </Field>
            <Field label="URL">
              <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." style={inputStyle} />
            </Field>
            <Field label="WHY IT'S GOOD">
              <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="One sentence pitch..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </Field>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <PixelButton onClick={handleSubmit} disabled={!title || !url}>
                <Sparkles size={12} strokeWidth={3} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                SUBMIT
              </PixelButton>
              <PixelButton onClick={onClose} color="#FAF6EC" textColor="#1A2B4D" shadow="#A89B7A">CANCEL</PixelButton>
            </div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: '#7A6E5A', marginTop: 4 }}>
              An AI moderator will check your submission before it goes live.
            </div>
          </div>
        )}

        {status === 'checking' && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ display: 'inline-block', animation: 'spin 1.2s linear infinite' }}>
              <Loader2 size={48} strokeWidth={3} color="#FF7E6B" />
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, marginTop: 18, color: '#1A2B4D' }}>
              AI MODERATOR CHECKING...
            </div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: '#7A6E5A', marginTop: 8 }}>
              consulting the oracle
            </div>
          </div>
        )}

        {status === 'approved' && (
          <ResultPanel
            icon={<CheckCircle2 size={48} strokeWidth={3} color="#3F9F58" />}
            title="APPROVED!"
            color="#3F9F58"
            reason={reason}
            primary={<PixelButton onClick={() => { reset(); onClose(); }} color="#93E6A8" textColor="#1A2B4D" shadow="#3F9F58">NICE</PixelButton>}
            secondary={<PixelButton onClick={reset} color="#FAF6EC" textColor="#1A2B4D" shadow="#A89B7A" size="sm">ADD ANOTHER</PixelButton>}
          />
        )}

        {status === 'review' && (
          <ResultPanel
            icon={<Sparkles size={48} strokeWidth={3} color="#FFB200" />}
            title="QUEUED FOR REVIEW"
            color="#B5642A"
            reason={reason}
            primary={<PixelButton onClick={() => { reset(); onClose(); }} color="#FFD83D" textColor="#1A2B4D" shadow="#C99A00">OK</PixelButton>}
          />
        )}

        {status === 'rejected' && (
          <ResultPanel
            icon={<XCircle size={48} strokeWidth={3} color="#B53B2A" />}
            title="NOT THIS ONE"
            color="#B53B2A"
            reason={reason}
            primary={<PixelButton onClick={() => setStatus('idle')} color="#FF7E6B" shadow="#B53B2A">TRY AGAIN</PixelButton>}
          />
        )}
      </div>
    </div>
  );
}

function ResultPanel({ icon, title, color, reason, primary, secondary }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      {icon}
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, marginTop: 16, color }}>
        {title}
      </div>
      <div style={{ fontFamily: "'VT323', monospace", fontSize: 19, color: '#3D2952', marginTop: 12, padding: '0 20px' }}>
        {reason}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
        {primary}
        {secondary}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: '#1A2B4D', letterSpacing: '1px' }}>
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle = {
  fontFamily: "'VT323', monospace",
  fontSize: 18,
  padding: '10px 12px',
  background: '#FFFFFF',
  border: 'none',
  boxShadow: 'inset 3px 3px 0 0 #A89B7A, inset -3px -3px 0 0 #FFFFFF, 0 0 0 3px #1A2B4D',
  color: '#1A2B4D',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

// --- Header ---
function Header({ totalResources, onAdd }) {
  return (
    <header style={{
      background: '#1A2B4D',
      padding: '14px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '4px solid #000820',
      flexWrap: 'wrap', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <PixelStar scale={4} color="#FFD83D" />
        <div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, color: '#FFD83D', letterSpacing: '2px' }}>
            POLYMATH<span style={{ color: '#FF7E6B' }}>.QUEST</span>
          </div>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: '#7FC7E8', marginTop: 2 }}>
            a library, by curious people, for curious people
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: '#93E6A8' }}>
          {totalResources} RESOURCES
        </div>
        <PixelButton onClick={onAdd} color="#FFD83D" textColor="#1A2B4D" shadow="#C99A00" size="sm">
          <Plus size={10} strokeWidth={4} style={{ display: 'inline', verticalAlign: 'middle' }} /> ADD
        </PixelButton>
      </div>
    </header>
  );
}

// --- Hero ---
function Hero({ onBrowse }) {
  return (
    <section style={{
      background: 'linear-gradient(to bottom, #7FC7E8 0%, #B8A3E3 60%, #FFB67A 100%)',
      padding: '60px 24px 80px',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '4px solid #1A2B4D',
    }}>
      {/* Pixel clouds */}
      <div style={{ position: 'absolute', top: 40, left: '10%' }}><PixelCloud scale={5} /></div>
      <div style={{ position: 'absolute', top: 100, right: '15%' }}><PixelCloud scale={4} /></div>
      <div style={{ position: 'absolute', top: 60, right: '40%' }}><PixelCloud scale={3} /></div>

      {/* Pixel stars sprinkled */}
      <div style={{ position: 'absolute', top: 30, left: '40%' }}><PixelStar scale={2} color="#FFF4E0" /></div>
      <div style={{ position: 'absolute', top: 140, left: '70%' }}><PixelStar scale={2} color="#FFF4E0" /></div>
      <div style={{ position: 'absolute', top: 200, left: '25%' }}><PixelStar scale={2} color="#FFF4E0" /></div>

      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <PixelSun />
        </div>
        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'clamp(20px, 4vw, 36px)',
          color: '#1A2B4D',
          margin: 0,
          lineHeight: 1.4,
          letterSpacing: '1px',
          textShadow: '4px 4px 0 #FFD83D',
        }}>
          LEARN<br />EVERYTHING.
        </h1>
        <p style={{
          fontFamily: "'VT323', monospace",
          fontSize: 'clamp(18px, 2.4vw, 24px)',
          color: '#1A2B4D',
          marginTop: 28,
          lineHeight: 1.4,
          maxWidth: 620,
          margin: '28px auto 0',
        }}>
          A community wiki of the best learning resources, picked by people who
          actually used them. Found something that taught you well?
          <span style={{ color: '#3D2952', fontWeight: 'bold' }}> pass it on.</span>
        </p>
        <div style={{ marginTop: 36, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <PixelButton onClick={onBrowse} size="lg">START EXPLORING ↓</PixelButton>
        </div>
      </div>
    </section>
  );
}

// --- Topic detail view ---
function TopicView({ topic, resources, onBack, onAdd, onStar }) {
  const topicResources = resources
    .filter(r => r.topic === topic.id && r.status !== 'rejected')
    .sort((a, b) => b.stars - a.stars);

  return (
    <section style={{ padding: '40px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
        <PixelButton onClick={onBack} color="#FAF6EC" textColor="#1A2B4D" shadow="#A89B7A" size="sm">
          <ArrowLeft size={10} strokeWidth={4} style={{ display: 'inline', verticalAlign: 'middle' }} /> BACK
        </PixelButton>
        <div style={{
          background: topic.bg, color: topic.color || '#1A2B4D',
          padding: '10px 16px',
          boxShadow: `inset -4px -4px 0 0 ${topic.shadow}, inset 4px 4px 0 0 rgba(255,255,255,0.3)`,
          fontFamily: "'Press Start 2P', monospace", fontSize: 18, letterSpacing: '2px',
          display: 'inline-flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 24 }}>{topic.letter}</span> {topic.name}
        </div>
        <div style={{ flex: 1 }} />
        <PixelButton onClick={onAdd} color="#FFD83D" textColor="#1A2B4D" shadow="#C99A00" size="sm">
          <Plus size={10} strokeWidth={4} style={{ display: 'inline', verticalAlign: 'middle' }} /> ADD ONE
        </PixelButton>
      </div>

      {topicResources.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          fontFamily: "'VT323', monospace", fontSize: 22, color: '#7A6E5A',
        }}>
          no resources here yet. be the first to drop one.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20,
        }}>
          {topicResources.map(r => (
            <ResourceCard key={r.id} resource={r} onStar={onStar} />
          ))}
        </div>
      )}
    </section>
  );
}

// --- Topic grid (home) ---
function TopicGrid({ resources, onSelect }) {
  return (
    <section id="topics" style={{ padding: '60px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{
          fontFamily: "'Press Start 2P', monospace", fontSize: 22, color: '#1A2B4D',
          margin: 0, letterSpacing: '2px',
        }}>
          PICK YOUR QUEST
        </h2>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: 19, color: '#7A6E5A', marginTop: 10 }}>
          a curated stash for every domain
        </p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 22,
      }}>
        {TOPICS.map(t => (
          <TopicCard
            key={t.id}
            topic={t}
            count={resources.filter(r => r.topic === t.id && r.status !== 'rejected').length}
            onClick={() => onSelect(t)}
          />
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      background: '#1A2B4D', color: '#FAF6EC', padding: '32px 24px', textAlign: 'center',
      borderTop: '4px solid #000820',
    }}>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, letterSpacing: '1px', color: '#FFD83D' }}>
        ★ EVERY EXPERT WAS A BEGINNER ★
      </div>
      <div style={{ fontFamily: "'VT323', monospace", fontSize: 16, marginTop: 12, color: '#7FC7E8' }}>
        polymath.quest · made for the perpetually curious
      </div>
    </footer>
  );
}

// --- Main app ---
export default function PolymathQuest() {
  const [view, setView] = useState('home');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [resources, setResources] = useState([]);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load resources from storage on mount; seed if empty
  useEffect(() => {
    (async () => {
      try {
        const stored = await window.storage.get('polymath:resources');
        if (stored?.value) {
          setResources(JSON.parse(stored.value));
        } else {
          setResources(SEED);
          await window.storage.set('polymath:resources', JSON.stringify(SEED));
        }
      } catch (err) {
        // Key doesn't exist or storage error — seed it
        setResources(SEED);
        try { await window.storage.set('polymath:resources', JSON.stringify(SEED)); } catch (e) {}
      }
      setLoaded(true);
    })();
  }, []);

  // Persist resources whenever they change
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await window.storage.set('polymath:resources', JSON.stringify(resources));
      } catch (err) { console.error(err); }
    })();
  }, [resources, loaded]);

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setView('topic');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setView('home');
    setSelectedTopic(null);
  };

  const handleAddResource = (r) => {
    setResources(prev => [r, ...prev]);
  };

  const handleStar = (id) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, stars: r.stars + 1 } : r));
  };

  const browseScroll = () => {
    const el = document.getElementById('topics');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAF6EC',
      backgroundImage: 'radial-gradient(circle, #E8DFC4 1px, transparent 1px)',
      backgroundSize: '8px 8px',
      fontFamily: "'VT323', monospace",
      color: '#1A2B4D',
      imageRendering: 'pixelated',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .pixel-sun { animation: bob 3s ease-in-out infinite; }
        .pixel-btn:hover:not(:disabled) { transform: translate(-1px, -1px); filter: brightness(1.05); }
        .pixel-btn:active:not(:disabled) { transform: translate(2px, 2px); box-shadow: inset 4px 4px 0 0 rgba(0,0,0,0.2) !important; }
        .topic-card { transition: transform 0.08s ease, filter 0.08s ease; }
        .topic-card:hover { transform: translate(-2px, -2px); filter: brightness(1.08) saturate(1.1); }
        .topic-card:active { transform: translate(3px, 3px); filter: brightness(0.95); }
        .resource-title:hover { color: #FF7E6B !important; }
        input:focus, select:focus, textarea:focus { box-shadow: inset 3px 3px 0 0 #A89B7A, inset -3px -3px 0 0 #FFFFFF, 0 0 0 3px #FF7E6B !important; }
        ::selection { background: #FFD83D; color: #1A2B4D; }
      `}</style>

      <Header totalResources={resources.length} onAdd={() => setSubmitOpen(true)} />

      {view === 'home' && (
        <>
          <Hero onBrowse={browseScroll} />
          <TopicGrid resources={resources} onSelect={handleSelectTopic} />
        </>
      )}

      {view === 'topic' && selectedTopic && (
        <TopicView
          topic={selectedTopic}
          resources={resources}
          onBack={handleBack}
          onAdd={() => setSubmitOpen(true)}
          onStar={handleStar}
        />
      )}

      <Footer />

      <SubmitModal
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        onSubmit={handleAddResource}
        defaultTopic={selectedTopic?.id}
      />
    </div>
  );
}
