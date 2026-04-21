import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import HealthSection from './pages/HealthSection';
import PregnancyMode from './pages/PregnancyMode';
import MaleEducation from './pages/MaleEducation';
import SafeSexEducation from './pages/SafeSexEducation';
import Quotes from './pages/Quotes';
import Chatbot from './pages/Chatbot';

/**
 * App — Root component with routing.
 * Protected routes redirect to /login if unauthenticated.
 * Auth pages redirect to / if already logged in.
 */
function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          {/* Auth routes — redirect to dashboard if already logged in */}
          <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={token ? <Navigate to="/" /> : <Signup />} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/health" element={<ProtectedRoute><HealthSection /></ProtectedRoute>} />
          <Route path="/pregnancy" element={<ProtectedRoute><PregnancyMode /></ProtectedRoute>} />
          <Route path="/education" element={<ProtectedRoute><MaleEducation /></ProtectedRoute>} />
          <Route path="/safe-sex" element={<ProtectedRoute><SafeSexEducation /></ProtectedRoute>} />
          <Route path="/quotes" element={<ProtectedRoute><Quotes /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
