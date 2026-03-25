export const REDIS_CONNECTION = 'REDIS_CONNECTION';
export const ACTIVITY_LOG_QUEUE = 'activity-log';
export const NOTIFICATIONS_QUEUE = 'notifications';
export const GLOBAL_ROOM = 'global';

export const projectRoom = (projectId: string) => `project:${projectId}`;
