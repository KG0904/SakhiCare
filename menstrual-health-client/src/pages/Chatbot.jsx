import { useState, useRef, useEffect } from 'react';
import API from '../api';
import { FiSend, FiInfo } from 'react-icons/fi';

/**
 * Chatbot (Phase 5) — Enhanced chat UI with:
 * - AI-powered responses (via backend → OpenAI or smart mock)
 * - Rich local fallback for anonymous mode
 * - Medical disclaimer on every response
 * - Typing animation, quick suggestions, auto-scroll
 */

const DISCLAIMER = '\n\n⚕️ Disclaimer: This is not medical advice. Always consult a qualified healthcare provider for diagnosis and treatment.';

// Enhanced local responses for anonymous / offline mode
const localResponses = {
  period: '🌸 Your menstrual cycle is a natural and healthy process! A typical period lasts 3–7 days, and cycles usually range from 21–35 days. Tracking your cycle helps you understand your body\'s unique pattern.',
  late: '⏰ A late period can happen for many reasons: stress, weight changes, excessive exercise, travel, or hormonal fluctuations. If your period is more than a week late, consider taking a pregnancy test or consulting your doctor.',
  heavy: '🩸 Heavy periods (menorrhagia) mean soaking through a pad/tampon every hour. This can sometimes indicate fibroids or hormonal imbalances. Please see your doctor if you experience consistently heavy bleeding.',
  cramps: '💆 To ease menstrual cramps, try:\n• Apply a warm heating pad to your lower abdomen\n• Take a warm bath\n• Try gentle yoga poses like child\'s pose\n• Stay hydrated and eat anti-inflammatory foods\n• Light exercise can actually help reduce pain',
  pms: '🌊 PMS affects up to 75% of menstruating people. Symptoms include mood swings, bloating, fatigue, and cravings. Regular exercise, balanced nutrition, and adequate sleep can help reduce symptoms.',
  ovulation: '🥚 Ovulation typically occurs around day 14 of a 28-day cycle (14 days before your next period). Signs include clear stretchy cervical mucus, slight temperature rise, and mild lower abdominal pain. This is your most fertile time!',
  fertile: '✨ Your fertile window is typically 5 days before ovulation through 1 day after. If you\'re trying to conceive, focus on the 2–3 days before ovulation.',
  pcos: '🔬 PCOS (Polycystic Ovary Syndrome) affects 1 in 10 women. Symptoms include irregular periods, excess androgen, and polycystic ovaries. Management includes balanced diet (low GI foods), regular exercise, and stress reduction.',
  pcod: '🩺 PCOD management tips: eat a balanced anti-inflammatory diet, exercise 30+ minutes most days, maintain healthy weight, manage stress, and get regular check-ups with your gynecologist.',
  thyroid: '🦋 Thyroid imbalances affect your cycle — hypothyroidism causes heavy/prolonged periods, while hyperthyroidism causes light/infrequent periods. Get your TSH, T3, T4 levels checked if you notice cycle changes.',
  pregnant: '🤰 Early pregnancy signs: missed period, nausea, breast tenderness, fatigue, frequent urination, and light spotting. Take a home test after your missed period, then visit your healthcare provider for confirmation.',
  diet: '🥗 Menstrual-health-friendly foods: iron-rich spinach & lentils, omega-3 from salmon & walnuts, calcium from dairy, complex carbs from whole grains. Limit caffeine, alcohol, salt, and processed sugar during your period.',
  exercise: '🏃‍♀️ Match exercise to your cycle: light walks & yoga during periods, cardio during follicular phase, HIIT around ovulation, and moderate activities in the luteal phase. Regular exercise reduces PMS by up to 30%!',
  stress: '🧘 Stress directly impacts your cycle by affecting hormones. Try: deep breathing (4-7-8 technique), meditation, regular physical activity, 7–9 hours sleep, journaling, and spending time in nature.',
  sleep: '😴 During the luteal phase, progesterone rises making you sleepier. Aim for 7–9 hours, keep a consistent schedule, avoid screens before bed, and try a warm bath for both sleep and cramp relief.',
  hygiene: '🧼 Change pads every 4–6 hours, tampons every 4–8 hours. Menstrual cups can be worn up to 12 hours. Wash external area with plain water, wear breathable cotton underwear, and always wash hands.',
};

