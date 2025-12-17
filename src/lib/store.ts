import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Audit, AuditType, LocationId, ChecklistItem, AuditStatus } from '../types';
import { dataStore } from './dataStore';
import { MRR_TEMPLATE } from '../data/templates/mrrChecklist';
import { FSR_TEMPLATE } from '../data/templates/fsrChecklist';

interface AuditStore {
  // State
  audits: Audit[];
  isLoading: boolean;

  // Actions
  loadAudits: () => void;
  createAudit: (
    location: LocationId,
    auditType: AuditType,
    scheduledDate: string
  ) => Audit;
  deleteAudit: (id: string) => void;
  updateAudit: (id: string, updates: Partial<Audit>) => void;
  updateStatus: (id: string, status: AuditStatus) => void;
  toggleChecklistItem: (auditId: string, itemId: string) => void;
  updateChecklistItemNotes: (auditId: string, itemId: string, notes: string) => void;

  // Computed
  getAuditById: (id: string) => Audit | undefined;
  getUpcomingAudits: () => Audit[];
  getAuditsByStatus: (status: AuditStatus) => Audit[];
}

export const useAuditStore = create<AuditStore>((set, get) => ({
  // Initial state
  audits: [],
  isLoading: false,

  // Load audits from storage
  loadAudits: () => {
    set({ isLoading: true });
    const audits = dataStore.getAudits();
    set({ audits, isLoading: false });
  },

  // Create a new audit
  createAudit: (location, auditType, scheduledDate) => {
    const template = auditType === 'MRR' ? MRR_TEMPLATE : FSR_TEMPLATE;

    // Flatten template into checklist items
    const checklistItems: ChecklistItem[] = Object.values(template).flatMap(
      (section) =>
        section.items.map((item) => ({
          ...item,
          completed: false,
        }))
    );

    const newAudit: Audit = {
      id: uuidv4(),
      location,
      auditType,
      scheduledDate,
      status: 'pending',
      checklistItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dataStore.saveAudit(newAudit);
    set({ audits: [...get().audits, newAudit] });

    return newAudit;
  },

  // Delete an audit
  deleteAudit: (id) => {
    dataStore.deleteAudit(id);
    set({ audits: get().audits.filter((a) => a.id !== id) });
  },

  // Update audit properties
  updateAudit: (id, updates) => {
    // #region agent log
    const beforeUpdate = { id, updates, auditsCount: get().audits.length, auditExists: !!get().audits.find((a) => a.id === id) };
    fetch('http://127.0.0.1:7242/ingest/515cbd0a-e7df-4255-9a88-68d69ed0f6af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'store.ts:90',message:'updateAudit - entry',data:beforeUpdate,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    // Update localStorage first
    dataStore.updateAudit(id, updates);
    
    // #region agent log
    const fromStorage = dataStore.getAudit(id);
    fetch('http://127.0.0.1:7242/ingest/515cbd0a-e7df-4255-9a88-68d69ed0f6af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'store.ts:97',message:'updateAudit - after dataStore.updateAudit',data:{fromStorage:fromStorage ? {id:fromStorage.id,checklistItemsCount:fromStorage.checklistItems?.length,completedCount:fromStorage.checklistItems?.filter((item) => item.completed).length} : null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    // Update Zustand store state - ensure new object references for React
    const currentAudits = get().audits;
    const updatedAudits = currentAudits.map((a) => {
      if (a.id === id) {
        // Create a completely new object with new checklistItems array reference
        const updatedAudit = {
          ...a,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        // Ensure checklistItems is a new array reference if it's being updated
        if (updates.checklistItems) {
          updatedAudit.checklistItems = [...updates.checklistItems];
        }
        return updatedAudit;
      }
      return a;
    });

    // Force update by creating a brand new array reference
    set({ audits: [...updatedAudits] });
    
    // #region agent log
    const afterUpdate = { auditsCount: get().audits.length, auditInStore: get().audits.find((a) => a.id === id), auditInStoreCompletedCount: get().audits.find((a) => a.id === id)?.checklistItems?.filter((item) => item.completed).length };
    fetch('http://127.0.0.1:7242/ingest/515cbd0a-e7df-4255-9a88-68d69ed0f6af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'store.ts:108',message:'updateAudit - after set',data:afterUpdate,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
  },

  // Update audit status
  updateStatus: (id, status) => {
    get().updateAudit(id, { status });
  },

  // Toggle a checklist item's completion status
  toggleChecklistItem: (auditId, itemId) => {
    // #region agent log
    const beforeState = { auditId, itemId, auditsCount: get().audits.length, auditExists: !!get().audits.find((a) => a.id === auditId) };
    fetch('http://127.0.0.1:7242/ingest/515cbd0a-e7df-4255-9a88-68d69ed0f6af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'store.ts:98',message:'toggleChecklistItem - entry',data:beforeState,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    const audit = get().audits.find((a) => a.id === auditId);
    if (!audit) return;

    const itemBefore = audit.checklistItems.find((item) => item.id === itemId);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/515cbd0a-e7df-4255-9a88-68d69ed0f6af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'store.ts:105',message:'toggleChecklistItem - item before toggle',data:{itemId,completedBefore:itemBefore?.completed},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    const updatedItems = audit.checklistItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            completed: !item.completed,
            completedAt: !item.completed ? new Date().toISOString() : undefined,
          }
        : item
    );

    // Auto-update status based on progress
    const completedCount = updatedItems.filter((item) => item.completed).length;
    const totalCount = updatedItems.length;
    let newStatus: AuditStatus = audit.status;

    if (completedCount === 0) {
      newStatus = 'pending';
    } else if (completedCount === totalCount) {
      newStatus = 'complete';
    } else if (audit.status === 'pending') {
      newStatus = 'in_progress';
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/515cbd0a-e7df-4255-9a88-68d69ed0f6af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'store.ts:125',message:'toggleChecklistItem - before updateAudit',data:{completedCount,totalCount,newStatus,itemCompletedAfter:updatedItems.find((item) => item.id === itemId)?.completed},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    // Use the existing updateAudit method which updates both dataStore and Zustand state
    get().updateAudit(auditId, {
      checklistItems: updatedItems,
      status: newStatus,
    });

    // #region agent log
    const afterState = { auditsCountAfter: get().audits.length, auditAfter: get().audits.find((a) => a.id === auditId), itemAfter: get().audits.find((a) => a.id === auditId)?.checklistItems.find((item) => item.id === itemId) };
    fetch('http://127.0.0.1:7242/ingest/515cbd0a-e7df-4255-9a88-68d69ed0f6af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'store.ts:137',message:'toggleChecklistItem - after updateAudit',data:afterState,timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
  },

  // Update checklist item notes
  updateChecklistItemNotes: (auditId, itemId, notes) => {
    const audit = get().audits.find((a) => a.id === auditId);
    if (!audit) return;

    const updatedItems = audit.checklistItems.map((item) =>
      item.id === itemId ? { ...item, notes } : item
    );

    dataStore.updateAudit(auditId, { checklistItems: updatedItems });
    get().loadAudits();
  },

  // Get audit by ID
  getAuditById: (id) => {
    return get().audits.find((a) => a.id === id);
  },

  // Get upcoming audits (not complete, sorted by date)
  getUpcomingAudits: () => {
    return get()
      .audits.filter((a) => a.status !== 'complete')
      .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
  },

  // Get audits by status
  getAuditsByStatus: (status) => {
    return get().audits.filter((a) => a.status === status);
  },
}));
