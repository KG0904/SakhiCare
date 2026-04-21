/**
 * controllers/chatbotController.js - AI-Powered Chatbot (Phase 5)
 *
 * Two modes:
 *   1. OpenAI Mode — If OPENAI_API_KEY is set in .env, uses GPT for responses
 *   2. Smart Mock Mode — Falls back to an enhanced keyword+context engine
 *
 * Safety: Every response includes a medical disclaimer.
 */

const OpenAI = require('openai');

// --------------- Disclaimer appended to every response ---------------
const DISCLAIMER = '\n\n⚕️ Disclaimer: This is not medical advice. Always consult a qualified healthcare provider for diagnosis and treatment.';

// --------------- OpenAI Setup ---------------
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log('🤖 Chatbot: OpenAI mode active');
} else {
  console.log('🤖 Chatbot: Mock mode active (set OPENAI_API_KEY in .env for AI responses)');
}

// --------------- System Prompt for OpenAI ---------------
const SYSTEM_PROMPT = `You are SakhiCare Assistant, a helpful, empathetic, and knowledgeable menstrual health chatbot.

Your role:
- Answer questions about menstrual cycles, periods, ovulation, fertility, and pregnancy
- Provide general guidance on PCOS, PCOD, thyroid conditions related to menstrual health
- Offer diet, exercise, and lifestyle tips for menstrual wellness
- Explain concepts in simple, supportive, non-judgmental language
- Be inclusive and respectful of all gender identities

Rules:
- NEVER provide medical diagnosis or prescribe medication
- ALWAYS remind users to consult a healthcare provider for medical concerns
- Keep responses concise (2-4 paragraphs max)
- Use a warm, caring, supportive tone
- Include relevant emojis to make responses friendly
- If asked about something outside menstrual/reproductive health, politely redirect`;

// --------------- Enhanced Smart Mock Responses ---------------
// Categorized responses with multiple variations for natural feel
const smartResponses = {
  // Period-related
  period: [
    '🌸 Your menstrual cycle is a natural and healthy process! A typical period lasts 3–7 days, and cycles usually range from 21–35 days. Tracking your cycle helps you understand your body\'s unique pattern.',
    '📅 Periods happen when the uterine lining sheds because pregnancy didn\'t occur that cycle. It\'s completely normal and a sign that your reproductive system is working. Every body is different, so your cycle may not look like anyone else\'s!',
  ],
  late: [
    '⏰ A late period can happen for many reasons: stress, weight changes, excessive exercise, travel, illness, or hormonal fluctuations. If your period is more than a week late and you\'re sexually active, consider taking a pregnancy test. If irregularity persists, consult your doctor.',
  ],
  heavy: [
    '🩸 Heavy periods (menorrhagia) mean soaking through a pad/tampon every hour for several hours, or periods lasting more than 7 days. This can sometimes indicate fibroids, polyps, or hormonal imbalances. Please see your doctor if you experience consistently heavy bleeding.',
  ],
  cramps: [
    '💆 Menstrual cramps (dysmenorrhea) happen when your uterus contracts to shed its lining. To ease cramps, try:\n• Apply a warm heating pad to your lower abdomen\n• Take a warm bath\n• Try gentle yoga poses like child\'s pose or cat-cow\n• Stay hydrated and eat anti-inflammatory foods\n• OTC pain relievers like ibuprofen can help (taken with food)',
    '🧘 Cramps are your uterine muscles working — it\'s normal but shouldn\'t be unbearable. Light exercise, deep breathing, and warmth can help significantly. If cramps are severe enough to affect daily life, please talk to your healthcare provider.',
  ],
  pms: [
    '🌊 PMS (Premenstrual Syndrome) affects up to 75% of menstruating people. Symptoms include mood swings, bloating, fatigue, breast tenderness, and cravings. They typically start 1–2 weeks before your period. Regular exercise, balanced nutrition, adequate sleep, and stress management can help reduce PMS symptoms.',
  ],
  // Ovulation & Fertility
  ovulation: [
    '🥚 Ovulation is when an egg is released from your ovary, usually around day 14 of a 28-day cycle (or 14 days before your next period). Signs of ovulation include:\n• Clear, stretchy cervical mucus (like egg whites)\n• Slight rise in basal body temperature\n• Mild lower abdominal pain (mittelschmerz)\n• Increased libido\n\nOvulation is your most fertile time!',
  ],
  fertile: [
    '✨ Your fertile window is typically 5 days before ovulation through 1 day after. Sperm can survive up to 5 days in the reproductive tract, but the egg only lives 12–24 hours after release. If you\'re trying to conceive, focus on the 2–3 days before ovulation.',
  ],
  // PCOS / PCOD
  pcos: [
    '🔬 PCOS (Polycystic Ovary Syndrome) is a hormonal disorder affecting 1 in 10 women of reproductive age. Symptoms include:\n• Irregular or missed periods\n• Excess androgen (acne, facial hair)\n• Polycystic ovaries on ultrasound\n• Weight gain, especially around the abdomen\n\nManagement includes balanced diet (low GI foods), regular exercise, stress reduction, and sometimes medication. Early management can prevent long-term complications.',
  ],
  pcod: [
    '🩺 PCOD (Polycystic Ovary Disease) is closely related to PCOS. The ovaries produce many immature eggs that may form cysts. Key management tips:\n• Eat a balanced, anti-inflammatory diet\n• Exercise 30+ minutes most days\n• Maintain a healthy weight\n• Manage stress levels\n• Get regular check-ups with your gynecologist\n\nWith proper lifestyle changes, many people manage PCOD effectively.',
  ],
  // Thyroid
  thyroid: [
    '🦋 Thyroid imbalances significantly affect your menstrual cycle:\n• Hypothyroidism (underactive): Heavy, prolonged, or frequent periods\n• Hyperthyroidism (overactive): Light, infrequent, or missed periods\n\nIf you notice cycle changes along with fatigue, weight changes, or temperature sensitivity, get your thyroid levels (TSH, T3, T4) checked. Thyroid conditions are very manageable with proper medication.',
  ],
  // Pregnancy
  pregnant: [
    '🤰 Early pregnancy signs include:\n• Missed period\n• Nausea (morning sickness)\n• Breast tenderness and swelling\n• Fatigue\n• Frequent urination\n• Light spotting (implantation bleeding)\n\nIf you suspect pregnancy, take a home test after your missed period. For confirmation, visit your healthcare provider for a blood test and ultrasound.',
  ],
  // Lifestyle
  diet: [
    '🥗 A menstrual-health-friendly diet includes:\n• Iron-rich foods: spinach, lentils, red meat, beans (replenish iron lost during periods)\n• Omega-3 fatty acids: salmon, walnuts, flaxseed (reduce inflammation)\n• Calcium & Vitamin D: dairy, fortified foods (ease PMS)\n• Complex carbs: whole grains, sweet potatoes (stabilize mood)\n• Hydration: 8+ glasses of water daily\n• Limit: caffeine, alcohol, salt, and processed sugar during your period',
  ],
  exercise: [
    '🏃‍♀️ Exercise and your cycle work together:\n• During your period: Light walks, yoga, swimming — helps with cramps\n• Follicular phase: Energy rises — great for cardio and strength training\n• Ovulation: Peak energy — try HIIT or challenging workouts\n• Luteal phase: Energy dips — stick to moderate activities, pilates, stretching\n\nRegular exercise reduces PMS symptoms by up to 30%!',
  ],
  stress: [
    '🧘 Stress directly impacts your cycle through the hypothalamus-pituitary-ovarian axis. High cortisol can delay or stop ovulation, causing irregular periods. Stress-management techniques:\n• Deep breathing (4-7-8 technique)\n• Meditation and mindfulness\n• Regular physical activity\n• Adequate sleep (7–9 hours)\n• Journaling\n• Spending time in nature',
  ],
  sleep: [
    '😴 Sleep and your menstrual cycle are deeply connected. During the luteal phase (before your period), progesterone rises and can make you sleepier. Tips:\n• Aim for 7–9 hours per night\n• Keep a consistent sleep schedule\n• Avoid screens 1 hour before bed\n• Use a cool, dark room\n• A warm bath before bed can help with both sleep and cramps',
  ],
  // Hygiene
  hygiene: [
    '🧼 Menstrual hygiene tips:\n• Change pads every 4–6 hours, tampons every 4–8 hours\n• Menstrual cups can be worn up to 12 hours (clean between uses)\n• Wash the external area with plain water — avoid douching\n• Wear breathable cotton underwear\n• Wash hands before and after changing products\n• Dispose of products properly (never flush)',
  ],
};

