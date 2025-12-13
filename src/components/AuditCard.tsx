import { Link } from 'react-router-dom';
import { MapPin, Calendar, Trash2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Audit } from '../types';
import { LOCATIONS } from '../types';
import { useAuditStore } from '../lib/store';
import {
  formatDate,
  getCompletionPercentage,
  getStatusColor,
  getAuditTypeColor,
  formatStatus,
} from '../lib/utils';

interface AuditCardProps {
  audit: Audit;
  index: number;
}

export default function AuditCard({ audit, index }: AuditCardProps) {
  const deleteAudit = useAuditStore((state) => state.deleteAudit);

  const completedCount = audit.checklistItems.filter(
    (item) => item.completed
  ).length;
  const totalCount = audit.checklistItems.length;
  const progress = getCompletionPercentage(completedCount, totalCount);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      confirm(
        `Are you sure you want to delete this ${audit.auditType} audit for ${LOCATIONS[audit.location]}?`
      )
    ) {
      deleteAudit(audit.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/audit/${audit.id}`}
        className="block card card-hover group"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`badge ${getAuditTypeColor(audit.auditType)}`}>
                  {audit.auditType}
                </span>
                <span className={`badge ${getStatusColor(audit.status)}`}>
                  {formatStatus(audit.status)}
                </span>
              </div>

              {/* Location & Date */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-neutral-700">
                  <MapPin className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  <span className="font-semibold truncate">
                    {LOCATIONS[audit.location]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Calendar className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                  <span>{formatDate(audit.scheduledDate, 'short')}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Progress</span>
                  <span className="font-semibold text-neutral-900">
                    {completedCount}/{totalCount}
                  </span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-start gap-2">
              <button
                onClick={handleDelete}
                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all touch-target"
                aria-label="Delete audit"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <div className="p-2 text-neutral-400 group-hover:text-primary-600 transition-colors">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
