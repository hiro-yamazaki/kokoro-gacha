// ========================================
// こころのガチャ v3.1 - 習慣化フォーカス + プロ仕上げ
// 時間帯テーマ / 気分リアクティブ / カスタムSVG / 数字カウントアップ / 粒子背景
// ========================================

// ========================================
// 1. データ定義
// ========================================

const capsules = [
  // ===== SSR (2件 / 3%) =====
  { id: 1,  rarity: "SSR", category: "ほっとする言葉",   message: "今日は、ちゃんとここまで来ただけで十分です。",         time: "any",      mood: "any" },
  { id: 2,  rarity: "SSR", category: "ほっとする言葉",   message: "あなたが、あなたであるだけで、誰かの世界は少し温かい。", time: "any",      mood: "calm" },

  // ===== SR (6件 / 12%) =====
  { id: 3,  rarity: "SR",  category: "短い格言",         message: "静かな人ほど、深く進んでいる。",                       time: "any",      mood: "calm" },
  { id: 4,  rarity: "SR",  category: "短い格言",         message: "急がないことが、崩れない強さになる。",                 time: "any",      mood: "motivated" },
  { id: 5,  rarity: "SR",  category: "短い格言",         message: "立ち止まることも、ちゃんと歩いていることの一部です。", time: "any",      mood: "tired" },
  { id: 6,  rarity: "SR",  category: "短い格言",         message: "弱さを認められる人は、もう十分に強い人です。",         time: "any",      mood: "anxious" },
  { id: 7,  rarity: "SR",  category: "ほっとする言葉",   message: "朝が来るのを、ただ待つ夜があっていい。",               time: "night",    mood: "tired" },
  { id: 8,  rarity: "SR",  category: "短い格言",         message: "何もしなかった一日も、あなたを形作っています。",       time: "evening",  mood: "tired" },

  // ===== R (12件 / 25%) =====
  { id: 9,  rarity: "R",   category: "自分を整える一言", message: "今の自分に必要なのは、気合いではなく余白かもしれません。", time: "any",   mood: "tired" },
  { id: 10, rarity: "R",   category: "自分を整える一言", message: "考えすぎたら、まず身体をゆるめる。",                    time: "any",      mood: "anxious" },
  { id: 11, rarity: "R",   category: "自分を整える一言", message: "今日は完璧より、回復を優先していい。",                  time: "any",      mood: "tired" },
  { id: 12, rarity: "R",   category: "短い格言",         message: "整えることも、前に進むことの一部です。",                time: "any",      mood: "calm" },
  { id: 13, rarity: "R",   category: "自分を整える一言", message: "涙が出るのは、心がちゃんと働いている証拠です。",        time: "any",      mood: "anxious" },
  { id: 14, rarity: "R",   category: "短い格言",         message: "比べる相手は、昨日の自分だけで十分です。",              time: "morning",  mood: "motivated" },
  { id: 15, rarity: "R",   category: "自分を整える一言", message: "ため息は、心の換気です。我慢しなくていい。",            time: "any",      mood: "tired" },
  { id: 16, rarity: "R",   category: "短い格言",         message: "「まあいっか」は、健やかな魔法の言葉です。",            time: "any",      mood: "calm" },
  { id: 17, rarity: "R",   category: "自分を整える一言", message: "できなかったことより、続けていることに目を向けて。",    time: "evening",  mood: "motivated" },
  { id: 18, rarity: "R",   category: "短い格言",         message: "怒っていい場面で怒れることも、自分を守る力です。",      time: "any",      mood: "anxious" },
  { id: 19, rarity: "R",   category: "自分を整える一言", message: "寝る前の3分だけ、自分を褒める時間にしてみましょう。",   time: "night",    mood: "any" },
  { id: 20, rarity: "R",   category: "短い格言",         message: "急がず、休まず、自分のペースで進めばいい。",            time: "morning",  mood: "motivated" },

  // ===== N (20件 / 60%) =====
  { id: 21, rarity: "N",   category: "ほっとする言葉",   message: "焦らなくても大丈夫。深呼吸ひとつ分だけ、前に進めばいい。", time: "any",    mood: "anxious" },
  { id: 22, rarity: "N",   category: "ほっとする言葉",   message: "全部を今日片づけなくてもいい。",                       time: "any",      mood: "tired" },
  { id: 23, rarity: "N",   category: "小さなアドバイス", message: "まずは水を一口飲みましょう。",                         time: "any",      mood: "tired" },
  { id: 24, rarity: "N",   category: "小さなアドバイス", message: "スマホを閉じて、10秒だけ遠くを見てみましょう。",       time: "afternoon",mood: "tired" },
  { id: 25, rarity: "N",   category: "小さなアドバイス", message: "次にやることを、ひとつだけ決めれば大丈夫です。",       time: "any",      mood: "anxious" },
  { id: 26, rarity: "N",   category: "小さなアドバイス", message: "朝、カーテンを開けるところからで十分です。",           time: "morning",  mood: "tired" },
  { id: 27, rarity: "N",   category: "小さなアドバイス", message: "肩の力を抜いて。今、すぐ、抜けます。",                 time: "any",      mood: "anxious" },
  { id: 28, rarity: "N",   category: "小さなアドバイス", message: "お茶を一杯。それだけで小さな休憩になります。",         time: "afternoon",mood: "calm" },
  { id: 29, rarity: "N",   category: "ほっとする言葉",   message: "「やらない」を選ぶのも、立派な決断です。",             time: "any",      mood: "tired" },
  { id: 30, rarity: "N",   category: "小さなアドバイス", message: "5分だけ目を閉じる時間を、自分にあげましょう。",         time: "any",      mood: "tired" },
  { id: 31, rarity: "N",   category: "小さなアドバイス", message: "窓の外を見て、空の色を確かめてみて。",                 time: "morning",  mood: "calm" },
  { id: 32, rarity: "N",   category: "小さなアドバイス", message: "お風呂のお湯を、いつもより少し長めに。",               time: "evening",  mood: "tired" },
  { id: 33, rarity: "N",   category: "ほっとする言葉",   message: "「ありがとう」を、自分に向けて言ってみる。",           time: "any",      mood: "calm" },
  { id: 34, rarity: "N",   category: "小さなアドバイス", message: "深呼吸を3回。それだけでリセットできます。",            time: "any",      mood: "anxious" },
  { id: 35, rarity: "N",   category: "小さなアドバイス", message: "今日のごはん、ちゃんと味わってみましょう。",           time: "afternoon",mood: "calm" },
  { id: 36, rarity: "N",   category: "小さなアドバイス", message: "スマホを置いて、手を膝の上に。",                       time: "any",      mood: "anxious" },
  { id: 37, rarity: "N",   category: "ほっとする言葉",   message: "笑顔の練習だけでも、心がちょっと軽くなります。",       time: "morning",  mood: "motivated" },
  { id: 38, rarity: "N",   category: "ほっとする言葉",   message: "「だいじょうぶ」と心の中で3回唱えて。",                 time: "any",      mood: "anxious" },
  { id: 39, rarity: "N",   category: "小さなアドバイス", message: "一駅手前で降りて歩いてみる、それも休息です。",         time: "afternoon",mood: "motivated" },
  { id: 40, rarity: "N",   category: "小さなアドバイス", message: "好きな音楽を一曲、目を閉じて聴く。",                   time: "any",      mood: "tired" }
];

