/* こころのガチャ Service Worker
 * ============================================
 * Service Worker (SW) とは?
 *   ブラウザがWebサイト本体とは別に「裏側で動かす小さなプログラム」。
 *   ページのfetch (リソース取得) を横取りして、キャッシュから返すことで
 *   オフライン動作・高速化を実現する PWA の中核。
 *
 * ライフサイクル:
 *   1. register (index.htmlの末尾で navigator.serviceWorker.register('./sw.js'))
 *   2. install   - 初回ロード時。ここでファイルをキャッシュに保存。
 *   3. activate  - 有効化。古いキャッシュの削除タイミング。
 *   4. fetch     - 以降、すべてのリソース取得をここで横取りできる。
 *
 * 「Cache First」戦略:
 *   先にキャッシュを確認 → あれば即返す (オフラインでも動く)、
 *   なければネットワークから取りに行く。
 *
 * 注意:
 *   - SWは普通のJSと違いDOM操作不可。fetch/cache APIだけが主役。
 *   - self は SW 自身を指す (window の代わり)。
 *   - すべてのコールバックは Promise ベース (非同期処理)。
 */

const CACHE_NAME = 'kokoro-gacha-v1';
// ↑ ファイルを更新したら 'v2', 'v3' のように番号を上げる。
//   そうしないと古いキャッシュが返り続けて新しいコードが反映されない。

// 起動時にまとめてキャッシュするファイル一覧。
const PRECACHE_URLS = [
  './',                // index.html (ルート)
  './index.html',
  './css/style.css',
  './js/script.js',
  './manifest.json',
  './img/gacha.png',
  './icon-192.svg',
  './icon-512.svg'
];

// ===== install: 初回起動時 =====
// event.waitUntil(Promise) で「このPromiseが完了するまで install を待つ」。
// caches.open() で名前付きキャッシュを取得 → addAll で一気にプリキャッシュ。
// skipWaiting() で「すぐに有効化」(普通は前のSWが終了するまで待機する)。
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ===== activate: 有効化時 =====
// caches.keys() で「現在ブラウザに保存されているキャッシュ名の一覧」を取得。
// CACHE_NAME と違う名前のものは古いバージョン → 全部削除する。
// clients.claim() は「既に開いているタブにも即座にこのSWを適用する」指示。
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

// ===== fetch: すべてのリソース取得を横取り =====
// ブラウザが何かを取得しようとするたびにこの関数が呼ばれる。
// event.respondWith(Promise) で「代わりにこれを返す」と指定。
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // GET以外 (POST, PUT 等) はキャッシュせずスルー。
  if (request.method !== 'GET') {
    return;
  }

  // 同一オリジン (= 自分のサイト) かどうか判定。
  // Google Fonts などの外部リソースは別の扱いにする。
  const sameOrigin = new URL(request.url).origin === self.location.origin;

  if (!sameOrigin) {
    // 外部 (CDN/Fonts): ネットワーク優先、失敗したらキャッシュ。
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();    // response は1回しか使えないので複製
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, copy).catch(() => {});
          });
          return response;
        })
        .catch(() => caches.match(request))  // ネット失敗 → キャッシュから探す
    );
    return;
  }

  // 同一オリジン: Cache First (まずキャッシュを見る → なければネット)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;                       // キャッシュあり → 即返す
      }
      return fetch(request)
        .then((response) => {
          // 正常なレスポンスならキャッシュに保存。
          // basic = 同一オリジン、status 200 = 成功
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, copy).catch(() => {});
            });
          }
          return response;
        })
        .catch(() => {
          // オフライン時のフォールバック。
          // ページ遷移 (navigate) なら index.html を返してSPAっぽく振る舞う。
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return Response.error();
        });
    })
  );
});
