import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuditStore } from '../lib/store';
import { LOCATIONS } from '../types';
import ChecklistView from '../components/ChecklistView';
import {
  formatDate,
  getCompletionPercentage,
  getAuditTypeColor,
} from '../lib/utils';

export default function AuditDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const loadAudits = useAuditStore((state) => state.loadAudits);
  const updateStatus = useAuditStore((state) => state.updateStatus);
  const deleteAudit = useAuditStore((state) => state.deleteAudit);

  // Subscribe to audits array to get live updates
  const audits = useAuditStore((state) => state.audits);
  const audit = id ? audits.find((a) => a.id === id) : undefined;

  // Ensure audits are loaded on mount
  useEffect(() => {
    if (audits.length === 0) {
      loadAudits();
    }
  }, [audits.length, loadAudits]);

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/515cbd0a-e7df-4255-9a88-68d69ed0f6af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuditDetail.tsx:22',message:'AuditDetail render - post-fix',data:{id,auditsCount:audits.length,auditExists:!!audit,auditCompletedCount:audit?.checklistItems?.filter((item) => item.completed).length},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A,B,C'})}).catch(()=>{});
  // #endregion

  if (!audit) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Audit Not Found
          </h2>
          <p className="text-neutral-600 mb-6">
            The audit you're looking for doesn't exist.
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = audit.checklistItems.filter(
    (item) => item.completed
  ).length;
  const totalCount = audit.checklistItems.length;
  const progress = getCompletionPercentage(completedCount, totalCount);

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete this ${audit.auditType} audit for ${LOCATIONS[audit.location]}?`
      )
    ) {
      deleteAudit(audit.id);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/20 to-neutral-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex-1 min-w-0">
                {/* Title & Badges */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                    {audit.auditType} Audit
                  </h1>
                  <span className={`badge ${getAuditTypeColor(audit.auditType)}`}>
                    {audit.auditType}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-neutral-700">
                    <MapPin className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    <span className="font-semibold text-lg">
                      {LOCATIONS[audit.location]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-600">
                    <Calendar className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                    <span>{formatDate(audit.scheduledDate)}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-700">
                      Overall Progress
                    </span>
                    <span className="text-lg font-bold text-primary-600">
                      {progress}%
                    </span>
                  </div>
                  <div className="progress-bar h-3">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-sm text-neutral-600">
                    {completedCount} of {totalCount} items completed
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-3">
                <select
                  value={audit.status}
                  onChange={(e) =>
                    updateStatus(audit.id, e.target.value as any)
                  }
                  className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                    audit.status === 'pending'
                      ? 'border-neutral-300 bg-neutral-50 text-neutral-700'
                      : audit.status === 'in_progress'
                      ? 'border-warning-300 bg-warning-50 text-warning-700'
                      : 'border-success-300 bg-success-50 text-success-700'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="complete">Complete</option>
                </select>

                <button
                  onClick={handleDelete}
                  className="btn btn-danger sm:w-full"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ChecklistView audit={audit} />
        </motion.div>
      </div>
    </div>
  );
}