const RARITY_RATES = { SSR: 3, SR: 12, R: 25, N: 60 };
const RARITY_EFFECTS = {
  N:   { shakeClass: "shake",     shakeDuration: 500,  cardClass: "" },
  R:   { shakeClass: "shake-r",   shakeDuration: 700,  cardClass: "card-r" },
  SR:  { shakeClass: "shake-sr",  shakeDuration: 1000, cardClass: "card-sr" },
  SSR: { shakeClass: "shake-ssr", shakeDuration: 1400, cardClass: "card-ssr" }
};
const PITY_SR_THRESHOLD = 20;
const PITY_SSR_THRESHOLD = 80;

const KEYS = {
  count: "kg-count", collected: "kg-collected", favorites: "kg-favorites",
  streakLast: "kg-streak-last", streakCount: "kg-streak-count", streakMax: "kg-streak-max",
  pitySR: "kg-pity-sr", pitySSR: "kg-pity-ssr",
  dailyDate: "kg-daily-date", dailyOpenId: "kg-daily-open-id",
  soundOn: "kg-sound-on",
  legacyCollected: "kokoro-gacha-collected", legacyCount: "kokoro-gacha-count"
};

// ========================================
// 2. localStorage ラッパー
// ========================================

function lsGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return JSON.parse(v);
  } catch (e) { return fallback; }
}
function lsSet(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

function migrateLegacy() {
  if (lsGet(KEYS.collected, null) !== null) return;
  const legacyIds = lsGet(KEYS.legacyCollected, []);
  if (Array.isArray(legacyIds) && legacyIds.length > 0) {
    const now = Date.now();
    const migrated = {};
    legacyIds.forEach(id => { migrated[id] = { firstAt: now, lastAt: now }; });
    lsSet(KEYS.collected, migrated);
  }
  const legacyCount = lsGet(KEYS.legacyCount, 0);
  if (legacyCount && !lsGet(KEYS.count, null)) lsSet(KEYS.count, legacyCount);
}

// ========================================
// 3. ユーティリティ
// ========================================

function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function formatDateJP(str) {
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return str;
  return parseInt(m[1], 10) + "年" + parseInt(m[2], 10) + "月" + parseInt(m[3], 10) + "日";
}
function getTimeOfDay() {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 17) return "afternoon";
  if (h >= 17 && h < 22) return "evening";
  return "night";
}
function dateSeededRandom(dateStr) {
  let h = 0;
  for (let i = 0; i < dateStr.length; i++) { h = ((h << 5) - h) + dateStr.charCodeAt(i); h |= 0; }
  return Math.abs(h % 10000) / 10000;
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]);
}
function truncate(s, n) { return s.length > n ? s.slice(0, n - 1) + "…" : s; }

