import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase_config';

export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const token = await getToken(messaging, {
      vapidKey: "BKmZBbsta9WD3dh5WvTp2WwN2NA3KgbXq9kqZvtdOzEbhkLl35NL8p0pKlXGM1qZDNXj9Gzpql0MOpYEPf_eUfA"
    });
    console.log('FCM Token:', token);
    return token;
  }
  return null;
}

export function onForegroundMessage(callback) {
  onMessage(messaging, callback);
}
