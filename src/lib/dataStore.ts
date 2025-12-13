import type { Audit } from '../types';

/**
 * Data store interface - designed to mirror future PocketBase schema
 * This abstraction enables seamless migration from localStorage to backend
 */
export interface IDataStore {
  getAudits(): Audit[];
  getAudit(id: string): Audit | undefined;
  saveAudit(audit: Audit): void;
  deleteAudit(id: string): void;
  updateAudit(id: string, updates: Partial<Audit>): void;
}

/**
 * localStorage implementation
 * Schema matches PocketBase structure for easy migration
 */
export class LocalStorageDataStore implements IDataStore {
  private readonly STORAGE_KEY = 'audits';
  private readonly METADATA_KEY = 'app_metadata';

  constructor() {
    this.initializeMetadata();
  }

  private initializeMetadata() {
    const metadata = localStorage.getItem(this.METADATA_KEY);
    if (!metadata) {
      localStorage.setItem(
        this.METADATA_KEY,
        JSON.stringify({
          version: '1.0.0',
          last_modified: new Date().toISOString(),
        })
      );
    }
  }

  private updateMetadata() {
    const metadata = {
      version: '1.0.0',
      last_modified: new Date().toISOString(),
    };
    localStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
  }

  getAudits(): Audit[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to parse audits from localStorage:', error);
      return [];
    }
  }

  getAudit(id: string): Audit | undefined {
    return this.getAudits().find((audit) => audit.id === id);
  }

  saveAudit(audit: Audit): void {
    const audits = this.getAudits();
    const existingIndex = audits.findIndex((a) => a.id === audit.id);

    if (existingIndex >= 0) {
      audits[existingIndex] = audit;
    } else {
      audits.push(audit);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(audits));
    this.updateMetadata();
  }

  deleteAudit(id: string): void {
    const audits = this.getAudits().filter((audit) => audit.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(audits));
    this.updateMetadata();
  }

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
}

// Export singleton instance
export const dataStore = new LocalStorageDataStore();
