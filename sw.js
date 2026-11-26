// Service worker da Família FR: só cuida das notificações push (não guarda nada em cache).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title: "Família FR", body: e.data ? e.data.text() : "" }; }
  const url = new URL(d.url || "./", self.registration.scope).href;
  const icone = /nutri\.html/.test(url) ? "img/icone/nutri-192.png" : "img/icone/fr-192.png";
  e.waitUntil(self.registration.showNotification(d.title || "Família FR", {
    body: d.body || "", icon: icone, badge: icone, data: { url }, tag: d.tag || undefined, renotify: !!d.tag
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil((async () => {
    const abas = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of abas) {
      if (c.url.split("#")[0].split("?")[0] === url.split("#")[0].split("?")[0] && "focus" in c) { try { await c.navigate(url); } catch (err) {} return c.focus(); }
    }
    return self.clients.openWindow(url);
  })());
});
