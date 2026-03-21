// staffData.ts — STL IO|IR Portal
// Single source of truth for all staff data across the portal.
// Based on real roster and certification spreadsheet provided by client.

export type AccessLevel = "admin" | "manager" | "clinical" | "front_office";

export type StaffMember = {
  id: string;
  firstName: string;
  preferredName?: string;
  lastName: string;
  fullName: string;
  designation: string;       // credentials after name (MD, RN, FNP-C, etc.)
  jobTitle: string;
  department: string;
  accessLevel: AccessLevel;
  workLocation: string;
  reportsTo: string;
  birthday: string;          // mm/dd
  companyEmail: string;
  persEmail: string;
  persPhone: string;
  homeAddress: string;
  hireDate: string;
  startDate: string;
  status: "active" | "inactive";
  initials: string;
  avatarColor: string;
  // Certifications
  certs: {
    mdMoExp?: string;        // MD Missouri license expiry
    rnExp?: string;          // RN license expiry
    ccrnCert?: string;       // CCRN certification status/note
    arrtExp?: string;        // ARRT expiry
    blsExp?: string;         // BLS expiry
    aclsExp?: string;        // ACLS expiry
    palsExp?: string;        // PALS expiry
    hipaaExp?: string;       // HIPAA training expiry
    bbPathExp?: string;      // BB Path expiry
  };
};

