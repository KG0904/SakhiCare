import { useState } from 'react';

/**
 * PregnancyMode — Pregnancy timeline with week-by-week baby size (fruit analogy),
 * development milestones, and health tips.
 */

const pregnancyData = [
  { week: 4, fruit: '🌰', size: 'Poppy Seed', dev: 'The embryo implants into the uterine wall. Cells begin to differentiate.', tip: 'Start taking prenatal vitamins with folic acid.' },
  { week: 6, fruit: '🫐', size: 'Blueberry', dev: 'Heart begins to beat. Neural tube is forming.', tip: 'Stay hydrated and avoid raw or undercooked food.' },
  { week: 8, fruit: '🫒', size: 'Olive', dev: 'Fingers and toes start forming. Baby moves but you can\'t feel it yet.', tip: 'Schedule your first prenatal check-up.' },
  { week: 10, fruit: '🍇', size: 'Grape', dev: 'All vital organs have formed. Teeth are developing under the gums.', tip: 'Eat iron-rich foods to support blood volume increase.' },
  { week: 12, fruit: '🍋', size: 'Lime', dev: 'Baby can open and close hands. Reflexes are developing.', tip: 'First trimester screening can be done now.' },
  { week: 16, fruit: '🥑', size: 'Avocado', dev: 'Baby can make facial expressions. Skeleton starts hardening.', tip: 'You may start feeling fluttering movements (quickening).' },
  { week: 20, fruit: '🍌', size: 'Banana', dev: 'Baby can hear sounds. Halfway through the pregnancy!', tip: 'Mid-pregnancy ultrasound (anatomy scan) recommended.' },
  { week: 24, fruit: '🌽', size: 'Corn', dev: 'Lungs are developing. Baby has a regular sleep cycle.', tip: 'Watch for signs of gestational diabetes.' },
  { week: 28, fruit: '🍆', size: 'Eggplant', dev: 'Eyes can open and close. Brain activity increases significantly.', tip: 'Start counting kicks. Third trimester begins!' },
  { week: 32, fruit: '🥥', size: 'Coconut', dev: 'Bones are fully formed but still soft. Baby practices breathing.', tip: 'Prepare your hospital bag and birth plan.' },
  { week: 36, fruit: '🍈', size: 'Honeydew', dev: 'Baby drops lower into pelvis. Lungs are nearly mature.', tip: 'Weekly check-ups begin. Rest as much as possible.' },
  { week: 40, fruit: '🍉', size: 'Watermelon', dev: 'Baby is full-term and ready to meet the world!', tip: 'Look out for labor signs: contractions, water breaking.' },
];

const PregnancyMode = () => {
  const [selectedWeek, setSelectedWeek] = useState(null);

  return (
    <div className="page">
      <h1 className="section-title">🤰 Pregnancy Journey</h1>
      <p className="section-subtitle">Week-by-week guide with baby size, development milestones, and health tips.</p>

      {/* Week selector tabs */}
      <div className="tabs">
        {pregnancyData.map((item) => (
          <button
            key={item.week}
            className={`tab ${selectedWeek === item.week ? 'active' : ''}`}
            onClick={() => setSelectedWeek(selectedWeek === item.week ? null : item.week)}
          >
            Wk {item.week}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="timeline">
        {pregnancyData
          .filter((item) => selectedWeek === null || item.week === selectedWeek)
          .map((item) => (
            <div className="timeline-item" key={item.week}>
              <div className="timeline-dot" />
              <div className="timeline-card">
                <div className="timeline-fruit">{item.fruit}</div>
                <h4>Week {item.week} — Baby is the size of a {item.size}</h4>
                <p style={{ marginBottom: 8 }}><strong>Development:</strong> {item.dev}</p>
                <div className="alert alert-info" style={{ marginBottom: 0 }}>
                  <span className="alert-icon">💡</span>
                  <span><strong>Tip:</strong> {item.tip}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PregnancyMode;
