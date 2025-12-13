import type { ChecklistTemplate } from '../../types';

export const MRR_TEMPLATE: ChecklistTemplate = {
  section_i_format: {
    name: "Format",
    items: [
      {
        id: "mrr_i_1",
        description: "Each page includes member identification",
        category: "Organization & Identification"
      },
      {
        id: "mrr_i_2",
        description: "Records are logically organized",
        category: "Organization & Identification"
      },
      {
        id: "mrr_i_3",
        description: "Personal biographical information is complete and current",
        category: "Organization & Identification"
      },
      {
        id: "mrr_i_4",
        description: "All allergies prominently noted on summary list",
        category: "Key Information"
      },
      {
        id: "mrr_i_5",
        description: "Chronic problems prominently noted on summary list",
        category: "Key Information"
      },
      {
        id: "mrr_i_6",
        description: "List of current continuous medications actively maintained",
        category: "Key Information"
      },
      {
        id: "mrr_i_7",
        description: "All entries are signed and dated",
        category: "Legibility & Entries"
      },
      {
        id: "mrr_i_8",
        description: "All entries are legible",
        category: "Legibility & Entries"
      },
      {
        id: "mrr_i_9",
        description: "Errors corrected with single line through, initialed and dated",
        category: "Legibility & Entries"
      },
      {
        id: "mrr_i_10",
        description: "No unexplained cross-outs, erasures, or correction fluid",
        category: "Legibility & Entries"
      },
      {
        id: "mrr_i_11",
        description: "Signed Release of Medical Records consent present",
        category: "Consents"
      },
      {
        id: "mrr_i_12",
        description: "Signed Informed Consent for invasive procedures (when applicable)",
        category: "Consents"
      },
      {
        id: "mrr_i_13",
        description: "Signed Notice of Privacy present",
        category: "Consents"
      }
    ]
  },
  section_ii_documentation: {
    name: "Documentation",
    items: []
  },
  section_iii_coordination: {
    name: "Coordination of Care",
    items: [
      {
        id: "mrr_iii_1",
        description: "History of present illness or reason for visit documented for each visit",
        category: "Encounter Documentation"
      },
      {
        id: "mrr_iii_2",
        description: "Working diagnoses consistent with clinical findings",
        category: "Encounter Documentation"
      },
      {
        id: "mrr_iii_3",
        description: "Treatment plans consistent with diagnoses",
        category: "Encounter Documentation"
      },
      {
        id: "mrr_iii_4",
        description: "Follow-up care instructions documented with definite timeframe",
        category: "Follow-Up"
      },
      {
        id: "mrr_iii_5",
        description: "Unresolved continuing problems addressed in subsequent visits",
        category: "Follow-Up"
      },
      {
        id: "mrr_iii_6",
        description: "Evidence of practitioner review of specialty/consult/referral reports (initials/signature)",
        category: "Review of Reports"
      },
      {
        id: "mrr_iii_7",
        description: "Evidence of practitioner review of diagnostic test results",
        category: "Review of Reports"
      },
      {
        id: "mrr_iii_8",
        description: "Evidence of patient follow-up for specialty/consult reports",
        category: "Follow-Up"
      },
      {
        id: "mrr_iii_9",
        description: "Evidence of patient follow-up for diagnostic test results",
        category: "Follow-Up"
      },
      {
        id: "mrr_iii_10",
        description: "Missed/broken appointments documented with follow-up attempts",
        category: "Follow-Up"
      }
    ]
  },
  section_iv_preventive: {
    name: "Pediatric Preventive Care",
    items: [
      {
        id: "mrr_iv_1",
        description: "Initial Health Appointment (IHA) documented",
        category: "Health Assessments"
      },
      {
        id: "mrr_iv_2",
        description: "Periodic health exams at age-appropriate frequencies",
        category: "Health Assessments"
      },
      {
        id: "mrr_iv_3",
        description: "Developmental Disorder screening documented",
        category: "Required Screenings"
      },
      {
        id: "mrr_iv_4",
        description: "Autism Spectrum Disorder screening documented",
        category: "Required Screenings"
      },
      {
        id: "mrr_iv_5",
        description: "Blood Lead screening documented (age-appropriate)",
        category: "Required Screenings"
      },
      {
        id: "mrr_iv_6",
        description: "Anemia screening documented",
        category: "Required Screenings"
      },
      {
        id: "mrr_iv_7",
        description: "Vision screening documented",
        category: "Required Screenings"
      },
      {
        id: "mrr_iv_8",
        description: "Hearing screening documented",
        category: "Required Screenings"
      },
      {
        id: "mrr_iv_9",
        description: "Depression screening documented (ages 12+)",
        category: "Required Screenings"
      },
      {
        id: "mrr_iv_10",
        description: "Suicide-risk screening documented (when applicable)",
        category: "Required Screenings"
      },
      {
        id: "mrr_iv_11",
        description: "Maternal depression screening documented",
        category: "Required Screenings"
      },
      {
        id: "mrr_iv_12",
        description: "Dental/Oral health counseling documented",
        category: "Required Counseling"
      },
      {
        id: "mrr_iv_13",
        description: "Fluoride varnish application documented",
        category: "Required Counseling"
      },
      {
        id: "mrr_iv_14",
        description: "Alcohol/Drug use counseling documented",
        category: "Required Counseling"
      },
      {
        id: "mrr_iv_15",
        description: "Tobacco use counseling documented",
        category: "Required Counseling"
      },
      {
        id: "mrr_iv_16",
        description: "STI counseling documented (when age-appropriate)",
        category: "Required Counseling"
      },
      {
        id: "mrr_iv_17",
        description: "DTaP series completion documented (5 doses)",
        category: "Immunizations"
      },
      {
        id: "mrr_iv_18",
        description: "MMR 2-dose series documented",
        category: "Immunizations"
      },
      {
        id: "mrr_iv_19",
        description: "Varicella 2-dose series documented",
        category: "Immunizations"
      },
      {
        id: "mrr_iv_20",
        description: "HPV series initiated and documented (ages 9+)",
        category: "Immunizations"
      },
      {
        id: "mrr_iv_21",
        description: "Vaccine Information Statement (VIS) provided for each vaccine",
        category: "Immunizations"
      },
      {
        id: "mrr_iv_22",
        description: "Complete vaccine administration details (date, site, manufacturer, lot number)",
        category: "Immunizations"
      }
    ]
  }
};
