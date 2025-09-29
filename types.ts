export enum PermissionLevel {
  READ_ONLY = 'read_only',
  DATA_ENTRY = 'data_entry',
  EDITOR = 'editor',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  username: string;
  password?: string; // Optional because we don't want to expose it everywhere
  permissions: PermissionLevel;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export type CellValue = string | number | boolean;

export interface Cell {
  id: string;
  value: CellValue;
}

export interface Row {
  id: string;
  cells: Cell[];
}

export interface Sheet {
  id: string;
  title: string;
  headers: string[];
  rows: Row[];
}

export interface DashboardCard {
  id: string;
  title: string;
  path: string;
  icon: string; // Name of the icon
  desc: string;
  adminOnly?: boolean;
}

export interface ThemeSettings {
  backgroundColor: string;
  backgroundImage: string;
}

export interface SharedNotes {
  title: string;
  content: string;
}

export interface CollaborativeNote {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: string;
}