// SVG アイコン参照ヘルパー (テンプレ用)
function icon(id, cls) {
  return '<svg class="' + (cls || 'icon') + '"><use href="#i-' + id + '"></use></svg>';
}

// 数字カウントアップアニメ
function animateCount(el, to, duration) {
  if (!el) return;
  const from = parseInt(el.getAttribute("data-value") || el.textContent || "0", 10) || 0;
  if (from === to) { el.textContent = to; return; }
  duration = duration || 600;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const cur = Math.round(from + (to - from) * eased);
    el.textContent = cur;
    if (progress < 1) requestAnimationFrame(step);
    else {
      el.textContent = to;
      el.setAttribute("data-value", to);
      el.classList.add("tick");
      setTimeout(() => el.classList.remove("tick"), 450);
    }
  };
  requestAnimationFrame(step);
}

// ========================================
// 4. サウンド (Web Audio API)
// ========================================

let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { return null; }
  }
  return audioCtx;
}
function playTone(freq, duration, type, gain) {
  if (!lsGet(KEYS.soundOn, true)) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    g.gain.value = gain || 0.15;
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}
const SE = {
  tap:    () => playTone(880, 0.05, "sine", 0.1),
  click:  () => playTone(440, 0.06, "sine", 0.12),
  rollN:  () => playTone(330, 0.3, "triangle", 0.12),
  rollR:  () => { playTone(440, 0.4, "triangle", 0.14); setTimeout(() => playTone(587, 0.2, "sine", 0.12), 200); },
  rollSR: () => { playTone(523, 0.4, "triangle", 0.15); setTimeout(() => playTone(659, 0.2, "sine", 0.13), 200); setTimeout(() => playTone(784, 0.4, "sine", 0.13), 400); },
  rollSSR:() => [523, 659, 784, 988, 1175].forEach((f, i) => setTimeout(() => playTone(f, 0.3, "sine", 0.16), i * 120)),
  fav:    () => playTone(1046, 0.08, "sine", 0.15),
  unfav:  () => playTone(523, 0.08, "sine", 0.15),
  newGet: () => { playTone(880, 0.12, "sine", 0.18); setTimeout(() => playTone(1175, 0.15, "sine", 0.16), 100); },
  daily:  () => { playTone(659, 0.15, "sine", 0.2); setTimeout(() => playTone(880, 0.15, "sine", 0.18), 150); setTimeout(() => playTone(1175, 0.25, "sine", 0.16), 300); }
};

// ========================================
// 5. 状態取得
// ========================================

function getCount() { return parseInt(lsGet(KEYS.count, 0), 10) || 0; }
function setCount(n) { lsSet(KEYS.count, n); }
function getCollected() { return lsGet(KEYS.collected, {}); }
function setCollected(obj) { lsSet(KEYS.collected, obj); }
function getFavorites() { return lsGet(KEYS.favorites, []); }
function setFavorites(arr) { lsSet(KEYS.favorites, arr); }
function isFavorite(id) { return getFavorites().indexOf(id) !== -1; }
function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx === -1) { favs.push(id); setFavorites(favs); SE.fav(); return true; }
  favs.splice(idx, 1); setFavorites(favs); SE.unfav(); return false;
}

// ========================================
// 6. ストリーク
// ========================================

function updateStreak() {
  const today = todayStr();
  const last = lsGet(KEYS.streakLast, null);
  let streak = lsGet(KEYS.streakCount, 0);
  if (last === today) return { streak: streak, ticked: false };
  if (last) {
    const lastD = new Date(last);
    const todayD = new Date(today);
    const diff = Math.round((todayD - lastD) / 86400000);
    if (diff === 1) streak += 1;
    else streak = 1;
  } else streak = 1;
  lsSet(KEYS.streakLast, today);
  lsSet(KEYS.streakCount, streak);
  const max = lsGet(KEYS.streakMax, 0);
  if (streak > max) lsSet(KEYS.streakMax, streak);
  return { streak: streak, ticked: true };
}
function getStreak() { return lsGet(KEYS.streakCount, 0); }

