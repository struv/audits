import type { Audit, LocationId } from '../types';
import { LOCATIONS } from '../types';

export interface MonthlyReportData {
  month: string;
  year: number;
  visitedLocations: Array<{
    location: LocationId;
    locationName: string;
    auditType: string;
    scheduledDate: string;
    status: string;
    completionPercentage: number;
  }>;
  totalAudits: number;
  completedAudits: number;
  inProgressAudits: number;
  pendingAudits: number;
}

/**
 * Generate a monthly report for visited locations
 */
export function generateMonthlyReport(
  audits: Audit[],
  year: number,
  month: number // 1-12
): MonthlyReportData {
  // Filter audits for the specified month
  const monthStr = month.toString().padStart(2, '0');
  const yearMonthPrefix = `${year}-${monthStr}`;

  console.log('Report Generator Debug:', {
    totalAuditsInStore: audits.length,
    filteringFor: yearMonthPrefix,
    auditDates: audits.map(a => ({ id: a.id, date: a.scheduledDate, location: a.location }))
  });

  const monthlyAudits = audits.filter((audit) =>
    audit.scheduledDate.startsWith(yearMonthPrefix)
  );

  console.log('Filtered audits:', monthlyAudits.length, monthlyAudits);

  // Calculate statistics
  const visitedLocations = monthlyAudits.map((audit) => {
    const completedItems = audit.checklistItems.filter((item) => item.completed).length;
    const totalItems = audit.checklistItems.length;
    const completionPercentage = totalItems > 0
      ? Math.round((completedItems / totalItems) * 100)
      : 0;

    return {
      location: audit.location,
      locationName: LOCATIONS[audit.location],
      auditType: audit.auditType,
      scheduledDate: audit.scheduledDate,
      status: audit.status,
      completionPercentage,
    };
  });

  // Sort by date
  visitedLocations.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return {
    month: monthNames[month - 1],
    year,
    visitedLocations,
    totalAudits: monthlyAudits.length,
    completedAudits: monthlyAudits.filter((a) => a.status === 'complete').length,
    inProgressAudits: monthlyAudits.filter((a) => a.status === 'in_progress').length,
    pendingAudits: monthlyAudits.filter((a) => a.status === 'pending').length,
  };
}

/**
 * Convert report data to CSV format
 */
export function reportToCSV(reportData: MonthlyReportData): string {
  const lines: string[] = [];

  // Header
  lines.push(`Monthly Audit Report - ${reportData.month} ${reportData.year}`);
  lines.push('');

  // Summary
  lines.push('SUMMARY');
  lines.push(`Total Audits,${reportData.totalAudits}`);
  lines.push(`Completed,${reportData.completedAudits}`);
  lines.push(`In Progress,${reportData.inProgressAudits}`);
  lines.push(`Pending,${reportData.pendingAudits}`);
  lines.push('');

  // Visited locations
  lines.push('VISITED LOCATIONS');
  lines.push('Date,Location,Type,Status,Completion %');

  reportData.visitedLocations.forEach((location) => {
    lines.push(
      `${location.scheduledDate},${location.locationName},${location.auditType},${location.status},${location.completionPercentage}%`
    );
  });

  return lines.join('\n');
}

/**
 * Convert report data to plain text format
 */
export function reportToText(reportData: MonthlyReportData): string {
  const lines: string[] = [];

  lines.push('═'.repeat(60));
  lines.push(`MONTHLY AUDIT REPORT`);
  lines.push(`${reportData.month} ${reportData.year}`);
  lines.push('═'.repeat(60));
  lines.push('');

  // Summary
  lines.push('SUMMARY');
  lines.push('─'.repeat(60));
  lines.push(`Total Audits: ${reportData.totalAudits}`);
  lines.push(`  • Completed: ${reportData.completedAudits}`);
  lines.push(`  • In Progress: ${reportData.inProgressAudits}`);
  lines.push(`  • Pending: ${reportData.pendingAudits}`);
  lines.push('');

  // Visited locations
  lines.push('VISITED LOCATIONS');
  lines.push('─'.repeat(60));

  if (reportData.visitedLocations.length === 0) {
    lines.push('No audits scheduled for this month.');
  } else {
    reportData.visitedLocations.forEach((location, index) => {
      lines.push(`${index + 1}. ${location.locationName}`);
      lines.push(`   Date: ${location.scheduledDate}`);
      lines.push(`   Type: ${location.auditType}`);
      lines.push(`   Status: ${location.status}`);
      lines.push(`   Completion: ${location.completionPercentage}%`);
      lines.push('');
    });
  }

  lines.push('═'.repeat(60));
  lines.push(`Generated on ${new Date().toLocaleString()}`);

  return lines.join('\n');
}

/**
 * Download a file with the given content
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
