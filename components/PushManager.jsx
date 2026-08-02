"use client";

import { useEffect, useRef, useState } from "react";

/** VAPID public key from environment (exposed via NEXT_PUBLIC_ prefix). */
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

/**
 * Converts a URL-safe base64 string to a Uint8Array for the Push API.
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Client-side push notification manager. Runs once on mount: registers the
 * service worker, checks notification permission, subscribes to Web Push,
 * and stores the subscription via /api/push/subscribe. Automatically cleans
 * up expired subscriptions on unmount.
 *
 * Renders nothing visible — it's a headless effect component.
 */
export function PushManager() {
  const registered = useRef(false);

  useEffect(() => {
    if (registered.current) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    if (!VAPID_PUBLIC_KEY) return;
    registered.current = true;

    (async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");

        // Wait for the SW to be ready (installed & active).
        await navigator.serviceWorker.ready;

        // If already subscribed, just ensure the server has the current one.
        let subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await syncSubscription(subscription);
          return;
        }

        // Not yet subscribed — request permission.
        if (Notification.permission === "default") {
          const result = await Notification.requestPermission();
          if (result !== "granted") return;
        }
        if (Notification.permission === "denied") return;

        // Subscribe to Web Push.
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        await syncSubscription(subscription);
      } catch {
        // SW registration or subscription failed — silently ignore. Push is
        // best-effort; the app works fine without it.
      }
    })();

    // Cleanup: remove subscription from server when the user leaves.
    return () => {
      navigator.serviceWorker.ready
        .then((reg) => reg.pushManager.getSubscription())
        .then((sub) => {
          if (sub) {
            fetch("/api/push/unsubscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ endpoint: sub.endpoint }),
            }).catch(() => {});
          }
        })
        .catch(() => {});
    };
  }, []);

  return null;
}

/**
 * Send the current push subscription to the server. If the server rejects it
 * (e.g. endpoint expired), unsubscribe locally so a fresh one is created on
 * next visit.
 */
async function syncSubscription(subscription) {
  const { endpoint, keys } = subscription.toJSON();
  if (!keys) return;

  try {
    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint, p256dh: keys.p256dh, auth: keys.auth }),
    });
    if (!res.ok) {
      // Server rejected — unsubscribe so we can try fresh next time.
      await subscription.unsubscribe().catch(() => {});
    }
  } catch {
    // Network error — will retry on next page load.
  }
}