// ========================================
// 7. 抽選
// ========================================

function pickRarity() {
  const pitySR = lsGet(KEYS.pitySR, 0);
  const pitySSR = lsGet(KEYS.pitySSR, 0);
  if (pitySSR >= PITY_SSR_THRESHOLD) return "SSR";
  if (pitySR >= PITY_SR_THRESHOLD) return Math.random() < 0.2 ? "SSR" : "SR";
  const r = Math.random() * 100;
  if (r < RARITY_RATES.SSR) return "SSR";
  if (r < RARITY_RATES.SSR + RARITY_RATES.SR) return "SR";
  if (r < RARITY_RATES.SSR + RARITY_RATES.SR + RARITY_RATES.R) return "R";
  return "N";
}
function pickCapsule(currentMood) {
  const rarity = pickRarity();
  const pool = capsules.filter(c => c.rarity === rarity);
  if (pool.length === 0) return capsules[0];
  const time = getTimeOfDay();
  const weights = pool.map(c => {
    let w = 1;
    if (c.mood === currentMood && currentMood && currentMood !== "any") w += 2;
    if (c.time === time) w += 1;
    return w;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) { r -= weights[i]; if (r < 0) return pool[i]; }
  return pool[pool.length - 1];
}
function updatePityAfter(rarity) {
  let pitySR = lsGet(KEYS.pitySR, 0);
  let pitySSR = lsGet(KEYS.pitySSR, 0);
  if (rarity === "SSR") { pitySR = 0; pitySSR = 0; }
  else if (rarity === "SR") { pitySR = 0; pitySSR += 1; }
  else { pitySR += 1; pitySSR += 1; }
  lsSet(KEYS.pitySR, pitySR);
  lsSet(KEYS.pitySSR, pitySSR);
}

// ========================================
// 8. デイリー
// ========================================

function getDailyCapsule() {
  const today = todayStr();
  const seed = dateSeededRandom(today);
  let rarity;
  if (seed < 0.05) rarity = "SSR";
  else if (seed < 0.25) rarity = "SR";
  else if (seed < 0.60) rarity = "R";
  else rarity = "N";
  const pool = capsules.filter(c => c.rarity === rarity);
  const idx = Math.floor(seed * 10000) % pool.length;
  return pool[idx];
}
function isDailyOpened() { return lsGet(KEYS.dailyDate, null) === todayStr(); }
function openDaily() {
  const cap = getDailyCapsule();
  lsSet(KEYS.dailyDate, todayStr());
  lsSet(KEYS.dailyOpenId, cap.id);
  addToCollection(cap.id);
  return cap;
}

// ========================================
// 9. コレクション
// ========================================

function addToCollection(id) {
  const c = getCollected();
  const now = Date.now();
  if (!c[id]) { c[id] = { firstAt: now, lastAt: now }; setCollected(c); return true; }
  c[id].lastAt = now; setCollected(c); return false;
}
function getCollectedCount() { return Object.keys(getCollected()).length; }

// ========================================
// 10. UI 更新
// ========================================

function updateHeaderUI(animate) {
  const el = document.getElementById("streak-count");
  if (animate) animateCount(el, getStreak());
  else { el.textContent = getStreak(); el.setAttribute("data-value", getStreak()); }
}

function updateStatusUI(animate) {
  const total = capsules.length;
  const collected = getCollectedCount();
  const count = getCount();
  const countEl = document.querySelector('[data-counter="count"]');
  const collectedEl = document.querySelector('[data-counter="collected"]');
  if (animate) {
    animateCount(countEl, count);
    animateCount(collectedEl, collected);
  } else {
    if (countEl) { countEl.textContent = count; countEl.setAttribute("data-value", count); }
    if (collectedEl) { collectedEl.textContent = collected; collectedEl.setAttribute("data-value", collected); }
  }
  $("#progress-fill").css("width", (collected / total * 100) + "%");
  $("#coll-num").text(collected);
  $("#fav-num").text(getFavorites().length);
  if (collected === total) {
    $("#collection-text").addClass("complete");
    $("#progress-fill").addClass("complete");
  } else {
    $("#collection-text").removeClass("complete");
    $("#progress-fill").removeClass("complete");
  }
  // マイルストーン
  const pct = collected / total * 100;
  $(".milestone").each(function () {
    const at = parseInt($(this).data("at"), 10);
    if (pct >= at) $(this).addClass("passed"); else $(this).removeClass("passed");
  });
  $("#settings-pity").text("SR " + Math.max(0, PITY_SR_THRESHOLD - lsGet(KEYS.pitySR, 0)) + " 回 / SSR " + Math.max(0, PITY_SSR_THRESHOLD - lsGet(KEYS.pitySSR, 0)) + " 回");
}

function updatePityHint() {
  const remain = PITY_SR_THRESHOLD - lsGet(KEYS.pitySR, 0);
  if (remain <= 5 && remain > 0) $("#pity-text").text("あと " + remain + " 回で SR 以上確定").addClass("show");
  else $("#pity-text").text("").removeClass("show");
}

function updateSettingsUI() {
  $("#settings-count").text(getCount());
  $("#settings-streak").text(getStreak() + " 日");
  $("#settings-max-streak").text(lsGet(KEYS.streakMax, 0) + " 日");
  $("#sound-toggle").prop("checked", lsGet(KEYS.soundOn, true));
}

function updateDailyCardUI() {
  $("#daily-date").text(formatDateJP(todayStr()));
  const $card = $("#daily-card");
  const $content = $("#daily-content");
  if (isDailyOpened()) {
    const id = lsGet(KEYS.dailyOpenId, null);
    const cap = capsules.find(c => c.id === id);
    if (cap) {
      $content.removeClass("daily-locked").addClass("daily-opened rarity-" + cap.rarity.toLowerCase())
              .html('<p class="daily-message">' + escapeHtml(cap.message) + '</p><p class="daily-meta">' + cap.category + ' · ' + cap.rarity + '</p>');
      $card.addClass("daily-opened-card");
    }
  } else {
    $content.removeClass("daily-opened rarity-n rarity-r rarity-sr rarity-ssr").addClass("daily-locked")
            .html(icon("gift", "daily-lock-icon") + '<p class="daily-prompt">タップして今日の言葉を開く</p>');
    $card.removeClass("daily-opened-card");
  }
}

// ========================================
// 11. テーマ・気分・粒子
// ========================================

function applyTimeTheme() {
  document.body.setAttribute("data-time", getTimeOfDay());
}

function applyMood(mood) {
  document.body.setAttribute("data-mood", mood);
  // 粒子色も更新
  refreshParticles();
}

function refreshParticles() {
  const container = document.getElementById("particles");
  if (!container) return;
  container.innerHTML = "";
  const count = 14;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = 4 + Math.random() * 12;
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.left = (Math.random() * 100) + "%";
    p.style.setProperty("--p-duration", (12 + Math.random() * 14) + "s");
    p.style.setProperty("--p-delay", (Math.random() * 14) + "s");
    p.style.setProperty("--p-opacity", (0.15 + Math.random() * 0.3).toString());
    p.style.setProperty("--p-x-end", ((Math.random() - 0.5) * 80) + "px");
    container.appendChild(p);
  }
}

