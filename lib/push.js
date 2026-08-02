// ---------------------------------------------------------------------------
// lib/push.js — server-side Web Push helper. Sends push notifications to a
// user's subscribed devices using the VAPID keys and stored subscriptions.
// ---------------------------------------------------------------------------
import webpush from "web-push";
import { prisma } from "./db.js";

// Configure VAPID credentials from environment variables.
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@acorn.app";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

/**
 * Send a push notification to every device subscribed to `userId`.
 * Silently swallows errors for individual subscriptions (expired keys are
 * auto-cleaned). Returns the number of successful sends.
 */
export async function sendPushToUser(userId, payload) {
  if (!vapidPublicKey || !vapidPrivateKey) return 0;

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  if (!subscriptions.length) return 0;

  const body = JSON.stringify(payload);
  let sent = 0;

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          body
        );
        sent += 1;
      } catch (err) {
        // 404 / 410 = subscription expired or unsubscribed — remove it.
        if (err.statusCode === 404 || err.statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        }
      }
    })
  );

  return sent;
}

/**
 * Notify multiple users in parallel. Returns the total number of successful
 * sends across all users.
 */
export async function sendPushToUsers(userIds, payload) {
  const results = await Promise.allSettled(
    userIds.map((uid) => sendPushToUser(uid, payload))
  );
  return results.reduce((sum, r) => sum + (r.status === "fulfilled" ? r.value : 0), 0);
}
