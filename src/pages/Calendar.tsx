import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import type { Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuditStore } from '../lib/store';
import { LOCATIONS } from '../types';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage() {
  const navigate = useNavigate();
  const audits = useAuditStore((state) => state.audits);

  const events = useMemo<Event[]>(() => {
    return audits.map((audit) => {
      const date = new Date(audit.scheduledDate);
      return {
        id: audit.id,
        title: `${audit.auditType} - ${LOCATIONS[audit.location]}`,
        start: date,
        end: date,
        resource: audit,
      };
    });
  }, [audits]);

  const eventStyleGetter = (event: Event) => {
    const audit = event.resource;
    let backgroundColor = '#0284c7'; // primary-600
    let borderColor = '#0369a1'; // primary-700

    if (audit.auditType === 'FSR') {
      backgroundColor = '#9333ea'; // accent-600
      borderColor = '#7e22ce'; // accent-700
    }

    if (audit.status === 'complete') {
      backgroundColor = '#16a34a'; // success-600
      borderColor = '#15803d'; // success-700
    }

    return {
      style: {
        backgroundColor,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        padding: '4px 8px',
        fontSize: '0.875rem',
        fontWeight: '500',
      },
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/20 to-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            Audit Calendar
          </h1>
          <p className="text-neutral-600">
            View all your scheduled audits at a glance
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          <div className="p-4 flex flex-wrap items-center gap-6">
            <span className="text-sm font-semibold text-neutral-700">Legend:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary-600"></div>
              <span className="text-sm text-neutral-600">MRR Audit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-accent-600"></div>
              <span className="text-sm text-neutral-600">FSR Audit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success-600"></div>
              <span className="text-sm text-neutral-600">Completed</span>
            </div>
          </div>
        </motion.div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card overflow-hidden"
          style={{ height: 'calc(100vh - 400px)', minHeight: '500px' }}
        >
          <div className="p-6 h-full">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventStyleGetter}
              onSelectEvent={(event) => navigate(`/audit/${event.id}`)}
              views={['month', 'week', 'day', 'agenda']}
              defaultView="month"
              popup
              className="h-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
