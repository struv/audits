import { v4 as uuidv4 } from 'uuid';
import type { Audit, AuditType, LocationId, ChecklistItem, AuditStatus } from '../types';
import { LOCATIONS } from '../types';
import { MRR_TEMPLATE } from '../data/templates/mrrChecklist';
import { FSR_TEMPLATE } from '../data/templates/fsrChecklist';

/**
 * Seed configuration options
 */
interface SeedOptions {
  monthsBack?: number; // How many months of historical data to generate
  auditsPerMonth?: number; // Average number of audits per month
  completionRate?: number; // Percentage of items to mark as complete (0-1)
}

/**
 * Get a random element from an array
 */
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get a random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random date within a month
 */
function randomDateInMonth(year: number, month: number): string {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const day = randomInt(1, daysInMonth);
  return new Date(year, month, day).toISOString().split('T')[0];
}

/**
 * Generate checklist items from template with random completion
 */
function generateChecklistItems(
  auditType: AuditType,
  shouldBeComplete: boolean
): ChecklistItem[] {
  const template = auditType === 'MRR' ? MRR_TEMPLATE : FSR_TEMPLATE;

  const items: ChecklistItem[] = Object.values(template).flatMap(
    (section) =>
      section.items.map((item) => {
        // If audit should be complete, mark all items complete
        // Otherwise, randomly leave a few items incomplete (85-95% completion per audit)
        const isCompleted = shouldBeComplete
          ? true
          : Math.random() < (0.85 + Math.random() * 0.1); // 85-95% of items

        return {
          ...item,
          completed: isCompleted,
          completedAt: isCompleted ? new Date().toISOString() : undefined,
          notes: Math.random() < 0.1 ? 'Sample note from seeded data' : undefined,
        };
      })
  );

  return items;
}

/**
 * Determine audit status based on completion
 */
function calculateStatus(checklistItems: ChecklistItem[]): AuditStatus {
  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;

  if (completedCount === 0) return 'pending';
  if (completedCount === totalCount) return 'complete';
  return 'in_progress';
}

/**
 * Generate a single audit with realistic data
 */
function generateAudit(
  scheduledDate: string,
  shouldBeComplete: boolean
): Audit {
  const locations = Object.keys(LOCATIONS) as LocationId[];
  const auditTypes: AuditType[] = ['MRR', 'FSR'];

  const location = randomElement(locations);
  const auditType = randomElement(auditTypes);
  const checklistItems = generateChecklistItems(auditType, shouldBeComplete);
  const status = calculateStatus(checklistItems);

  // Create dates that are realistic (created before scheduled, updated after)
  const scheduledDateTime = new Date(scheduledDate);
  const createdAt = new Date(scheduledDateTime.getTime() - randomInt(1, 14) * 24 * 60 * 60 * 1000).toISOString();
  const updatedAt = status === 'pending'
    ? createdAt
    : new Date(scheduledDateTime.getTime() + randomInt(0, 7) * 24 * 60 * 60 * 1000).toISOString();

  return {
    id: uuidv4(),
    location,
    auditType,
    scheduledDate,
    status,
    checklistItems,
    createdAt,
    updatedAt,
  };
}

/**
 * Generate seed data for historical audits
 */
export function generateSeedData(options: SeedOptions = {}): Audit[] {
  const {
    monthsBack = 6,
    auditsPerMonth = 4,
    completionRate = 0.75, // 75% completion rate by default
  } = options;

  const audits: Audit[] = [];
  const now = new Date();

  // Generate audits for each month going back
  for (let monthOffset = 0; monthOffset < monthsBack; monthOffset++) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();

    // Generate random number of audits for this month (±1 from average)
    const numAudits = Math.max(1, auditsPerMonth + randomInt(-1, 1));

    for (let i = 0; i < numAudits; i++) {
      const scheduledDate = randomDateInMonth(year, month);

      // Determine if this audit should be 100% complete based on completion rate
      // Older audits are more likely to be complete
      const targetRate = monthOffset > 2
        ? Math.min(1, completionRate + 0.15) // Boost older audits by 15%
        : completionRate;

      const shouldBeComplete = Math.random() < targetRate;

      const audit = generateAudit(scheduledDate, shouldBeComplete);
      audits.push(audit);
    }
  }

  // Sort by scheduled date (newest first)
  return audits.sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate));
}

/**
 * Get summary statistics for seed data
 */
export function getSeedDataStats(audits: Audit[]) {
  const totalAudits = audits.length;
  const mrrCount = audits.filter(a => a.auditType === 'MRR').length;
  const fsrCount = audits.filter(a => a.auditType === 'FSR').length;

  const statusCounts = {
    pending: audits.filter(a => a.status === 'pending').length,
    in_progress: audits.filter(a => a.status === 'in_progress').length,
    complete: audits.filter(a => a.status === 'complete').length,
  };

  const uniqueLocations = new Set(audits.map(a => a.location)).size;

  const dateRange = {
    earliest: audits[audits.length - 1]?.scheduledDate,
    latest: audits[0]?.scheduledDate,
  };

  return {
    totalAudits,
    mrrCount,
    fsrCount,
    statusCounts,
    uniqueLocations,
    dateRange,
  };
}