const DEFAULT_RESPONSE = '🌸 I\'m here to help with menstrual health questions! You can ask me about:\n• Period symptoms and cramps\n• Ovulation and fertility\n• PCOS, PCOD, or thyroid\n• Diet and exercise tips\n• Pregnancy signs\n• Stress and sleep\n\nWhat would you like to know?';

const isAnon = () => localStorage.getItem('token')?.startsWith('anon_');

const getLocalReply = (msg) => {
  const lower = msg.toLowerCase();

  // Check for greetings
  if (/^(hi|hello|hey|hola|namaste)/i.test(lower)) {
    return '👋 Hello! I\'m your SakhiCare assistant. Ask me about periods, ovulation, PCOS, diet, exercise, and more!' + DISCLAIMER;
  }
  if (/thank|thanks/i.test(lower)) {
    return '😊 You\'re welcome! Remember, taking care of your health is important. Feel free to ask anything else!' + DISCLAIMER;
  }

  for (const [keyword, response] of Object.entries(localResponses)) {
    if (lower.includes(keyword)) return response + DISCLAIMER;
  }
  return DEFAULT_RESPONSE + DISCLAIMER;
};

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi there! 🌸 I'm your SakhiCare health assistant. I can answer questions about periods, ovulation, PCOS, diet, exercise, pregnancy, and more.\n\nTry asking me something!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      let reply;

      if (isAnon()) {
        reply = getLocalReply(userMsg);
      } else {
        const res = await API.post('/chatbot', { message: userMsg });
        reply = res.data.data.botReply;
      }

      // Simulate typing delay for natural feel
      const delay = Math.min(600 + reply.length * 2, 2000);
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
        setIsTyping(false);
        inputRef.current?.focus();
      }, delay);
    } catch {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: "Sorry, I couldn't process that right now. Please try again." + DISCLAIMER },
        ]);
        setIsTyping(false);
      }, 400);
    }
  };

  const handleSuggestion = (text) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const suggestions = [
    '💆 Period cramps relief',
    '🔬 What is PCOS?',
    '🥚 Ovulation signs',
    '🥗 Diet tips',
    '🧘 Stress & cycles',
    '🤰 Pregnancy signs',
    '🧼 Hygiene tips',
  ];

  return (
    <div className="page" style={{ padding: '0 16px' }}>
      <div className="chat-container">
        {/* Header */}
        <div style={{ padding: '20px 0 8px', borderBottom: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            💬 SakhiCare Assistant
            {isAnon() && <span className="badge badge-mint" style={{ fontSize: '0.7rem' }}>Offline</span>}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <FiInfo size={12} /> Ask about periods, health conditions, diet, and more
          </p>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.sender}`}>
              {msg.text.split('\n').map((line, j) => (
                <span key={j}>
                  {line}
                  {j < msg.text.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="chat-bubble bot" style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '14px 20px' }}>
              <span className="typing-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1s ease-in-out infinite', animationDelay: '0s' }} />
              <span className="typing-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1s ease-in-out infinite', animationDelay: '0.2s' }} />
              <span className="typing-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1s ease-in-out infinite', animationDelay: '0.4s' }} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick suggestions (show when few messages) */}
        {messages.length <= 3 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '8px 0' }}>
            {suggestions.map((s) => (
              <button
                key={s}
                className="badge badge-pink"
                style={{ cursor: 'pointer', padding: '6px 14px', fontSize: '0.8rem', transition: 'all 0.2s' }}
                onClick={() => handleSuggestion(s)}
                onMouseOver={(e) => { e.target.style.background = 'var(--primary)'; e.target.style.color = 'white'; }}
                onMouseOut={(e) => { e.target.style.background = ''; e.target.style.color = ''; }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <form className="chat-input-area" onSubmit={sendMessage}>
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Ask me about periods, PCOS, diet..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button type="submit" className="chat-send-btn" disabled={isTyping || !input.trim()}>
            <FiSend />
          </button>
        </form>

        {/* Disclaimer footer */}
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', padding: '4px 0 8px' }}>
          ⚕️ Responses are for informational purposes only — not medical advice.
        </p>
      </div>
    </div>
  );
};

export default Chatbot;
