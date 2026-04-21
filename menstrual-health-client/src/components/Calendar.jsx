import { useState, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Calendar — Interactive monthly calendar view.
 * Highlights period days (using bleedingDays), ovulation, fertile window, and predicted period range.
 *
 * Props:
 *   periodDates  — Array of Date strings (period start dates)
 *   bleedingDays — Number of days to highlight as period (default: 5)
 *   prediction   — { predictedNextPeriod, nextPeriodStart, nextPeriodEnd, bleedingDays }
 *   ovulation    — { estimatedOvulationDate, fertileWindow: { start, end } }
 */
const Calendar = ({ periodDates = [], bleedingDays = 5, prediction = null, ovulation = null }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Navigate months
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Build grid data
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // Helper: check if a date falls on the same day
    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    // Helper: check if date is within range (inclusive)
    const isInRange = (date, start, end) => date >= start && date <= end;

    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, classes: 'empty' });
    }

    // Use the bleedingDays from prediction if available, otherwise use the prop
    const activeBleeding = prediction?.bleedingDays || bleedingDays;

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      let classes = '';

      // Today
      if (isSameDay(date, today)) classes += ' today';

      // Period days — highlight bleedingDays from each period start
      for (const pd of periodDates) {
        const periodStart = new Date(pd);
        const periodEnd = new Date(pd);
        periodEnd.setDate(periodEnd.getDate() + activeBleeding - 1);
        if (isInRange(date, periodStart, periodEnd)) {
          classes += ' period';
          break;
        }
      }

      // Predicted next period range (start to end)
      if (prediction) {
        const predStart = new Date(prediction.nextPeriodStart || prediction.predictedNextPeriod);
        const predEnd = prediction.nextPeriodEnd
          ? new Date(prediction.nextPeriodEnd)
          : (() => { const e = new Date(predStart); e.setDate(e.getDate() + activeBleeding - 1); return e; })();

        if (isInRange(date, predStart, predEnd)) {
          classes += ' predicted';
        }
      }

      // Ovulation day
      if (ovulation?.estimatedOvulationDate) {
        const ovDay = new Date(ovulation.estimatedOvulationDate);
        if (isSameDay(date, ovDay)) classes += ' ovulation';
      }

      // Fertile window
      if (ovulation?.fertileWindow) {
        const fStart = new Date(ovulation.fertileWindow.start);
        const fEnd = new Date(ovulation.fertileWindow.end);
        if (isInRange(date, fStart, fEnd) && !classes.includes('ovulation')) {
          classes += ' fertile';
        }
      }

      days.push({ day: d, classes: classes.trim() });
    }

    return days;
  }, [year, month, periodDates, bleedingDays, prediction, ovulation]);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h3>📅 {monthName}</h3>
        <div className="calendar-nav">
          <button onClick={prevMonth}><FiChevronLeft /></button>
          <button onClick={nextMonth}><FiChevronRight /></button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {weekdays.map((w) => <span key={w}>{w}</span>)}
      </div>

      <div className="calendar-days">
        {calendarDays.map((item, i) => (
          <div key={i} className={`calendar-day ${item.classes}`}>
            {item.day}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16, justifyContent: 'center' }}>
        <span className="badge badge-pink">● Period ({prediction?.bleedingDays || bleedingDays}d)</span>
        <span className="badge badge-coral">◌ Predicted</span>
        <span className="badge badge-purple">● Ovulation</span>
        <span className="badge badge-mint">● Fertile</span>
      </div>
    </div>
  );
};

export default Calendar;