// ========================================
// 12. ガチャ実行
// ========================================

const categoryClassMap = {
  "ほっとする言葉": "cat-relax",
  "小さなアドバイス": "cat-advice",
  "短い格言": "cat-quote",
  "自分を整える一言": "cat-balance"
};

let currentMood = "calm";
let currentResultId = null;

function runGacha() {
  const $button = $("#gacha-button");
  if ($button.prop("disabled")) return;
  $button.prop("disabled", true);

  // ストリーク更新
  const streakResult = updateStreak();
  if (streakResult.ticked) {
    $("#streak-badge").addClass("tick celebrate");
    setTimeout(() => $("#streak-badge").removeClass("tick celebrate"), 1100);
    updateHeaderUI(true);
  }

  // カウントUP
  const newCount = getCount() + 1;
  setCount(newCount);
  updateStatusUI(true);

  // 抽選
  const selected = pickCapsule(currentMood);
  const effect = RARITY_EFFECTS[selected.rarity];
  updatePityAfter(selected.rarity);

  $("#result-card").removeClass("result-empty");

  // 確定演出
  const $glow = $("#confirmation-glow");
  $glow.removeClass("show glow-sr glow-ssr");
  if (selected.rarity === "SR" || selected.rarity === "SSR") {
    $glow.addClass("show glow-" + selected.rarity.toLowerCase());
    setTimeout(() => $glow.removeClass("show"), 1200);
  }

  // ガチャマシン演出
  const $machine = $("#gacha-machine");
  const $aura = $(".machine-aura");
  $machine.removeClass("shake shake-r shake-sr shake-ssr");
  $aura.removeClass("aura-r aura-sr aura-ssr");
  void document.getElementById("gacha-machine").offsetWidth;
  $machine.addClass(effect.shakeClass);

  if (selected.rarity === "SSR") SE.rollSSR();
  else if (selected.rarity === "SR") SE.rollSR();
  else if (selected.rarity === "R") SE.rollR();
  else SE.rollN();

  if (selected.rarity === "R") $aura.addClass("aura-r");
  if (selected.rarity === "SR") $aura.addClass("aura-sr");
  if (selected.rarity === "SSR") $aura.addClass("aura-ssr");

  if (selected.rarity === "SSR") {
    const $overlay = $("#ssr-overlay");
    $overlay.removeClass("active");
    void document.getElementById("ssr-overlay").offsetWidth;
    $overlay.addClass("active");
    setTimeout(() => $overlay.removeClass("active"), 2800);
  }

  setTimeout(() => {
    $machine.removeClass("shake shake-r shake-sr shake-ssr");
    $aura.removeClass("aura-r aura-sr aura-ssr");
    showResult(selected);
  }, effect.shakeDuration);

  const lockTime = selected.rarity === "SSR" ? 2800 : effect.shakeDuration + 100;
  setTimeout(() => $button.prop("disabled", false), lockTime);
}