// Default response when no keyword matches
const DEFAULT_RESPONSES = [
  '🌸 I\'m here to help with menstrual health questions! You can ask me about:\n• Period symptoms and cramps\n• Ovulation and fertility\n• PCOS, PCOD, or thyroid conditions\n• Diet and exercise tips\n• Pregnancy signs\n• Stress and sleep\n\nWhat would you like to know?',
];

/**
 * Get a smart mock response by matching keywords in the message.
 * Returns a random variation if multiple responses exist for that topic.
 */
const getSmartResponse = (message) => {
  const lower = message.toLowerCase();

  // Check each keyword category
  for (const [keyword, responses] of Object.entries(smartResponses)) {
    if (lower.includes(keyword)) {
      // Pick a random response from the array for variety
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Check for greeting patterns
  if (/^(hi|hello|hey|hola|namaste)/i.test(lower)) {
    return '👋 Hello! I\'m your SakhiCare assistant. I can help you with questions about periods, ovulation, PCOS, diet, exercise, and more. What would you like to know?';
  }

  if (/thank|thanks/i.test(lower)) {
    return '😊 You\'re welcome! Remember, taking care of your health is important. Feel free to ask me anything else!';
  }

  return DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
};

// --------------- Chat Handler ---------------
// POST /chatbot
const chat = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message',
      });
    }

    let botReply;
    let mode;

    // Try OpenAI if available
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: message },
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        botReply = completion.choices[0].message.content + DISCLAIMER;
        mode = 'ai';
      } catch (aiError) {
        // If OpenAI fails, fall back to smart mock
        console.warn('⚠️ OpenAI API error, falling back to mock:', aiError.message);
        botReply = getSmartResponse(message) + DISCLAIMER;
        mode = 'mock-fallback';
      }
    } else {
      // No API key — use smart mock
      botReply = getSmartResponse(message) + DISCLAIMER;
      mode = 'mock';
    }

    res.status(200).json({
      success: true,
      data: {
        userMessage: message,
        botReply,
        mode, // 'ai', 'mock', or 'mock-fallback'
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { chat };
