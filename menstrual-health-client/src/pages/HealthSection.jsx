import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getHealth, updateHealth } from '../store/healthSlice';
import { FiHeart } from 'react-icons/fi';

/**
 * HealthSection — Toggle health conditions (PCOS, PCOD, Thyroid, Pregnant)
 * and view diet/lifestyle tips based on active conditions.
 */

const dietTips = {
  pcos: {
    title: '🥗 PCOS Diet & Lifestyle Tips',
    tips: [
      'Follow a low-glycemic index (GI) diet to regulate insulin levels.',
      'Include anti-inflammatory foods: berries, fatty fish, leafy greens, turmeric.',
      'Reduce refined carbs and added sugars — switch to whole grains.',
      'Exercise regularly: 30 minutes of moderate activity, 5 days a week.',
      'Manage stress with yoga, meditation, or deep breathing exercises.',
      'Get 7–9 hours of quality sleep each night.',
      'Consider supplements: inositol, vitamin D, omega-3 (consult your doctor).',
    ],
  },
  pcod: {
    title: '🍎 PCOD Diet & Lifestyle Tips',
    tips: [
      'Eat a balanced diet with plenty of fruits, vegetables, and lean proteins.',
      'Avoid processed and junk food — cook fresh meals when possible.',
      'Stay hydrated: drink at least 8 glasses of water daily.',
      'Include fiber-rich foods to aid digestion and hormone balance.',
      'Limit dairy and gluten if you notice they worsen symptoms.',
      'Regular physical activity like swimming, cycling, or brisk walking helps.',
      'Maintain a consistent sleep schedule for hormonal health.',
    ],
  },
  thyroid: {
    title: '🦋 Thyroid-Friendly Diet Tips',
    tips: [
      'Include iodine-rich foods: seafood, iodized salt, dairy products.',
      'Eat selenium-rich foods: Brazil nuts, eggs, sunflower seeds.',
      'Avoid excess soy products as they may interfere with thyroid medication.',
      'Cook cruciferous vegetables (broccoli, cauliflower) instead of eating them raw.',
      'Take thyroid medication on an empty stomach, 30–60 min before food.',
      'Monitor your caffeine intake — it can affect thyroid hormone absorption.',
      'Regular blood tests to check TSH, T3, and T4 levels are essential.',
    ],
  },
  pregnant: {
    title: '🤰 Pregnancy Nutrition Tips',
    tips: [
      'Take prenatal vitamins with folic acid (400–800 mcg daily).',
      'Eat iron-rich foods: spinach, lentils, lean red meat, fortified cereals.',
      'Get enough calcium: milk, yogurt, cheese, or calcium-fortified alternatives.',
      'Include DHA omega-3 for baby\'s brain development: fatty fish, walnuts.',
      'Avoid raw fish, unpasteurized dairy, and excessive caffeine.',
      'Eat small, frequent meals to manage nausea and heartburn.',
      'Stay active with gentle exercises: walking, swimming, prenatal yoga.',
    ],
  },
};

const HealthSection = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.health);

  useEffect(() => {
    dispatch(getHealth());
  }, [dispatch]);

  const handleToggle = (field) => {
    const currentValue = profile?.[field] || false;
    dispatch(updateHealth({ [field]: !currentValue }));
  };

  const toggleItems = [
    { key: 'hasPCOS', label: 'PCOS (Polycystic Ovary Syndrome)', icon: '🔬' },
    { key: 'hasPCOD', label: 'PCOD (Polycystic Ovary Disease)', icon: '🩺' },
    { key: 'hasThyroid', label: 'Thyroid Condition', icon: '🦋' },
    { key: 'isPregnant', label: 'Currently Pregnant', icon: '🤰' },
  ];

  // Map field names to dietTips keys
  const fieldToTipKey = { hasPCOS: 'pcos', hasPCOD: 'pcod', hasThyroid: 'thyroid', isPregnant: 'pregnant' };

  // Get active conditions for diet tips
  const activeConditions = toggleItems.filter((item) => profile?.[item.key]);

  return (
    <div className="page">
      <h1 className="section-title"><FiHeart /> Health Profile</h1>
      <p className="section-subtitle">Toggle your health conditions to receive personalized diet and lifestyle tips.</p>

      {/* Health Toggles */}
      <div className="mb-3">
        {toggleItems.map((item) => (
          <div className="health-toggle" key={item.key}>
            <label>{item.icon} {item.label}</label>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={profile?.[item.key] || false}
                onChange={() => handleToggle(item.key)}
                disabled={loading}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        ))}
      </div>

      {/* Diet Tips for Active Conditions */}
      {activeConditions.length > 0 ? (
        activeConditions.map((item) => {
          const tips = dietTips[fieldToTipKey[item.key]];
          return (
            <div className="info-card" key={item.key}>
              <h3>{tips.title}</h3>
              <ul>
                {tips.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          );
        })
      ) : (
        <div className="alert alert-info">
          <span className="alert-icon">💡</span>
          <span>Toggle any condition above to see personalized diet and lifestyle recommendations.</span>
        </div>
      )}
    </div>
  );
};

export default HealthSection;
