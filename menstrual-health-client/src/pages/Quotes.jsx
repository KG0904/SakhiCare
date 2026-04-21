import { useState } from 'react';

/**
 * Quotes — Daily motivational and health-awareness quotes.
 * Rotates through a curated set of quotes.
 */

const quotesList = [
  { text: 'Your body is your most priceless possession. Take care of it.', author: 'Jack LaLanne' },
  { text: 'Self-care is not selfish. You cannot serve from an empty vessel.', author: 'Eleanor Brownn' },
  { text: 'There is no power for change greater than a community discovering what it cares about.', author: 'Margaret Wheatley' },
  { text: 'The greatest wealth is health.', author: 'Virgil' },
  { text: 'You are allowed to be both a masterpiece and a work in progress simultaneously.', author: 'Sophia Bush' },
  { text: 'She remembered who she was and the game changed.', author: 'Lalah Delia' },
  { text: 'Your cycle is not a curse — it is a compass guiding you to listen to your body.', author: 'Unknown' },
  { text: 'Taking care of yourself makes you stronger for everyone in your life.', author: 'Kelly Rudolph' },
  { text: 'Wellness is the complete integration of body, mind, and spirit.', author: 'Greg Anderson' },
  { text: 'Rest when you need to. Your body is speaking — learn to listen.', author: 'Unknown' },
  { text: 'Every woman who heals herself helps heal all the women who came before her and all those who come after.', author: 'Christiane Northrup' },
  { text: 'Your health is an investment, not an expense.', author: 'Unknown' },
  { text: 'Be gentle with yourself. You are doing the best you can.', author: 'Unknown' },
  { text: 'A healthy outside starts from the inside.', author: 'Robert Urich' },
  { text: 'Knowing yourself is the beginning of all wisdom.', author: 'Aristotle' },
];

const Quotes = () => {
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * quotesList.length)
  );

  const nextQuote = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * quotesList.length);
    } while (newIndex === currentIndex && quotesList.length > 1);
    setCurrentIndex(newIndex);
  };

  const quote = quotesList[currentIndex];

  return (
    <div className="page flex-center" style={{ minHeight: 'calc(100vh - 140px)' }}>
      <div className="quote-card">
        <div className="quote-icon">✨</div>
        <blockquote>"{quote.text}"</blockquote>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
          — {quote.author}
        </p>
        <button className="quote-refresh" onClick={nextQuote}>
          ✦ New Quote
        </button>
      </div>
    </div>
  );
};

export default Quotes;
