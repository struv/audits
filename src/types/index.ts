// Location IDs for all audit sites
export type LocationId =
  | 'agoura_hills'
  | 'arcadia'
  | 'beverly_hills'
  | 'canyon_country'
  | 'culver_city'
  | 'downey'
  | 'glendale'
  | 'hollywood'
  | 'la_canada'
  | 'la_mirada'
  | 'mission_hills'
  | 'northridge'
  | 'pico_rivera'
  | 'pasadena'
  | 'tarzana'
  | 'san_fernando'
  | 'santa_monica'
  | 'torrance'
  | 'valencia'
  | 'van_nuys'
  | 'west_hills'
  | 'whittier';

export type AuditType = 'MRR' | 'FSR';

export type AuditStatus = 'pending' | 'in_progress' | 'complete';

// Individual checklist item
export interface ChecklistItem {
  id: string;
  description: string;
  category: string;
  completed: boolean;
  completedAt?: string; // ISO timestamp
  notes?: string;
}

// Main audit object
export interface Audit {
  id: string; // UUID
  location: LocationId;
  auditType: AuditType;
  scheduledDate: string; // ISO date
  status: AuditStatus;
  checklistItems: ChecklistItem[];
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// Template structure for checklists
export interface ChecklistTemplate {
  [sectionKey: string]: {
    name: string;
    items: Omit<ChecklistItem, 'completed' | 'completedAt' | 'notes'>[];
  };
}

// Location display names
export const LOCATIONS: Record<LocationId, string> = {
  agoura_hills: 'Agoura Hills',
  arcadia: 'Arcadia',
  beverly_hills: 'Beverly Hills',
  canyon_country: 'Canyon Country',
  culver_city: 'Culver City',
  downey: 'Downey',
  glendale: 'Glendale',
  hollywood: 'Hollywood',
  la_canada: 'La Cañada',
  la_mirada: 'La Mirada',
  mission_hills: 'Mission Hills',
  northridge: 'Northridge',
  pico_rivera: 'Pico Rivera',
  pasadena: 'Pasadena',
  tarzana: 'Tarzana',
  san_fernando: 'San Fernando',
  santa_monica: 'Santa Monica',
  torrance: 'Torrance',
  valencia: 'Valencia',
  van_nuys: 'Van Nuys',
  west_hills: 'West Hills',
  whittier: 'Whittier',
};
