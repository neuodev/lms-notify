export interface UserRole {
  id: number;
  name: string;
  description?: string;
  pivot?: {
    model_id: number;
    role_id: number;
  };
}

export interface User {
  id: number;
  fullname?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  parent?: { phone?: string };
  parents?: Array<{ phone?: string }>;
  roles?: UserRole[];
  email?: string;
  level?: string;
  avatar?: string;
}

export interface ExcelUser {
  id: number;
  name: string;
  email: string;
  level: string;
  phone: string;
  parentPhone: string;
}

export interface ExcelParseResult {
  users: User[];
  fileName: string;
  count: number;
}

export interface FilterState {
  name: string;
  roleId: number | null;
  level: string | null;
  hasPhoneOnly: boolean;
}

export interface WhatsAppStatus {
  authenticated: boolean;
  qr?: string;
}

export type LMS_TYPE = "LERNOVIA" | "CLASSERA" | "MICROSOFT_TEAMS" | "COLIGO";
