import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCycle, getCycleHistory, getNextPeriod, getOvulation, getIrregularities } from '../store/cycleSlice';
import Calendar from '../components/Calendar';
import { FiCalendar, FiTrendingUp, FiAlertTriangle, FiPlus, FiClock, FiHeart, FiInfo } from 'react-icons/fi';

/**
 * Dashboard — Main app view with calendar, predictions, and cycle tracking.
 * Now includes bleedingDays input and period-range display.
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const { cycles, prediction, ovulation, irregularities, loading } = useSelector((state) => state.cycle);
  const { user, isAnonymous } = useSelector((state) => state.auth);

  const [showAddForm, setShowAddForm] = useState(false);
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength, setCycleLength] = useState(30);
  const [bleedingDays, setBleedingDays] = useState(5);

  // Fetch data on mount
  useEffect(() => {
    dispatch(getCycleHistory());
    dispatch(getNextPeriod());
    dispatch(getOvulation());
    dispatch(getIrregularities());
  }, [dispatch]);

  // Handle adding a new cycle
  const handleAddCycle = (e) => {
    e.preventDefault();
    dispatch(addCycle({
      lastPeriodDate,
      cycleLength: parseInt(cycleLength),
      bleedingDays: parseInt(bleedingDays),
    })).then(() => {
      dispatch(getNextPeriod());
      dispatch(getOvulation());
      dispatch(getIrregularities());
      setShowAddForm(false);
      setLastPeriodDate('');
      setCycleLength(30);
      setBleedingDays(5);
    });
  };

  // Format date for display
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '—';

  return (
    <div className="page">
      {/* Anonymous Mode Banner */}
      {isAnonymous && (
        <div className="alert alert-info mb-2">
          <span className="alert-icon">🔒</span>
          <span><strong>Anonymous Mode</strong> — Your data is stored locally on this device only.</span>
        </div>
      )}

      {/* Welcome */}
      <div className="mb-3">
        <h1 className="section-title">
          🌸 Welcome{user?.name ? `, ${user.name}` : ''}
          {isAnonymous && <span className="badge badge-mint" style={{ marginLeft: 8, fontSize: '0.7rem' }}>Anonymous</span>}
        </h1>
        <p className="section-subtitle">Track your cycle, predict your days, stay healthy.</p>
      </div>

      {/* Irregularity Alert */}
      {irregularities?.data?.isIrregular && (
        <div className="alert alert-warning">
          <span className="alert-icon"><FiAlertTriangle /></span>
          <span>{irregularities.message}</span>
        </div>
      )}

      {/* Calendar */}
      <Calendar
        periodDates={cycles.map((c) => c.lastPeriodDate)}
        bleedingDays={cycles.length > 0 ? (cycles[0].bleedingDays || 5) : 5}
        prediction={prediction}
        ovulation={ovulation}
      />

      {/* Prediction Cards */}
      <div className="dashboard-grid">
        {/* Next Period */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon pink"><FiCalendar /></div>
            <span className="card-title">Next Period</span>
          </div>
          <div className="card-value">
            {prediction ? formatDate(prediction.nextPeriodStart || prediction.predictedNextPeriod) : '—'}
          </div>
          <div className="card-label">
            {prediction?.nextPeriodEnd
              ? `${prediction.bleedingDays || 5} day period • Ends ${formatDate(prediction.nextPeriodEnd)}`
              : prediction?.isLate
                ? '⚠️ Your period may be late'
                : `Cycle length: ${prediction?.cycleLength || 30} days`}
          </div>
        </div>

        {/* Ovulation */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon purple"><FiHeart /></div>
            <span className="card-title">Ovulation Date</span>
          </div>
          <div className="card-value">{ovulation ? formatDate(ovulation.estimatedOvulationDate) : '—'}</div>
          <div className="card-label">
            {ovulation?.fertileWindow
              ? `Fertile: ${formatDate(ovulation.fertileWindow.start)} – ${formatDate(ovulation.fertileWindow.end)}`
              : 'Add cycle data to see predictions'}
          </div>
        </div>

        {/* Cycles Tracked */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon mint"><FiTrendingUp /></div>
            <span className="card-title">Cycles Tracked</span>
          </div>
          <div className="card-value">{cycles.length}</div>
          <div className="card-label">
            {irregularities?.data?.averageCycleLength
              ? `Avg cycle: ${irregularities.data.averageCycleLength} days`
              : 'Log more cycles for insights'}
          </div>
        </div>
      </div>

      {/* Add Cycle Form */}
      <div className="card mb-3">
        <div className="card-header" style={{ cursor: 'pointer' }} onClick={() => setShowAddForm(!showAddForm)}>
          <div className="card-icon coral"><FiPlus /></div>
          <span className="card-title">Log New Cycle</span>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddCycle} style={{ animation: 'fadeUp 0.3s ease' }}>
            <div className="form-group">
              <label htmlFor="periodDate">Last Period Start Date</label>
              <input
                id="periodDate"
                type="date"
                className="form-input"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cycleLen">Cycle Length (days)</label>
              <input
                id="cycleLen"
                type="number"
                className="form-input"
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                min="7"
                max="60"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bleedDays">
                How many days does your period last?
              </label>
              <input
                id="bleedDays"
                type="number"
                className="form-input"
                value={bleedingDays}
                onChange={(e) => setBleedingDays(e.target.value)}
                min="1"
                max="10"
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <FiInfo size={12} /> Average period lasts 3–7 days
              </small>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Cycle Entry'}
            </button>
          </form>
        )}
      </div>

      {/* Cycle History */}
      {cycles.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="card-icon purple"><FiClock /></div>
            <span className="card-title">Cycle History</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 8px', color: 'var(--text-muted)', fontWeight: 500 }}>Date</th>
                  <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--text-muted)', fontWeight: 500 }}>Cycle</th>
                  <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--text-muted)', fontWeight: 500 }}>Period</th>
                </tr>
              </thead>
              <tbody>
                {cycles.slice(0, 10).map((c) => (
                  <tr key={c._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '10px 8px' }}>{formatDate(c.lastPeriodDate)}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <span className="badge badge-pink">{c.cycleLength}d</span>
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <span className="badge badge-coral">{c.bleedingDays || 5}d</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