function showResult(selected) {
  currentResultId = selected.id;
  $("#category").text(selected.category);
  $("#message").text(selected.message);

  const $card = $("#result-card");
  $card.removeClass("fade-in card-r card-sr card-ssr result-empty");
  void document.getElementById("result-card").offsetWidth;
  if (RARITY_EFFECTS[selected.rarity].cardClass) $card.addClass(RARITY_EFFECTS[selected.rarity].cardClass);
  else $card.addClass("fade-in");

  const $capsule = $(".capsule-icon");
  $capsule.removeClass("cat-relax cat-advice cat-quote cat-balance rarity-r rarity-sr rarity-ssr open");
  if (categoryClassMap[selected.category]) $capsule.addClass(categoryClassMap[selected.category]);
  if (selected.rarity === "R") $capsule.addClass("rarity-r");
  if (selected.rarity === "SR") $capsule.addClass("rarity-sr");
  if (selected.rarity === "SSR") $capsule.addClass("rarity-ssr");
  void document.querySelector(".capsule-icon").offsetWidth;
  $capsule.addClass("open");
  setTimeout(() => $capsule.removeClass("open"), 1500);

  const isNew = addToCollection(selected.id);
  if (isNew) SE.newGet();
  updateStatusUI(true);
  updatePityHint();
  renderCollection();
  renderFavorites();

  const $newBadge = $("#new-badge");
  $newBadge.removeClass("show");
  void document.getElementById("new-badge").offsetWidth;
  if (isNew) $newBadge.addClass("show");

  updateFavoriteBtn();
  $("#share-btn").prop("disabled", false);

  if (isNew) {
    $("#nav-collection-dot").addClass("show");
    setTimeout(() => showToast("新しいカードを獲得！"), 600);
  }
}

function updateFavoriteBtn() {
  if (!currentResultId) return;
  const $btn = $("#favorite-btn");
  if (isFavorite(currentResultId)) {
    $btn.addClass("active").attr("aria-pressed", "true").html(icon("heart"));
  } else {
    $btn.removeClass("active").attr("aria-pressed", "false").html(icon("heart-o"));
  }
}

// ========================================
// 13. 図鑑
// ========================================

let currentFilter = "all";

function renderCollection() {
  const $grid = $("#collection-grid");
  $grid.empty();
  const collected = getCollected();
  capsules.forEach(c => {
    if (currentFilter !== "all" && c.rarity !== currentFilter) return;
    const isCollected = !!collected[c.id];
    const $card = $(
      '<button class="coll-card rarity-' + c.rarity.toLowerCase() + (isCollected ? "" : " locked") + '" data-id="' + c.id + '" type="button">' +
      '  <div class="coll-card-top">' +
      '    <span class="coll-rarity">' + c.rarity + '</span>' +
      '    <span class="coll-id">#' + String(c.id).padStart(2, "0") + '</span>' +
      '  </div>' +
      '  <div class="coll-card-body">' +
        (isCollected
          ? '<p class="coll-msg">' + escapeHtml(truncate(c.message, 40)) + '</p>'
          : '<p class="coll-msg coll-locked">？？？</p>') +
      '  </div>' +
      '  <div class="coll-card-foot">' + (isCollected ? c.category : "未取得") + '</div>' +
      '</button>'
    );
    $grid.append($card);
  });
}

// ========================================
// 14. お気に入り
// ========================================

