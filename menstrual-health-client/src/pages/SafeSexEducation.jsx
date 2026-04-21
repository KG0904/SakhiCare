/**
 * SafeSexEducation — Comprehensive, non-judgmental safe sex education section.
 */
const SafeSexEducation = () => {
  const sections = [
    {
      icon: '🛡️',
      title: 'Why Safe Sex Matters',
      content: 'Safe sex practices protect you and your partner from sexually transmitted infections (STIs) and unintended pregnancies. Open communication, mutual consent, and using protection are the foundations of healthy sexual relationships.',
    },
    {
      icon: '🔒',
      title: 'Barrier Methods',
      content: 'These methods physically prevent contact with bodily fluids:',
      list: [
        'External condoms (male condoms): 98% effective when used correctly. Protects against STIs and pregnancy.',
        'Internal condoms (female condoms): Can be inserted up to 8 hours before intercourse.',
        'Dental dams: Thin latex sheets used during oral sex to prevent STI transmission.',
        'Always check expiration dates and store condoms properly (cool, dry place).',
      ],
    },
    {
      icon: '💊',
      title: 'Hormonal Contraception',
      content: 'These methods prevent pregnancy but do NOT protect against STIs:',
      list: [
        'Birth control pills: Taken daily; highly effective when consistent.',
        'Hormonal IUD: Long-term (3–7 years); placed by a healthcare provider.',
        'Implant (e.g., Nexplanon): Inserted in the arm; lasts up to 3 years.',
        'Injection (Depo-Provera): Given every 3 months.',
        'Patch & Ring: Applied weekly (patch) or monthly (ring).',
        'Always consult a healthcare provider before starting hormonal contraception.',
      ],
    },
    {
      icon: '🔍',
      title: 'STI Awareness',
      content: 'Common STIs include chlamydia, gonorrhea, HPV, herpes, syphilis, and HIV. Many STIs have no visible symptoms, so regular testing is important.',
      list: [
        'Get tested regularly if you are sexually active — at least once a year.',
        'Many STIs are curable with antibiotics (chlamydia, gonorrhea, syphilis).',
        'HPV vaccine is recommended and can prevent cervical cancer.',
        'HIV is manageable with antiretroviral therapy (ART) — early detection matters.',
        'Talk openly with partners about testing and sexual health history.',
      ],
    },
    {
      icon: '💬',
      title: 'Communication & Consent',
      content: 'Healthy sexual relationships are built on:',
      list: [
        'Consent: Must be enthusiastic, ongoing, and freely given. "No" means no.',
        'Honest communication about boundaries, desires, and comfort levels.',
        'Discussing contraception and STI prevention together before intimacy.',
        'Respecting your partner\'s choices and never pressuring anyone.',
        'Checking in during intimacy — consent is continuous, not a one-time thing.',
      ],
    },
    {
      icon: '🆘',
      title: 'Emergency Options',
      content: 'If protection fails or unprotected sex occurs:',
      list: [
        'Emergency contraception (morning-after pill): Most effective within 72 hours.',
        'Copper IUD: Can be inserted within 5 days as emergency contraception.',
        'Get tested for STIs 2 weeks after potential exposure.',
        'If you suspect pregnancy, take a test after your missed period.',
        'Contact a healthcare provider for guidance — no question is too small.',
      ],
    },
  ];

  return (
    <div className="page">
      <h1 className="section-title">🛡️ Safe Sex Education</h1>
      <p className="section-subtitle">Comprehensive, non-judgmental information to help you make informed decisions.</p>

      {sections.map((section, i) => (
        <div className="info-card" key={i}>
          <h3>{section.icon} {section.title}</h3>
          <p>{section.content}</p>
          {section.list && (
            <ul>
              {section.list.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <div className="alert alert-info mt-2">
        <span className="alert-icon">🏥</span>
        <span>This information is for educational purposes only. Always consult a qualified healthcare provider for personalized medical advice.</span>
      </div>
    </div>
  );
};

export default SafeSexEducation;