export const STAFF: StaffMember[] = [
  {
    id: "kv001",
    firstName: "Kirubahara",
    preferredName: "Kiru",
    lastName: "Vaheesan",
    fullName: "Kirubahara Vaheesan",
    designation: "MD",
    jobTitle: "CEO, Medical Director",
    department: "Leadership",
    accessLevel: "admin",
    workLocation: "STL IO|IR — Main Clinic",
    reportsTo: "Board of Directors",
    birthday: "1/21",
    companyEmail: "k.vaheesan@stlioir.com",
    persEmail: "kvaheesan@gmail.com",
    persPhone: "(314) 555-0101",
    homeAddress: "St. Louis, MO",
    hireDate: "Jan 1, 2022",
    startDate: "Jan 1, 2022",
    status: "active",
    initials: "KV",
    avatarColor: "bg-cyan-500",
    certs: {
      mdMoExp: "1/31/2027",
      rnExp: "n/a",
      ccrnCert: "n/a",
      arrtExp: "n/a",
      blsExp: "4/09/2027",
      aclsExp: "5/14/2027",
      palsExp: undefined,
      hipaaExp: undefined,
      bbPathExp: undefined,
    },
  },
  {
    id: "dl002",
    firstName: "Donna",
    lastName: "Looser",
    fullName: "Donna Looser",
    designation: "",
    jobTitle: "COO",
    department: "Leadership",
    accessLevel: "admin",
    workLocation: "STL IO|IR — Main Clinic",
    reportsTo: "Kirubahara Vaheesan",
    birthday: "8/30",
    companyEmail: "d.looser@stlioir.com",
    persEmail: "dlooser@gmail.com",
    persPhone: "(314) 555-0102",
    homeAddress: "St. Louis, MO",
    hireDate: "Mar 1, 2022",
    startDate: "Mar 1, 2022",
    status: "active",
    initials: "DL",
    avatarColor: "bg-emerald-500",
    certs: {
      mdMoExp: "n/a",
      rnExp: undefined,
      ccrnCert: undefined,
      arrtExp: undefined,
      blsExp: undefined,
      aclsExp: undefined,
      palsExp: undefined,
      hipaaExp: "11/15/2027",
      bbPathExp: "n/a",
    },
  },
  {
    id: "hb003",
    firstName: "Hosea",
    preferredName: "Bart",
    lastName: "Bartlett",
    fullName: "Hosea (Bart) Bartlett",
    designation: "",
    jobTitle: "VP - Business Development",
    department: "Business Development",
    accessLevel: "manager",
    workLocation: "STL IO|IR — Main Clinic",
    reportsTo: "Donna Looser",
    birthday: "6/10",
    companyEmail: "h.bartlett@stlioir.com",
    persEmail: "hbartlett@gmail.com",
    persPhone: "(314) 555-0103",
    homeAddress: "St. Louis, MO",
    hireDate: "Jun 1, 2022",
    startDate: "Jun 1, 2022",
    status: "active",
    initials: "HB",
    avatarColor: "bg-violet-500",
    certs: {
      mdMoExp: "n/a",
      rnExp: "n/a",
      ccrnCert: undefined,
      arrtExp: undefined,
      blsExp: undefined,
      aclsExp: undefined,
      palsExp: undefined,
      hipaaExp: "req",
      bbPathExp: "n/a",
    },
  },
  {
    id: "ei004",
    firstName: "Elizabeth",
    preferredName: "Liz",
    lastName: "Ireland",
    fullName: "Elizabeth (Liz) Ireland",
    designation: "RN",
    jobTitle: "Lead RN",
    department: "Clinical",
    accessLevel: "clinical",
    workLocation: "STL IO|IR — Main Clinic",
    reportsTo: "Kirubahara Vaheesan",
    birthday: "6/29",
    companyEmail: "e.ireland@stlioir.com",
    persEmail: "eireland@gmail.com",
    persPhone: "(314) 555-0104",
    homeAddress: "St. Louis, MO",
    hireDate: "Apr 1, 2022",
    startDate: "Apr 1, 2022",
    status: "active",
    initials: "EI",
    avatarColor: "bg-rose-500",
    certs: {
      mdMoExp: "n/a",
      rnExp: "4/30/2027",
      ccrnCert: undefined,
      arrtExp: undefined,
      blsExp: "02/2028",
      aclsExp: "02/2028",
      palsExp: "enrolled 1/9/26",
      hipaaExp: undefined,
      bbPathExp: undefined,
    },
  },
  {
    id: "rs005",
    firstName: "Richard",
    preferredName: "Rich",
    lastName: "Storey",
    fullName: "Richard (Rich) Storey",
    designation: "RN",
    jobTitle: "RN",
    department: "Clinical",
    accessLevel: "clinical",
    workLocation: "STL IO|IR — Main Clinic",
    reportsTo: "Elizabeth Ireland",
    birthday: "2/16",
    companyEmail: "r.storey@stlioir.com",
    persEmail: "rstorey@gmail.com",
    persPhone: "(314) 555-0105",
    homeAddress: "St. Louis, MO",
    hireDate: "Aug 1, 2022",
    startDate: "Aug 1, 2022",
    status: "active",
    initials: "RS",
    avatarColor: "bg-amber-500",
    certs: {
      mdMoExp: "n/a",
      rnExp: "4/30/2027",
      ccrnCert: "approved to recert 1/14/26 DL",
      arrtExp: undefined,
      blsExp: "1/9/28",
      aclsExp: "01/09/28",
      palsExp: "1/14/26",
      hipaaExp: undefined,
      bbPathExp: undefined,
    },
  },
  {
    id: "mp006",
    firstName: "Melissa",
    lastName: "Poss",
    fullName: "Melissa Poss",
    designation: "RT (R, VI)",
    jobTitle: "Lead RT (R, VI)",
    department: "Clinical",
    accessLevel: "clinical",
    workLocation: "STL IO|IR — Main Clinic",
    reportsTo: "Kirubahara Vaheesan",
    birthday: "12/17",
    companyEmail: "m.poss@stlioir.com",
    persEmail: "mposs@gmail.com",
    persPhone: "(314) 555-0106",
    homeAddress: "St. Louis, MO",
    hireDate: "May 1, 2022",
    startDate: "May 1, 2022",
    status: "active",
    initials: "MP",
    avatarColor: "bg-teal-500",
    certs: {
      mdMoExp: "n/a",
      rnExp: "n/a",
      ccrnCert: undefined,
      arrtExp: "11/30/2027",
      blsExp: "enrolled 1/9/26",
      aclsExp: undefined,
      palsExp: undefined,
      hipaaExp: undefined,
      bbPathExp: undefined,
    },
  },
  {
    id: "ts007",
    firstName: "Toya",
    lastName: "Simpson",
    fullName: "Toya Simpson",
    designation: "RT (R, VI)",
    jobTitle: "RT (R, VI)",
    department: "Clinical",
    accessLevel: "clinical",
    workLocation: "STL IO|IR — Main Clinic",
    reportsTo: "Melissa Poss",
    birthday: "1/29",
    companyEmail: "t.simpson@stlioir.com",
    persEmail: "tsimpson@gmail.com",
    persPhone: "(314) 555-0107",
    homeAddress: "St. Louis, MO",
    hireDate: "Jul 1, 2022",
    startDate: "Jul 1, 2022",
    status: "active",
    initials: "TS",
    avatarColor: "bg-indigo-500",
    certs: {
      mdMoExp: "n/a",
      rnExp: "n/a",
      ccrnCert: undefined,
      arrtExp: "12/31/2027",
      blsExp: "12/31/2027",
      aclsExp: undefined,
      palsExp: undefined,
      hipaaExp: undefined,
      bbPathExp: undefined,
    },
  },
  {
    id: "dr008",
    firstName: "Deanna",
    lastName: "Ross",
    fullName: "Deanna Ross",
    designation: "",
    jobTitle: "Front Desk",
    department: "Front Office",
    accessLevel: "front_office",
    workLocation: "STL IO|IR — Main Clinic",
    reportsTo: "Donna Looser",
    birthday: "12/24",
    companyEmail: "d.ross@stlioir.com",
    persEmail: "dross@gmail.com",
    persPhone: "(314) 555-0108",
    homeAddress: "St. Louis, MO",
    hireDate: "Sep 1, 2022",
    startDate: "Sep 1, 2022",
    status: "active",
    initials: "DR",
    avatarColor: "bg-pink-500",
    certs: {
      mdMoExp: "n/a",
      rnExp: "n/a",
      ccrnCert: "n/a",
      arrtExp: "n/a",
      blsExp: "n/a",
      aclsExp: "n/a",
      palsExp: "n/a",
      hipaaExp: "req",
      bbPathExp: "for Admin",
    },
  },
  {
    id: "cs009",
    firstName: "Casey",
    lastName: "Suhl",
    fullName: "Casey Suhl",
    designation: "RT (R, CT)",
    jobTitle: "RT (R, CT)",
    department: "Clinical",
    accessLevel: "clinical",
    workLocation: "STL IO|IR — Main Clinic",
    reportsTo: "Melissa Poss",
    birthday: "9/1",
    companyEmail: "c.suhl@stlioir.com",
    persEmail: "csuhl@gmail.com",
    persPhone: "(314) 555-0109",
    homeAddress: "St. Louis, MO",
    hireDate: "Oct 1, 2022",
    startDate: "Oct 1, 2022",
    status: "active",
    initials: "CS",
    avatarColor: "bg-orange-500",
    certs: {
      mdMoExp: "n/a",
      rnExp: "n/a",
      ccrnCert: "n/a",
      arrtExp: "9/1/2026",
      blsExp: undefined,
      aclsExp: undefined,
      palsExp: undefined,
      hipaaExp: undefined,
      bbPathExp: undefined,
    },
  },
  {
    id: "es010",
    firstName: "Elise",
    lastName: "Sullivan",
    fullName: "Elise Sullivan",
    designation: "FNP-C",
    jobTitle: "FNP-C",
    department: "Clinical",
    accessLevel: "clinical",
    workLocation: "STL IO|IR — Main Clinic",
    reportsTo: "Kirubahara Vaheesan",
    birthday: "9/13",
    companyEmail: "e.sullivan@stlioir.com",
    persEmail: "esullivan@gmail.com",
    persPhone: "(314) 555-0110",
    homeAddress: "St. Louis, MO",
    hireDate: "Nov 1, 2022",
    startDate: "Nov 1, 2022",
    status: "active",
    initials: "ES",
    avatarColor: "bg-lime-500",
    certs: {
      mdMoExp: undefined,
      rnExp: undefined,
      ccrnCert: undefined,
      arrtExp: undefined,
      blsExp: undefined,
      aclsExp: undefined,
      palsExp: undefined,
      hipaaExp: undefined,
      bbPathExp: undefined,
    },
  },
  {
    id: "am011",
    firstName: "Ali",
    lastName: "Malik",
    fullName: "Ali Malik",
    designation: "MD",
    jobTitle: "MD",
    department: "Clinical",
    accessLevel: "clinical",
    workLocation: "STL IO|IR — Main Clinic",
    reportsTo: "Kirubahara Vaheesan",
    birthday: "6/14",
    companyEmail: "a.malik@stlioir.com",
    persEmail: "amalik@gmail.com",
    persPhone: "(314) 555-0111",
    homeAddress: "St. Louis, MO",
    hireDate: "Jan 1, 2023",
    startDate: "Jan 1, 2023",
    status: "active",
    initials: "AM",
    avatarColor: "bg-sky-500",
    certs: {
      mdMoExp: undefined,
      rnExp: undefined,
      ccrnCert: undefined,
      arrtExp: undefined,
      blsExp: undefined,
      aclsExp: undefined,
      palsExp: undefined,
      hipaaExp: undefined,
      bbPathExp: undefined,
    },
  },
];

