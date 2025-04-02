export interface NotificationModel {
    id: string;
    title: string;
    body: string;
    urgency: UrgencyLevel;
}

export enum UrgencyLevel {
    low,
    medium,
    high
}
