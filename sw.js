/* QLVH PWA · service worker · giữ khung app trong máy để mở tức thì. Đổi BAN khi cập nhật khung. */
var BAN = 'qlvh-khung-v2';
var TEP = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(BAN).then(function (c) { return c.addAll(TEP); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ds) {
    return Promise.all(ds.filter(function (k) { return k !== BAN; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;   // cổng Apps Script: không đụng
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) {
    var mang = fetch(e.request).then(function (m) {
      if (m && m.ok) { var c = m.clone(); caches.open(BAN).then(function (k) { k.put(e.request, c); }); }
      return m;
    }).catch(function () { return r; });
    return r || mang;                                  // có bản trong máy → dùng ngay, tải bản mới ở nền
  }));
});