// Helper: get staff by ID
export function getStaffById(id: string): StaffMember | undefined {
  return STAFF.find(s => s.id === id);
}

// Helper: get display name (preferred name if available)
export function displayName(s: StaffMember): string {
  return s.preferredName ? `${s.preferredName} ${s.lastName}` : `${s.firstName} ${s.lastName}`;
}

// Helper: parse expiry date string to Date (handles formats like "1/31/2027", "4/30/2027", "02/2028")
export function parseExpiry(exp?: string): Date | null {
  if (!exp || exp === "n/a" || exp === "req" || exp.toLowerCase().includes("enrolled") || exp.toLowerCase().includes("approved") || exp.toLowerCase().includes("for ")) return null;
  // Try mm/dd/yyyy
  const full = exp.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (full) return new Date(parseInt(full[3]), parseInt(full[1]) - 1, parseInt(full[2]));
  // Try mm/yyyy
  const monthYear = exp.match(/^(\d{1,2})\/(\d{4})$/);
  if (monthYear) return new Date(parseInt(monthYear[2]), parseInt(monthYear[1]) - 1, 1);
  return null;
}

// Helper: expiry status
export type ExpiryStatus = "expired" | "expiring_soon" | "valid" | "na" | "pending";

export function expiryStatus(exp?: string): ExpiryStatus {
  if (!exp) return "pending";
  if (exp === "n/a") return "na";
  if (exp === "req" || exp.toLowerCase().includes("enrolled") || exp.toLowerCase().includes("approved") || exp.toLowerCase().includes("for ")) return "pending";
  const date = parseExpiry(exp);
  if (!date) return "pending";
  const now = new Date();
  const ninetyDays = new Date();
  ninetyDays.setDate(ninetyDays.getDate() + 90);
  if (date < now) return "expired";
  if (date <= ninetyDays) return "expiring_soon";
  return "valid";
}

export const EXPIRY_STYLE: Record<ExpiryStatus, { label: string; className: string; dot: string }> = {
  expired:       { label: "Expired",       className: "bg-red-500/15 text-red-400 border-0",     dot: "bg-red-400" },
  expiring_soon: { label: "Expiring Soon", className: "bg-amber-500/15 text-amber-400 border-0", dot: "bg-amber-400" },
  valid:         { label: "Valid",          className: "bg-emerald-500/15 text-emerald-400 border-0", dot: "bg-emerald-400" },
  na:            { label: "N/A",            className: "bg-slate-500/15 text-slate-400 border-0", dot: "bg-slate-500" },
  pending:       { label: "Pending",        className: "bg-blue-500/15 text-blue-400 border-0",   dot: "bg-blue-400" },
};

export const ACCESS_LEVEL_LABEL: Record<AccessLevel, string> = {
  admin: "Admin",
  manager: "Manager",
  clinical: "Clinical Staff",
  front_office: "Front Office",
};

export const DEPT_COLOR: Record<string, string> = {
  Leadership: "text-cyan-400",
  "Business Development": "text-violet-400",
  Clinical: "text-emerald-400",
  "Front Office": "text-pink-400",
};