function renderFavorites() {
  const $list = $("#favorites-list");
  $list.empty();
  const favs = getFavorites();
  if (favs.length === 0) { $("#favorites-empty").show(); return; }
  $("#favorites-empty").hide();
  favs.forEach(id => {
    const c = capsules.find(x => x.id === id);
    if (!c) return;
    const $item = $(
      '<div class="fav-card rarity-' + c.rarity.toLowerCase() + '">' +
      '  <div class="fav-card-head">' +
      '    <span class="fav-rarity">' + c.rarity + '</span>' +
      '    <span class="fav-category">' + c.category + '</span>' +
      '    <button class="fav-remove" data-id="' + c.id + '" type="button" aria-label="お気に入り解除">' + icon("heart") + '</button>' +
      '  </div>' +
      '  <p class="fav-msg">' + escapeHtml(c.message) + '</p>' +
      '</div>'
    );
    $list.append($item);
  });
}

// ========================================
// 15. シェア画像生成
// ========================================

function generateShareImage(capsule) {
  const canvas = document.getElementById("share-canvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  if (capsule.rarity === "SSR") { bg.addColorStop(0, "#fff8e1"); bg.addColorStop(1, "#ffe4a3"); }
  else if (capsule.rarity === "SR") { bg.addColorStop(0, "#f4eeff"); bg.addColorStop(1, "#d4cce8"); }
  else if (capsule.rarity === "R") { bg.addColorStop(0, "#e8f5e9"); bg.addColorStop(1, "#c7e4d4"); }
  else { bg.addColorStop(0, "#f4f3f0"); bg.addColorStop(1, "#e8e6e1"); }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 装飾フレーム
  ctx.strokeStyle = capsule.rarity === "SSR" ? "#f59e0b" :
                    capsule.rarity === "SR" ? "#8a7ab3" :
                    capsule.rarity === "R" ? "#6fb191" : "#b5b5b5";
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, W - 60, H - 60);

  ctx.fillStyle = "#1a1a1a";
  ctx.font = "500 28px 'Noto Sans JP', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("こころのガチャ", W / 2, 90);

  ctx.fillStyle = "#666";
  ctx.font = "400 16px 'Noto Sans JP', sans-serif";
  ctx.fillText(capsule.category + " · " + capsule.rarity, W / 2, 140);

  ctx.fillStyle = "#1a1a1a";
  ctx.font = "600 30px 'Shippori Mincho', 'Noto Sans JP', serif";
  const lines = wrapText(ctx, capsule.message, W - 100);
  const startY = H / 2 - (lines.length * 52) / 2 + 20;
  lines.forEach((line, i) => ctx.fillText(line, W / 2, startY + i * 52));

  ctx.fillStyle = "#888";
  ctx.font = "300 14px 'Noto Sans JP', sans-serif";
  ctx.fillText("#こころのガチャ", W / 2, H - 60);

  return canvas.toDataURL("image/png");
}
function wrapText(ctx, text, maxWidth) {
  const chars = text.split("");
  const lines = []; let cur = "";
  for (let i = 0; i < chars.length; i++) {
    const test = cur + chars[i];
    if (ctx.measureText(test).width > maxWidth && cur.length > 0) { lines.push(cur); cur = chars[i]; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

// ========================================
// 16. トースト
// ========================================

let toastTimer = null;
function showToast(text) {
  const $t = $("#toast");
  $t.text(text).addClass("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $t.removeClass("show"), 2200);
}

// ========================================
// 17. ビュー
// ========================================

function switchView(name) {
  $(".view").removeClass("active slide-from-left");
  $("#view-" + name).addClass("active");
  $(".nav-btn").removeClass("active");
  $('.nav-btn[data-view="' + name + '"]').addClass("active");
  if (name === "collection") { renderCollection(); $("#nav-collection-dot").removeClass("show"); }
  if (name === "favorites") renderFavorites();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ========================================
// 18. モーダル
// ========================================

function openModal(id) { $("#" + id).addClass("active").attr("aria-hidden", "false"); }
function closeModal(id) { $("#" + id).removeClass("active").attr("aria-hidden", "true"); }

// ========================================
// 19. 初期化
// ========================================

$(function () {
  migrateLegacy();
  currentMood = "calm";
  applyTimeTheme();
  applyMood("calm");

  // 1分ごとに時間帯チェック (時間境界で切替えるため)
  setInterval(applyTimeTheme, 60000);

  updateHeaderUI(false);
  updateStatusUI(false);
  updateSettingsUI();
  updatePityHint();
  updateDailyCardUI();
  renderCollection();
  renderFavorites();
  updateFavoriteBtn();

  // ガチャ
  $("#gacha-button").on("click", () => { SE.click(); runGacha(); });

  // 気分セレクト
  $(".mood-btn").on("click", function () {
    SE.tap();
    $(".mood-btn").removeClass("active");
    $(this).addClass("active");
    currentMood = $(this).data("mood");
    applyMood(currentMood);
  });

  // デイリー
  $("#daily-card").on("click", function () {
    if (isDailyOpened()) return;
    SE.daily();
    openDaily();
    updateDailyCardUI();
    updateStatusUI(true);
    renderCollection();
    showToast("今日の言葉が届きました");
  });

  // タブ切替
  $(".nav-btn").on("click", function () { SE.tap(); switchView($(this).data("view")); });

  // 図鑑フィルタ
  $(document).on("click", ".filter-btn", function () {
    SE.tap();
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
    currentFilter = $(this).data("filter");
    renderCollection();
  });

  // 図鑑詳細
  $(document).on("click", ".coll-card", function () {
    const id = parseInt($(this).data("id"), 10);
    const c = capsules.find(x => x.id === id);
    if (!c) return;
    const collected = getCollected()[id];
    if (!collected) { showToast("まだ取得していません"); return; }
    SE.tap();
    const firstAt = new Date(collected.firstAt);
    const favIconHtml = isFavorite(c.id) ? icon("heart", "icon-sm") : icon("heart-o", "icon-sm");
    const favText = isFavorite(c.id) ? ' お気に入りから外す' : ' お気に入りに追加';
    $("#card-detail-body").html(
      '<div class="card-detail-rarity rarity-' + c.rarity.toLowerCase() + '">' + c.rarity + '</div>' +
      '<p class="card-detail-category">' + c.category + '</p>' +
      '<p class="card-detail-message">' + escapeHtml(c.message) + '</p>' +
      '<p class="card-detail-meta">取得日：' + firstAt.getFullYear() + '/' + (firstAt.getMonth() + 1) + '/' + firstAt.getDate() + '</p>' +
      '<button class="card-detail-fav" data-id="' + c.id + '">' + favIconHtml + favText + '</button>'
    );
    openModal("card-detail-modal");
  });

  $(document).on("click", ".card-detail-fav", function () {
    const id = parseInt($(this).data("id"), 10);
    toggleFavorite(id);
    const favIconHtml = isFavorite(id) ? icon("heart", "icon-sm") : icon("heart-o", "icon-sm");
    const favText = isFavorite(id) ? ' お気に入りから外す' : ' お気に入りに追加';
    $(this).html(favIconHtml + favText);
    if (id === currentResultId) updateFavoriteBtn();
    renderFavorites();
    updateStatusUI(true);
  });

  $(document).on("click", ".fav-remove", function (e) {
    e.stopPropagation();
    const id = parseInt($(this).data("id"), 10);
    toggleFavorite(id);
    if (id === currentResultId) updateFavoriteBtn();
    renderFavorites();
    updateStatusUI(true);
  });

  $("#favorite-btn").on("click", function () {
    if (!currentResultId) return;
    toggleFavorite(currentResultId);
    updateFavoriteBtn();
    renderFavorites();
    updateStatusUI(true);
  });

  // シェア
  $("#share-btn").on("click", function () {
    if (!currentResultId) return;
    SE.tap();
    const cap = capsules.find(c => c.id === currentResultId);
    if (!cap) return;
    const dataUrl = generateShareImage(cap);
    $("#share-download").attr("href", dataUrl);
    openModal("share-modal");
  });
  $("#share-copy").on("click", function () {
    if (!currentResultId) return;
    const cap = capsules.find(c => c.id === currentResultId);
    if (!cap) return;
    const text = "「" + cap.message + "」\n— こころのガチャ #" + cap.rarity;
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => showToast("コピーしました"));
    else showToast("コピーに失敗しました");
  });

  // 設定
  $("#settings-btn").on("click", () => { SE.tap(); updateSettingsUI(); openModal("settings-modal"); });
  $(document).on("click", "[data-close]", function () { closeModal($(this).data("close")); });

  // サウンドトグル
  $("#sound-toggle").on("change", function () { lsSet(KEYS.soundOn, this.checked); if (this.checked) SE.tap(); });

  // リセット
  $("#reset-btn").on("click", function () {
    if (!confirm("すべての進捗をリセットします。よろしいですか？")) return;
    Object.keys(KEYS).forEach(k => { if (k.indexOf("legacy") === -1) localStorage.removeItem(KEYS[k]); });
    currentResultId = null;
    updateHeaderUI(false);
    updateStatusUI(false);
    updateSettingsUI();
    updatePityHint();
    updateDailyCardUI();
    renderCollection();
    renderFavorites();
    updateFavoriteBtn();
    $("#result-card").addClass("result-empty");
    $("#category").text("今日のカプセル");
    $("#message").text("ボタンを押すと、言葉が出てきます。");
    $("#share-btn").prop("disabled", true);
    closeModal("settings-modal");
    showToast("リセットしました");
  });

  // ESCで閉じる
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") $(".modal.active").each(function () { closeModal(this.id); });
  });
});
