import { useState, useEffect } from 'react';
import { X, Download, FileText, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuditStore } from '../lib/store';
import {
  generateMonthlyReport,
  reportToCSV,
  reportToText,
  downloadFile,
} from '../lib/reportGenerator';

interface MonthlyReportModalProps {
  onClose: () => void;
}

export default function MonthlyReportModal({ onClose }: MonthlyReportModalProps) {
  const audits = useAuditStore((state) => state.audits);

  // Default to current month/year
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [format, setFormat] = useState<'text' | 'csv'>('text');

  // Preview the report data
  const reportData = generateMonthlyReport(audits, year, month);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleGenerate = () => {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'csv') {
      content = reportToCSV(reportData);
      filename = `audit-report-${year}-${month.toString().padStart(2, '0')}.csv`;
      mimeType = 'text/csv';
    } else {
      content = reportToText(reportData);
      filename = `audit-report-${year}-${month.toString().padStart(2, '0')}.txt`;
      mimeType = 'text/plain';
    }

    downloadFile(content, filename, mimeType);
    onClose();
  };

  // Generate years array (current year and 2 years back)
  const years = Array.from({ length: 3 }, (_, i) => now.getFullYear() - i);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

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
                Generate Monthly Report
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Download a report of visited locations
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
          <div className="p-6 space-y-6">
            {/* Month Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                <Calendar className="h-4 w-4 text-primary-600" />
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="input"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                <Calendar className="h-4 w-4 text-primary-600" />
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="input"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Format Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                <FileText className="h-4 w-4 text-primary-600" />
                Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('text')}
                  className={`relative px-5 py-4 border-2 rounded-2xl text-sm font-semibold transition-all ${
                    format === 'text'
                      ? 'bg-primary-50 border-primary-500 text-primary-900 shadow-soft'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {format === 'text' && (
                    <motion.div
                      layoutId="format-indicator"
                      className="absolute inset-0 bg-primary-50 rounded-2xl"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">
                    Text File
                    <span className="block text-xs text-neutral-600 mt-1 font-normal">
                      .txt
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('csv')}
                  className={`relative px-5 py-4 border-2 rounded-2xl text-sm font-semibold transition-all ${
                    format === 'csv'
                      ? 'bg-accent-50 border-accent-500 text-accent-900 shadow-soft'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {format === 'csv' && (
                    <motion.div
                      layoutId="format-indicator"
                      className="absolute inset-0 bg-accent-50 rounded-2xl"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">
                    CSV File
                    <span className="block text-xs text-neutral-600 mt-1 font-normal">
                      .csv
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-700 mb-3">
                Preview
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Audits:</span>
                  <span className="font-semibold text-neutral-900">
                    {reportData.totalAudits}
                  </span>
                </div>
                {reportData.totalAudits > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Completed:</span>
                      <span className="font-semibold text-success-600">
                        {reportData.completedAudits}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">In Progress:</span>
                      <span className="font-semibold text-warning-600">
                        {reportData.inProgressAudits}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Pending:</span>
                      <span className="font-semibold text-neutral-600">
                        {reportData.pendingAudits}
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-neutral-200">
                      <p className="text-xs text-neutral-600 mb-2">Locations:</p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {reportData.visitedLocations.map((loc, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-neutral-700 flex justify-between"
                          >
                            <span>{loc.locationName}</span>
                            <span className="text-neutral-500">{loc.scheduledDate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {reportData.totalAudits === 0 && (
                  <p className="text-xs text-neutral-500 italic">
                    No audits found for {reportData.month} {reportData.year}
                  </p>
                )}
              </div>
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
              <button
                type="button"
                onClick={handleGenerate}
                className="btn btn-primary flex-1"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Report
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
