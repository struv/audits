import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar as CalendarIcon, TrendingUp, Clock, CheckCircle, Database, FileBarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuditStore } from '../lib/store';
import AuditCard from '../components/AuditCard';
import AuditForm from '../components/AuditForm';
import MonthlyReportModal from '../components/MonthlyReportModal';

export default function Dashboard() {
  const audits = useAuditStore((state) => state.audits);
  const getUpcomingAudits = useAuditStore((state) => state.getUpcomingAudits);
  const getAuditsByStatus = useAuditStore((state) => state.getAuditsByStatus);

  const [showForm, setShowForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const upcomingAudits = getUpcomingAudits();
  const inProgressCount = getAuditsByStatus('in_progress').length;
  const completedCount = getAuditsByStatus('complete').length;

  // Get past audits (scheduled in the past, sorted by date descending)
  const today = new Date().toISOString().split('T')[0];
  const pastAudits = audits
    .filter((a) => a.scheduledDate < today)
    .sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate));

  // Calculate total completion percentage
  const totalItems = audits.reduce(
    (sum, audit) => sum + audit.checklistItems.length,
    0
  );
  const completedItems = audits.reduce(
    (sum, audit) =>
      sum + audit.checklistItems.filter((item) => item.completed).length,
    0
  );
  const overallProgress =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const stats = [
    {
      label: 'Upcoming Audits',
      value: upcomingAudits.length,
      icon: Clock,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      label: 'In Progress',
      value: inProgressCount,
      icon: TrendingUp,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
    },
    {
      label: 'Completed',
      value: completedCount,
      icon: CheckCircle,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/20 to-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
                Audit Dashboard
              </h1>
              <p className="text-neutral-600">
                Manage and track your facility audits
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/dev"
                className="btn btn-secondary"
                title="Developer Tools"
              >
                <Database className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">Dev Tools</span>
              </Link>
              <button
                onClick={() => setShowReportModal(true)}
                className="btn btn-secondary"
                title="Generate Monthly Report"
              >
                <FileBarChart className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">Report</span>
              </button>
              <Link
                to="/calendar"
                className="btn btn-secondary"
              >
                <CalendarIcon className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">Calendar</span>
              </Link>
              <button onClick={() => setShowForm(true)} className="btn btn-primary">
                <Plus className="h-5 w-5 mr-2" />
                New Audit
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className="text-3xl font-bold text-neutral-900">
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm font-medium text-neutral-600">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overall Progress (if there are audits) */}
        {audits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card mb-8"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Overall Progress
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    {completedItems} of {totalItems} items completed
                  </p>
                </div>
                <span className="text-2xl font-bold text-primary-600">
                  {overallProgress}%
                </span>
              </div>
              <div className="progress-bar h-3">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Audit Lists */}
        {audits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="card text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                No audits yet
              </h3>
              <p className="text-neutral-600 mb-6">
                Get started by creating your first audit
              </p>
              <button onClick={() => setShowForm(true)} className="btn btn-primary">
                <Plus className="h-5 w-5 mr-2" />
                Create First Audit
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Audits */}
            {upcomingAudits.length > 0 && (
              <div>
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl font-bold text-neutral-900 mb-6"
                >
                  Upcoming Audits
                </motion.h2>
                <div className="space-y-4">
                  {upcomingAudits.map((audit, index) => (
                    <AuditCard key={audit.id} audit={audit} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Audits */}
            {pastAudits.length > 0 && (
              <div>
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl font-bold text-neutral-900 mb-6"
                >
                  Past Audits
                </motion.h2>
                <div className="space-y-4">
                  {pastAudits.map((audit, index) => (
                    <AuditCard key={audit.id} audit={audit} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && <AuditForm onClose={() => setShowForm(false)} />}
      {showReportModal && <MonthlyReportModal onClose={() => setShowReportModal(false)} />}
    </div>
  );
}
