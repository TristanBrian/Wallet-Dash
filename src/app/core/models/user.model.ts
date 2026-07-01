export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'BTC';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  currency: CurrencyCode;
  notifications: NotificationPreferences;
  apiKeys: ApiKey[];
}

export interface NotificationPreferences {
  priceAlerts: boolean;
  transactionUpdates: boolean;
  marketNews: boolean;
  securityAlerts: boolean;
}

export interface ApiKey {
  id: string;
  label: string;
  keyPreview: string;
  createdAt: string;
  permissions: string[];
}
