import type { Audit } from '../types';
import { supabase } from './supabase';
import type { IDataStore } from './dataStore';

/**
 * Supabase implementation of the data store
 * Provides async data persistence with real-time capabilities
 */
export class SupabaseDataStore implements IDataStore {
  private cache: Audit[] = [];
  private initialized = false;

  /**
   * Initialize cache from Supabase
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;

    const audits = await this.fetchAudits();
    this.cache = audits;
    this.initialized = true;
  }

  /**
   * Fetch all audits from Supabase
   */
  private async fetchAudits(): Promise<Audit[]> {
    try {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching audits:', error);
        return [];
      }

      // Transform database format to app format
      return (data || []).map(this.transformFromDatabase);
    } catch (error) {
      console.error('Failed to fetch audits:', error);
      return [];
    }
  }

  /**
   * Transform database row to Audit object
   */
  private transformFromDatabase(row: any): Audit {
    return {
      id: row.id,
      location: row.location,
      auditType: row.audit_type,
      scheduledDate: row.scheduled_date,
      status: row.status,
      checklistItems: row.checklist_items || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Transform Audit object to database format
   */
  private transformToDatabase(audit: Audit) {
    return {
      id: audit.id,
      location: audit.location,
      audit_type: audit.auditType,
      scheduled_date: audit.scheduledDate,
      status: audit.status,
      checklist_items: audit.checklistItems,
      created_at: audit.createdAt,
      updated_at: audit.updatedAt,
    };
  }

  /**
   * Get all audits (synchronous, uses cache)
   */
  getAudits(): Audit[] {
    // Trigger async initialization if needed
    if (!this.initialized) {
      this.initialize();
    }
    return this.cache;
  }

  /**
   * Get a single audit by ID
   */
  getAudit(id: string): Audit | undefined {
    return this.cache.find((audit) => audit.id === id);
  }

  /**
   * Save an audit (create or update)
   */
  saveAudit(audit: Audit): void {
    // Update cache immediately
    const existingIndex = this.cache.findIndex((a) => a.id === audit.id);
    if (existingIndex >= 0) {
      this.cache[existingIndex] = audit;
    } else {
      this.cache.unshift(audit);
    }

    // Async save to Supabase
    this.saveAuditAsync(audit);
  }

  /**
   * Async save to Supabase
   */
  private async saveAuditAsync(audit: Audit): Promise<void> {
    try {
      const dbAudit = this.transformToDatabase(audit);

      const { error } = await supabase
        .from('audits')
        .upsert(dbAudit as any, { onConflict: 'id' });

      if (error) {
        console.error('Error saving audit:', error);
      }
    } catch (error) {
      console.error('Failed to save audit:', error);
    }
  }

  /**
   * Delete an audit
   */
  deleteAudit(id: string): void {
    // Update cache immediately
    this.cache = this.cache.filter((audit) => audit.id !== id);

    // Async delete from Supabase
    this.deleteAuditAsync(id);
  }

  /**
   * Async delete from Supabase
   */
  private async deleteAuditAsync(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('audits')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting audit:', error);
      }
    } catch (error) {
      console.error('Failed to delete audit:', error);
    }
  }

  /**
   * Update an audit with partial data
   */
  updateAudit(id: string, updates: Partial<Audit>): void {
    const audit = this.getAudit(id);
    if (!audit) {
      console.warn(`Audit with id ${id} not found`);
      return;
    }

    const updatedAudit: Audit = {
      ...audit,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveAudit(updatedAudit);
  }

  /**
   * Refresh cache from Supabase
   */
  async refresh(): Promise<void> {
    this.cache = await this.fetchAudits();
    this.initialized = true;
  }
}
