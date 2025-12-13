import { useState } from 'react';
import { CheckSquare, Square, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Audit } from '../types';
import { useAuditStore } from '../lib/store';
import { MRR_TEMPLATE } from '../data/templates/mrrChecklist';
import { FSR_TEMPLATE } from '../data/templates/fsrChecklist';
import { getCompletionPercentage } from '../lib/utils';

interface ChecklistViewProps {
  audit: Audit;
}

export default function ChecklistView({ audit: auditProp }: ChecklistViewProps) {
  // Subscribe to store to get live updates instead of relying on prop
  const audits = useAuditStore((state) => state.audits);
  const audit = audits.find((a) => a.id === auditProp.id) || auditProp;
  const toggleChecklistItem = useAuditStore((state) => state.toggleChecklistItem);
  
  // #region agent log
  const completedCount = audit.checklistItems.filter((item) => item.completed).length;
  fetch('http://127.0.0.1:7242/ingest/515cbd0a-e7df-4255-9a88-68d69ed0f6af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ChecklistView.tsx:14',message:'ChecklistView render - with store subscription',data:{auditId:audit.id,completedCount,totalItems:audit.checklistItems.length,fromStore:audits.find((a) => a.id === auditProp.id) !== undefined,itemIds:audit.checklistItems.slice(0,5).map((item) => ({id:item.id,completed:item.completed}))},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'F'})}).catch(()=>{});
  // #endregion
  
  const template = audit.auditType === 'MRR' ? MRR_TEMPLATE : FSR_TEMPLATE;

  // Track expanded sections - start with all expanded
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(Object.keys(template))
  );

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="space-y-4">
      {Object.entries(template).map(([sectionKey, section], sectionIndex) => {
        // Skip empty sections
        if (section.items.length === 0) return null;

        const sectionItems = audit.checklistItems.filter((item) =>
          section.items.some((templateItem) => templateItem.id === item.id)
        );
        const completedInSection = sectionItems.filter(
          (item) => item.completed
        ).length;
        const totalInSection = sectionItems.length;
        const progress = getCompletionPercentage(
          completedInSection,
          totalInSection
        );
        const isExpanded = expandedSections.has(sectionKey);
        const isComplete = completedInSection === totalInSection;

        return (
          <motion.div
            key={sectionKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.05 }}
            className="card overflow-hidden"
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(sectionKey)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors touch-target"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-neutral-900 text-left truncate">
                    {section.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="progress-bar flex-1 max-w-xs">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-sm font-medium text-neutral-600 flex-shrink-0">
                      {completedInSection}/{totalInSection}
                    </span>
                  </div>
                </div>
              </div>

              {isComplete && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="ml-4"
                >
                  <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
                    <CheckSquare className="h-5 w-5 text-success-600" />
                  </div>
                </motion.div>
              )}
            </button>

            {/* Section Items */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-neutral-200 overflow-hidden"
                >
                  <div className="divide-y divide-neutral-100">
                    {sectionItems.map((item, itemIndex) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: itemIndex * 0.02 }}
                        className={`px-6 py-4 hover:bg-neutral-50 transition-colors ${
                          item.completed ? 'bg-success-50/30' : ''
                        }`}
                      >
                        <label className="flex items-start gap-4 cursor-pointer touch-target">
                          <button
                            onClick={() => {
                              // #region agent log
                              fetch('http://127.0.0.1:7242/ingest/515cbd0a-e7df-4255-9a88-68d69ed0f6af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ChecklistView.tsx:130',message:'ChecklistView - button click',data:{auditId:audit.id,itemId:item.id,itemCompletedBefore:item.completed},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                              // #endregion
                              toggleChecklistItem(audit.id, item.id);
                            }}
                            className="mt-0.5 flex-shrink-0 touch-target"
                            type="button"
                          >
                            <motion.div
                              whileTap={{ scale: 0.9 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              {item.completed ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: 'spring', duration: 0.4 }}
                                >
                                  <CheckSquare className="h-6 w-6 text-primary-600" />
                                </motion.div>
                              ) : (
                                <Square className="h-6 w-6 text-neutral-400 hover:text-primary-600 transition-colors" />
                              )}
                            </motion.div>
                          </button>

                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm leading-relaxed ${
                                item.completed
                                  ? 'text-neutral-500 line-through'
                                  : 'text-neutral-900'
                              }`}
                            >
                              {item.description}
                            </p>
                            <p className="text-xs text-neutral-500 mt-1">
                              {item.category}
                            </p>
                            {item.completedAt && (
                              <p className="text-xs text-success-600 mt-1">
                                ✓ Completed{' '}
                                {new Date(item.completedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
