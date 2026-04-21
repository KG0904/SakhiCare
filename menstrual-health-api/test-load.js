/**
 * test-load.js — Verifies that all modules load without errors.
 * Run: node test-load.js
 */

try {
  // Test all models load
  console.log('Loading models...');
  const User = require('./models/User');
  console.log('  ✅ User model loaded');
  const Cycle = require('./models/Cycle');
  console.log('  ✅ Cycle model loaded');
  const Health = require('./models/Health');
  console.log('  ✅ Health model loaded');
  const Quote = require('./models/Quote');
  console.log('  ✅ Quote model loaded');

  // Test all controllers load
  console.log('\nLoading controllers...');
  const authCtrl = require('./controllers/authController');
  console.log('  ✅ authController loaded — exports:', Object.keys(authCtrl));
  const cycleCtrl = require('./controllers/cycleController');
  console.log('  ✅ cycleController loaded — exports:', Object.keys(cycleCtrl));
  const predCtrl = require('./controllers/predictionController');
  console.log('  ✅ predictionController loaded — exports:', Object.keys(predCtrl));
  const healthCtrl = require('./controllers/healthController');
  console.log('  ✅ healthController loaded — exports:', Object.keys(healthCtrl));
  const chatCtrl = require('./controllers/chatbotController');
  console.log('  ✅ chatbotController loaded — exports:', Object.keys(chatCtrl));

  // Test all middleware loads
  console.log('\nLoading middleware...');
  const protect = require('./middleware/auth');
  console.log('  ✅ auth middleware loaded');
  const errorHandler = require('./middleware/errorHandler');
  console.log('  ✅ errorHandler middleware loaded');

  // Test all routes load
  console.log('\nLoading routes...');
  const authRoutes = require('./routes/authRoutes');
  console.log('  ✅ authRoutes loaded');
  const cycleRoutes = require('./routes/cycleRoutes');
  console.log('  ✅ cycleRoutes loaded');
  const predRoutes = require('./routes/predictionRoutes');
  console.log('  ✅ predictionRoutes loaded');
  const healthRoutes = require('./routes/healthRoutes');
  console.log('  ✅ healthRoutes loaded');
  const chatRoutes = require('./routes/chatbotRoutes');
  console.log('  ✅ chatbotRoutes loaded');

  // Verify schema fields
  console.log('\n--- Schema Verification ---');
  console.log('User fields:', Object.keys(User.schema.paths));
  console.log('Cycle fields:', Object.keys(Cycle.schema.paths));
  console.log('Health fields:', Object.keys(Health.schema.paths));
  console.log('Quote fields:', Object.keys(Quote.schema.paths));

  console.log('\n🎉 ALL MODULES LOADED SUCCESSFULLY — No errors!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ ERROR:', error.message);
  console.error(error.stack);
  process.exit(1);
}
