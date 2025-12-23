import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, Trash2, Sparkles, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuditStore } from '../lib/store';
import { generateSeedData, getSeedDataStats } from '../lib/seedData';
import { dataStore } from '../lib/dataStore';

export default function DevTools() {
  const audits = useAuditStore((state) => state.audits);
  const loadAudits = useAuditStore((state) => state.loadAudits);

  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [lastSeedStats, setLastSeedStats] = useState<any>(null);

  // Seed configuration
  const [monthsBack, setMonthsBack] = useState(6);
  const [auditsPerMonth, setAuditsPerMonth] = useState(4);
  const [completionRate, setCompletionRate] = useState(75);

  const handleGenerateSeed = async () => {
    setIsSeeding(true);
    try {
      // Generate seed data
      const seedAudits = generateSeedData({
        monthsBack,
        auditsPerMonth,
        completionRate: completionRate / 100,
      });

      // Get stats before saving
      const stats = getSeedDataStats(seedAudits);
      setLastSeedStats(stats);

      // Save each audit to the data store
      seedAudits.forEach(audit => {
        dataStore.saveAudit(audit);
      });

      // Reload audits in the store
      await loadAudits();

      alert(`Successfully generated ${seedAudits.length} audits!`);
    } catch (error) {
      console.error('Error generating seed data:', error);
      alert('Failed to generate seed data. Check console for details.');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL audits? This cannot be undone!')) {
      return;
    }

    setIsClearing(true);
    try {
      // Delete all audits
      audits.forEach(audit => {
        dataStore.deleteAudit(audit.id);
      });

      // Reload audits
      await loadAudits();

      setLastSeedStats(null);
      alert('All audits have been deleted.');
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Failed to clear data. Check console for details.');
    } finally {
      setIsClearing(false);
    }
  };

  // Calculate current stats
  const currentStats = {
    total: audits.length,
    mrr: audits.filter(a => a.auditType === 'MRR').length,
    fsr: audits.filter(a => a.auditType === 'FSR').length,
    pending: audits.filter(a => a.status === 'pending').length,
    inProgress: audits.filter(a => a.status === 'in_progress').length,
    complete: audits.filter(a => a.status === 'complete').length,
    uniqueLocations: new Set(audits.map(a => a.location)).size,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-2xl">
              <Database className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Developer Tools</h1>
              <p className="text-neutral-600 mt-1">Seed data and manage test audits</p>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 mb-8"
        >
          <p className="text-amber-800 text-sm">
            <strong>Development Only:</strong> This page is for testing purposes. Actions here will modify your actual audit data.
          </p>
        </motion.div>

        {/* Current Data Stats */}
        <div className="card mb-8 p-8">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-bold text-neutral-900">Current Data</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-neutral-50 rounded-xl">
              <div className="text-2xl font-bold text-neutral-900">{currentStats.total}</div>
              <div className="text-xs text-neutral-600 mt-1">Total Audits</div>
            </div>
            <div className="text-center p-6 bg-primary-50 rounded-xl">
              <div className="text-2xl font-bold text-primary-900">{currentStats.mrr}</div>
              <div className="text-xs text-neutral-600 mt-1">MRR Audits</div>
            </div>
            <div className="text-center p-6 bg-accent-50 rounded-xl">
              <div className="text-2xl font-bold text-accent-900">{currentStats.fsr}</div>
              <div className="text-xs text-neutral-600 mt-1">FSR Audits</div>
            </div>
            <div className="text-center p-6 bg-success-50 rounded-xl">
              <div className="text-2xl font-bold text-success-900">{currentStats.complete}</div>
              <div className="text-xs text-neutral-600 mt-1">Completed</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-5 bg-neutral-50 rounded-xl">
              <div className="text-lg font-bold text-neutral-700">{currentStats.pending}</div>
              <div className="text-xs text-neutral-600">Pending</div>
            </div>
            <div className="text-center p-5 bg-warning-50 rounded-xl">
              <div className="text-lg font-bold text-warning-700">{currentStats.inProgress}</div>
              <div className="text-xs text-neutral-600">In Progress</div>
            </div>
            <div className="text-center p-5 bg-purple-50 rounded-xl">
              <div className="text-lg font-bold text-purple-700">{currentStats.uniqueLocations}</div>
              <div className="text-xs text-neutral-600">Locations</div>
            </div>
          </div>
        </div>

        {/* Seed Data Generator */}
        <div className="card mb-8 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-bold text-neutral-900">Generate Seed Data</h2>
          </div>

          <p className="text-sm text-neutral-600 mb-8">
            Create historical audit data for testing monthly reports and analytics features.
          </p>

          {/* Configuration */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Months Back
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={monthsBack}
                onChange={(e) => setMonthsBack(parseInt(e.target.value))}
                className="input"
              />
              <p className="text-xs text-neutral-500 mt-1">Generate data for last N months</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Audits/Month
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={auditsPerMonth}
                onChange={(e) => setAuditsPerMonth(parseInt(e.target.value))}
                className="input"
              />
              <p className="text-xs text-neutral-500 mt-1">Average audits per month</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Completion Rate
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={completionRate}
                onChange={(e) => setCompletionRate(parseInt(e.target.value))}
                className="input"
              />
              <p className="text-xs text-neutral-500 mt-1">% of audits 100% complete</p>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-neutral-50 rounded-xl p-6 mb-8">
            <p className="text-sm text-neutral-700">
              <strong>Preview:</strong> Will generate approximately{' '}
              <strong className="text-purple-600">{monthsBack * auditsPerMonth}</strong> audits
              spanning <strong className="text-purple-600">{monthsBack} months</strong>.{' '}
              <strong className="text-purple-600">{completionRate}%</strong> will be fully complete,
              the rest will have a few items incomplete.
            </p>
          </div>

          <button
            onClick={handleGenerateSeed}
            disabled={isSeeding}
            className="btn btn-primary w-full"
          >
            {isSeeding ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Seed Data
              </>
            )}
          </button>

          {/* Last Seed Stats */}
          {lastSeedStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-6 bg-success-50 border border-success-200 rounded-xl"
            >
              <p className="text-sm font-semibold text-success-900 mb-3">
                Last Seed Generated
              </p>
              <div className="text-xs text-success-700 space-y-1">
                <p>Total: {lastSeedStats.totalAudits} audits</p>
                <p>MRR: {lastSeedStats.mrrCount} | FSR: {lastSeedStats.fsrCount}</p>
                <p>Locations: {lastSeedStats.uniqueLocations} unique</p>
                <p>
                  Date Range: {lastSeedStats.dateRange.earliest} to{' '}
                  {lastSeedStats.dateRange.latest}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="card border-2 border-red-200 bg-red-50 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Trash2 className="h-5 w-5 text-red-600" />
            <h2 className="text-xl font-bold text-red-900">Danger Zone</h2>
          </div>

          <p className="text-sm text-red-700 mb-6">
            Permanently delete all audits. This action cannot be undone.
          </p>

          <button
            onClick={handleClearAll}
            disabled={isClearing || audits.length === 0}
            className="btn bg-red-600 hover:bg-red-700 text-white w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isClearing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Clear All Data ({audits.length} audits)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
