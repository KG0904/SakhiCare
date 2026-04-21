/**
 * MaleEducation — Simple, respectful explanation of menstruation
 * designed for male readers to build understanding and empathy.
 */
const MaleEducation = () => {
  const sections = [
    {
      icon: '🔬',
      title: 'What Is Menstruation?',
      content: 'Menstruation (commonly called a "period") is a natural biological process where the lining of the uterus sheds each month. It\'s the body\'s way of preparing for pregnancy — when pregnancy doesn\'t occur, the uterine lining exits through the vagina as blood. This cycle typically lasts 3–7 days and repeats approximately every 28–35 days.',
    },
    {
      icon: '📅',
      title: 'The Menstrual Cycle Explained',
      content: 'The cycle has four key phases:',
      list: [
        'Menstrual Phase (Days 1–5): Period bleeding occurs. Energy levels may be lower.',
        'Follicular Phase (Days 1–13): The body prepares an egg for release. Estrogen rises.',
        'Ovulation (Day 14): An egg is released from the ovary. This is the most fertile period.',
        'Luteal Phase (Days 15–28): The body prepares for potential pregnancy. If no pregnancy, the cycle restarts.',
      ],
    },
    {
      icon: '💪',
      title: 'Common Symptoms',
      content: 'Many people experience these symptoms before or during their period:',
      list: [
        'Cramps (abdominal pain) — caused by uterine contractions',
        'Bloating and water retention',
        'Mood swings due to hormonal changes',
        'Fatigue and low energy',
        'Headaches or back pain',
        'Food cravings or appetite changes',
      ],
    },
    {
      icon: '🤝',
      title: 'How You Can Be Supportive',
      content: 'Understanding goes a long way. Here\'s how you can help:',
      list: [
        'Be patient — mood changes are real and not within someone\'s control.',
        'Offer comfort: a warm drink, heating pad, or just lending an ear.',
        'Don\'t make jokes or dismissive comments about periods.',
        'Educate yourself — you\'re already doing this by reading here!',
        'Keep menstrual products at home if you live with someone who menstruates.',
        'Treat it as normal — because it is. Half the world experiences it.',
      ],
    },
    {
      icon: '❌',
      title: 'Common Myths Debunked',
      content: '',
      list: [
        'Myth: Periods are "dirty" or "impure." — Fact: It\'s a healthy biological process.',
        'Myth: You can\'t exercise during periods. — Fact: Light exercise actually helps reduce cramps.',
        'Myth: PMS is exaggerated. — Fact: Hormonal changes cause real physical and emotional symptoms.',
        'Myth: You can\'t get pregnant on your period. — Fact: It\'s unlikely but possible, especially with short cycles.',
        'Myth: Periods sync up between friends. — Fact: Studies have not confirmed this.',
      ],
    },
  ];

  return (
    <div className="page">
      <h1 className="section-title">📘 Understanding Periods</h1>
      <p className="section-subtitle">A respectful, simple guide to menstruation — for everyone.</p>

      {sections.map((section, i) => (
        <div className="info-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
          <h3>{section.icon} {section.title}</h3>
          {section.content && <p>{section.content}</p>}
          {section.list && (
            <ul>
              {section.list.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default MaleEducation;
