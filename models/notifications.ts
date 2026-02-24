/**
 * Types partagés pour les notifications
 * Utilisés par le serveur et l'app React Native
 */

export type NotificationType = 'nighttime-alert' | 'device-offline' | 'device-online';

export interface Notification {
  id: string;
  userId: string;
  kidooId?: string;
  type: NotificationType;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  kidoo?: {
    id: string;
    name: string;
  };
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  limit: number;
  offset: number;
}
