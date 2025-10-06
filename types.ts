
export enum Language {
  EN = 'en',
  AR = 'ar',
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'rep';
  name: string;
  password?: string;
}

export enum ClientType {
  NEW = 'new',
  OLD = 'old',
}

export enum VisitPurpose {
  OPEN_ACCOUNT = 'open_account',
  FOLLOW_PAPERS = 'follow_papers',
  FOLLOW_PAYMENT = 'follow_payment',
  FOLLOW_QUOTATIONS = 'follow_quotations',
  DELIVERY = 'delivery',
  RENEW_DEAL = 'renew_deal',
  REVIEW_INVOICE = 'review_invoice',
  FOLLOW_UP = 'follow_up',
}

export interface Geolocation {
  latitude: number;
  longitude: number;
}

export interface Visit {
  id: string;
  repId: number;
  repName: string;
  visitDate: string; // YYYY-MM-DD
  clientName: string;
  employeeName: string;
  employeePhone: string;
  companyEmail: string;
  clientLocation: Geolocation | null;
  clientType: ClientType;
  visitPurposes: VisitPurpose[];
  notes: string;
}