import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, MapPin, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuditStore } from '../lib/store';
import { LOCATIONS } from '../types';
import type { LocationId, AuditType } from '../types';

interface AuditFormProps {
  onClose: () => void;
}

export default function AuditForm({ onClose }: AuditFormProps) {
  const navigate = useNavigate();
  const createAudit = useAuditStore((state) => state.createAudit);

  const [location, setLocation] = useState<LocationId>('agoura_hills');
  const [auditType, setAuditType] = useState<AuditType>('MRR');
  const [scheduledDate, setScheduledDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const audit = createAudit(location, auditType, scheduledDate);
    navigate(`/audit/${audit.id}`);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="card max-w-lg w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Create New Audit
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Schedule an audit for your facility
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              <X className="h-5 w-5 text-neutral-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                <MapPin className="h-4 w-4 text-primary-600" />
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as LocationId)}
                className="input"
              >
                {Object.entries(LOCATIONS).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Audit Type */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                <FileText className="h-4 w-4 text-primary-600" />
                Audit Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAuditType('MRR')}
                  className={`relative px-5 py-4 border-2 rounded-2xl text-sm font-semibold transition-all ${
                    auditType === 'MRR'
                      ? 'bg-primary-50 border-primary-500 text-primary-900 shadow-soft'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {auditType === 'MRR' && (
                    <motion.div
                      layoutId="audit-type-indicator"
                      className="absolute inset-0 bg-primary-50 rounded-2xl"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">
                    MRR
                    <span className="block text-xs text-neutral-600 mt-1 font-normal">
                      Medical Record Review
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuditType('FSR')}
                  className={`relative px-5 py-4 border-2 rounded-2xl text-sm font-semibold transition-all ${
                    auditType === 'FSR'
                      ? 'bg-accent-50 border-accent-500 text-accent-900 shadow-soft'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {auditType === 'FSR' && (
                    <motion.div
                      layoutId="audit-type-indicator"
                      className="absolute inset-0 bg-accent-50 rounded-2xl"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">
                    FSR
                    <span className="block text-xs text-neutral-600 mt-1 font-normal">
                      Facility Site Review
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* Scheduled Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                <Calendar className="h-4 w-4 text-primary-600" />
                Scheduled Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="input"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary flex-1">
                Create Audit
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
