// public/sw.js — Service Worker for Web Push notifications.
// Receives push events from the server and shows native notifications.
// Clicking a notification opens/focuses the app dashboard.

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Acorn", body: event.data.text() };
  }

  const { title = "Acorn", body, icon = "/android-chrome-192x192.png", badge = "/android-chrome-192x192.png", url = "/dashboard", tag } = payload;

  const options = {
    body,
    icon,
    badge,
    data: { url },
    tag: tag || "acorn-notification",
    renotify: true,
    vibrate: [100, 50, 100],
    actions: [
      { action: "open", title: "Open" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Focus existing window if open, otherwise open new one.
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
