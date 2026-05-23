/* こころのガチャ Service Worker
 * Cache First 戦略でオフライン対応
 * GitHub Pages のサブディレクトリで動作するよう全パスを相対パスで扱う
 */

const CACHE_NAME = 'kokoro-gacha-v1';

// プリキャッシュ対象（Service Worker のスコープからの相対パス）
const PRECACHE_URLS = [
  './',
  './index.html',
  './css/style.css',
  './js/script.js',
  './manifest.json',
  './img/gacha.png',
  './icon-192.svg',
  './icon-512.svg'
];

// install: プリキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// activate: 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// fetch: Cache First 戦略
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // GET 以外はスルー（POST 等はキャッシュしない）
  if (request.method !== 'GET') {
    return;
  }

  // 同一オリジン以外（Google Fonts 等）はネットワーク優先＋失敗時キャッシュフォールバック
  const sameOrigin = new URL(request.url).origin === self.location.origin;

  if (!sameOrigin) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 成功したらキャッシュにも保存
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // opaque レスポンスもそのまま入れておく
            cache.put(request, copy).catch(() => {});
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 同一オリジン: Cache First
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request)
        .then((response) => {
          // 正常なレスポンスのみキャッシュに追加
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, copy).catch(() => {});
            });
          }
          return response;
        })
        .catch(() => {
          // ナビゲーション系のリクエストは index.html にフォールバック
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return Response.error();
        });
    })
  );
});
