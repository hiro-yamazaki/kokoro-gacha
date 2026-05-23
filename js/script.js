// ========================================
// こころのガチャ v3 - 習慣化フォーカス版
// プロのゲームデザインを意識したフル機能
// ========================================
// 機能:
//   - 40メッセージ (気分・時間帯タグ付き)
//   - デイリーメッセージ (日付シードで1日1回)
//   - 連続日数 (Streak) システム
//   - 気分セレクトで確率変動
//   - 天井 (Pity) システム
//   - 図鑑 / マイカード / シェア
//   - サウンド (Web Audio API シンセ)
//   - 確定演出 (SR以上の予告グロー)
// ========================================

// ========================================
// 1. データ定義
// ========================================

// 40 メッセージ
// rarity: N(60%) / R(25%) / SR(12%) / SSR(3%)
// time : morning / afternoon / evening / night / any
// mood : anxious / tired / calm / motivated / any
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

// 天井 (Pity) しきい値
const PITY_SR_THRESHOLD = 20;   // 20回連続 N/R で次は SR以上確定
const PITY_SSR_THRESHOLD = 80;  // 80回連続 SSRなしで次は SSR確定

// localStorage キー
const KEYS = {
  count:        "kg-count",
  collected:    "kg-collected",          // 取得済みID -> {firstAt: timestamp, lastAt: timestamp}
  favorites:    "kg-favorites",          // お気に入りID配列
  streakLast:   "kg-streak-last",        // 最後にガチャした日 "YYYY-MM-DD"
  streakCount:  "kg-streak-count",       // 現在の連続日数
  streakMax:    "kg-streak-max",         // 最長記録
  pitySR:       "kg-pity-sr",            // SR天井カウンタ
  pitySSR:      "kg-pity-ssr",           // SSR天井カウンタ
  dailyDate:    "kg-daily-date",         // 最後にデイリーを開いた日付
  dailyOpenId:  "kg-daily-open-id",      // その日のデイリーID (公開済みなら)
  soundOn:      "kg-sound-on",           // サウンド ON/OFF
  // v2 互換キー (旧データ移行用)
  legacyCollected: "kokoro-gacha-collected",
  legacyCount:     "kokoro-gacha-count"
};

// ========================================
// 2. localStorage ラッパー
// ========================================

function lsGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return JSON.parse(v);
  } catch (e) {
    return fallback;
  }
}

function lsSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// v2 → v3 マイグレーション (1回だけ実行)
function migrateLegacy() {
  if (lsGet(KEYS.collected, null) !== null) return;  // v3キーが既にあれば不要

  const legacyIds = lsGet(KEYS.legacyCollected, []);
  if (Array.isArray(legacyIds) && legacyIds.length > 0) {
    const now = Date.now();
    const migrated = {};
    legacyIds.forEach(id => {
      migrated[id] = { firstAt: now, lastAt: now };
    });
    lsSet(KEYS.collected, migrated);
  }

  const legacyCount = lsGet(KEYS.legacyCount, 0);
  if (legacyCount && !lsGet(KEYS.count, null)) {
    lsSet(KEYS.count, legacyCount);
  }
}

// ========================================
// 3. ユーティリティ
// ========================================

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + dd;
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

// 日付ベースの決定論的乱数 (0~1)
function dateSeededRandom(dateStr) {
  let h = 0;
  for (let i = 0; i < dateStr.length; i++) {
    h = ((h << 5) - h) + dateStr.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h % 10000) / 10000;
}

// ========================================
// 4. サウンド (Web Audio API)
// ========================================

let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return null;
    }
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
  click:  () => { playTone(440, 0.06, "sine", 0.12); },
  open:   () => { playTone(660, 0.1, "sine", 0.18); setTimeout(() => playTone(880, 0.1, "sine", 0.15), 80); },
  rollN:  () => { playTone(330, 0.3, "triangle", 0.12); },
  rollR:  () => { playTone(440, 0.4, "triangle", 0.14); setTimeout(() => playTone(587, 0.2, "sine", 0.12), 200); },
  rollSR: () => { playTone(523, 0.4, "triangle", 0.15); setTimeout(() => playTone(659, 0.2, "sine", 0.13), 200); setTimeout(() => playTone(784, 0.4, "sine", 0.13), 400); },
  rollSSR:() => {
    const notes = [523, 659, 784, 988, 1175];
    notes.forEach((f, i) => setTimeout(() => playTone(f, 0.3, "sine", 0.16), i * 120));
  },
  fav:    () => playTone(1046, 0.08, "sine", 0.15),
  unfav:  () => playTone(523, 0.08, "sine", 0.15),
  newGet: () => { playTone(880, 0.12, "sine", 0.18); setTimeout(() => playTone(1175, 0.15, "sine", 0.16), 100); },
  daily:  () => { playTone(659, 0.15, "sine", 0.2); setTimeout(() => playTone(880, 0.15, "sine", 0.18), 150); setTimeout(() => playTone(1175, 0.25, "sine", 0.16), 300); }
};

// ========================================
// 5. 状態取得関数
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
  if (idx === -1) {
    favs.push(id);
    setFavorites(favs);
    SE.fav();
    return true;
  } else {
    favs.splice(idx, 1);
    setFavorites(favs);
    SE.unfav();
    return false;
  }
}

// ========================================
// 6. ストリーク
// ========================================

function updateStreak() {
  const today = todayStr();
  const last = lsGet(KEYS.streakLast, null);
  let streak = lsGet(KEYS.streakCount, 0);
  if (last === today) return streak;  // 今日すでに更新済み

  if (last) {
    const lastD = new Date(last);
    const todayD = new Date(today);
    const diff = Math.round((todayD - lastD) / 86400000);
    if (diff === 1) streak += 1;
    else streak = 1;
  } else {
    streak = 1;
  }
  lsSet(KEYS.streakLast, today);
  lsSet(KEYS.streakCount, streak);
  const max = lsGet(KEYS.streakMax, 0);
  if (streak > max) lsSet(KEYS.streakMax, streak);
  return streak;
}

function getStreak() {
  const today = todayStr();
  const last = lsGet(KEYS.streakLast, null);
  let streak = lsGet(KEYS.streakCount, 0);
  if (last && last !== today) {
    const lastD = new Date(last);
    const todayD = new Date(today);
    const diff = Math.round((todayD - lastD) / 86400000);
    if (diff > 1) return streak;  // 途切れている表示はそのまま
  }
  return streak;
}

// ========================================
// 7. 抽選ロジック (気分・時間帯・天井)
// ========================================

function pickRarity() {
  const pitySR = lsGet(KEYS.pitySR, 0);
  const pitySSR = lsGet(KEYS.pitySSR, 0);

  // 天井判定
  if (pitySSR >= PITY_SSR_THRESHOLD) return "SSR";
  if (pitySR >= PITY_SR_THRESHOLD) {
    return Math.random() < 0.2 ? "SSR" : "SR";  // SR以上確定
  }

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

  // 重み計算: 気分マッチ +2, 時間帯マッチ +1
  const weights = pool.map(c => {
    let w = 1;
    if (c.mood === currentMood && currentMood && currentMood !== "any") w += 2;
    if (c.time === time) w += 1;
    return w;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r < 0) return pool[i];
  }
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
// 8. デイリーメッセージ
// ========================================

function getDailyCapsule() {
  const today = todayStr();
  const seed = dateSeededRandom(today);
  // SSR 5% / SR 20% / R 35% / N 40% の偏った確率 (デイリーは少し豪華)
  let rarity;
  if (seed < 0.05) rarity = "SSR";
  else if (seed < 0.25) rarity = "SR";
  else if (seed < 0.60) rarity = "R";
  else rarity = "N";
  const pool = capsules.filter(c => c.rarity === rarity);
  const idx = Math.floor(seed * 10000) % pool.length;
  return pool[idx];
}

function isDailyOpened() {
  return lsGet(KEYS.dailyDate, null) === todayStr();
}

function openDaily() {
  const today = todayStr();
  const cap = getDailyCapsule();
  lsSet(KEYS.dailyDate, today);
  lsSet(KEYS.dailyOpenId, cap.id);
  addToCollection(cap.id);
  return cap;
}

// ========================================
// 9. コレクション操作
// ========================================

function addToCollection(id) {
  const c = getCollected();
  const now = Date.now();
  if (!c[id]) {
    c[id] = { firstAt: now, lastAt: now };
    setCollected(c);
    return true;  // NEW
  } else {
    c[id].lastAt = now;
    setCollected(c);
    return false;
  }
}

function getCollectedCount() {
  return Object.keys(getCollected()).length;
}

// ========================================
// 10. UI 更新関数
// ========================================

function updateHeaderUI() {
  $("#streak-count").text(getStreak());
}

function updateStatusUI() {
  const total = capsules.length;
  const collected = getCollectedCount();
  $("#count-text").text("回した回数：" + getCount() + "回");
  $("#collection-text").text("コレクション：" + collected + " / " + total);
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
  // 天井までの残り
  const pitySR = lsGet(KEYS.pitySR, 0);
  $("#settings-pity").text("SR " + Math.max(0, PITY_SR_THRESHOLD - pitySR) + " 回 / SSR " + Math.max(0, PITY_SSR_THRESHOLD - lsGet(KEYS.pitySSR, 0)) + " 回");
}

function updatePityHint() {
  const pitySR = lsGet(KEYS.pitySR, 0);
  const remain = PITY_SR_THRESHOLD - pitySR;
  if (remain <= 5 && remain > 0) {
    $("#pity-text").text("あと " + remain + " 回で SR 以上確定").addClass("show");
  } else {
    $("#pity-text").text("").removeClass("show");
  }
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
      $content.removeClass("daily-locked")
              .addClass("daily-opened rarity-" + cap.rarity.toLowerCase())
              .html(
                '<p class="daily-message">' + escapeHtml(cap.message) + '</p>' +
                '<p class="daily-meta">' + cap.category + ' · ' + cap.rarity + '</p>'
              );
      $card.addClass("daily-opened-card");
    }
  } else {
    $content.removeClass("daily-opened rarity-n rarity-r rarity-sr rarity-ssr")
            .addClass("daily-locked")
            .html('<span class="daily-lock-icon">🎁</span><p class="daily-prompt">タップして今日の言葉を開く</p>');
    $card.removeClass("daily-opened-card");
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// ========================================
// 11. ガチャ実行
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

  // 初日の更新 (連続日数)
  updateStreak();

  // カウントUP
  const newCount = getCount() + 1;
  setCount(newCount);
  updateStatusUI();
  updateHeaderUI();

  // 抽選
  const selected = pickCapsule(currentMood);
  const effect = RARITY_EFFECTS[selected.rarity];
  updatePityAfter(selected.rarity);

  // 結果カードを「処理中」状態に
  $("#result-card").removeClass("result-empty");

  // 確定演出 (SR以上のとき、揺れ開始前に一瞬光らせる)
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

  // サウンド (rarity別)
  if (selected.rarity === "SSR") SE.rollSSR();
  else if (selected.rarity === "SR") SE.rollSR();
  else if (selected.rarity === "R") SE.rollR();
  else SE.rollN();

  if (selected.rarity === "R") $aura.addClass("aura-r");
  if (selected.rarity === "SR") $aura.addClass("aura-sr");
  if (selected.rarity === "SSR") $aura.addClass("aura-ssr");

  // SSR全画面エフェクト
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

  // ボタン再有効化
  const lockTime = selected.rarity === "SSR" ? 2800 : effect.shakeDuration + 100;
  setTimeout(() => $button.prop("disabled", false), lockTime);
}

function showResult(selected) {
  currentResultId = selected.id;
  $("#category").text(selected.category);
  $("#message").text(selected.message);

  // カード装飾
  const $card = $("#result-card");
  $card.removeClass("fade-in card-r card-sr card-ssr result-empty");
  void document.getElementById("result-card").offsetWidth;
  if (RARITY_EFFECTS[selected.rarity].cardClass) {
    $card.addClass(RARITY_EFFECTS[selected.rarity].cardClass);
  } else {
    $card.addClass("fade-in");
  }

  // カプセル
  const $capsule = $(".capsule-icon");
  $capsule.removeClass("cat-relax cat-advice cat-quote cat-balance rarity-r rarity-sr rarity-ssr open");
  if (categoryClassMap[selected.category]) $capsule.addClass(categoryClassMap[selected.category]);
  if (selected.rarity === "R") $capsule.addClass("rarity-r");
  if (selected.rarity === "SR") $capsule.addClass("rarity-sr");
  if (selected.rarity === "SSR") $capsule.addClass("rarity-ssr");
  void document.querySelector(".capsule-icon").offsetWidth;
  $capsule.addClass("open");
  setTimeout(() => $capsule.removeClass("open"), 1500);

  // コレクション追加
  const isNew = addToCollection(selected.id);
  if (isNew) SE.newGet();
  updateStatusUI();
  updatePityHint();
  renderCollection();
  renderFavorites();

  // NEW! バッジ
  const $newBadge = $("#new-badge");
  $newBadge.removeClass("show");
  void document.getElementById("new-badge").offsetWidth;
  if (isNew) $newBadge.addClass("show");

  // ハート (お気に入り) 状態反映
  updateFavoriteBtn();

  // シェア有効化
  $("#share-btn").prop("disabled", false);

  // ナビ図鑑の通知ドット (新規取得時)
  if (isNew) {
    $("#nav-collection-dot").addClass("show");
    setTimeout(() => showToast("新しいカードを獲得！"), 600);
  }
}

function updateFavoriteBtn() {
  if (!currentResultId) return;
  const $btn = $("#favorite-btn");
  if (isFavorite(currentResultId)) {
    $btn.addClass("active").attr("aria-pressed", "true").html("<span aria-hidden='true'>♥</span>");
  } else {
    $btn.removeClass("active").attr("aria-pressed", "false").html("<span aria-hidden='true'>♡</span>");
  }
}

// ========================================
// 12. 図鑑レンダリング
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

function truncate(s, n) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

// ========================================
// 13. お気に入りレンダリング
// ========================================

function renderFavorites() {
  const $list = $("#favorites-list");
  $list.empty();
  const favs = getFavorites();
  if (favs.length === 0) {
    $("#favorites-empty").show();
    return;
  }
  $("#favorites-empty").hide();

  favs.forEach(id => {
    const c = capsules.find(x => x.id === id);
    if (!c) return;
    const $item = $(
      '<div class="fav-card rarity-' + c.rarity.toLowerCase() + '">' +
      '  <div class="fav-card-head">' +
      '    <span class="fav-rarity">' + c.rarity + '</span>' +
      '    <span class="fav-category">' + c.category + '</span>' +
      '    <button class="fav-remove" data-id="' + c.id + '" type="button" aria-label="お気に入り解除">♥</button>' +
      '  </div>' +
      '  <p class="fav-msg">' + escapeHtml(c.message) + '</p>' +
      '</div>'
    );
    $list.append($item);
  });
}

// ========================================
// 14. シェア画像生成 (Canvas)
// ========================================

function generateShareImage(capsule) {
  const canvas = document.getElementById("share-canvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  // 背景
  const bg = ctx.createLinearGradient(0, 0, W, H);
  if (capsule.rarity === "SSR") { bg.addColorStop(0, "#fff8e1"); bg.addColorStop(1, "#ffe4a3"); }
  else if (capsule.rarity === "SR") { bg.addColorStop(0, "#f4eeff"); bg.addColorStop(1, "#d4cce8"); }
  else if (capsule.rarity === "R") { bg.addColorStop(0, "#e8f5e9"); bg.addColorStop(1, "#c7e4d4"); }
  else { bg.addColorStop(0, "#f4f3f0"); bg.addColorStop(1, "#e8e6e1"); }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // タイトル
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "500 28px 'Noto Sans JP', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("こころのガチャ", W / 2, 80);

  // カテゴリ
  ctx.fillStyle = "#666";
  ctx.font = "400 16px 'Noto Sans JP', sans-serif";
  ctx.fillText(capsule.category, W / 2, 140);

  // メッセージ (折り返し)
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "500 30px 'Noto Sans JP', sans-serif";
  const lines = wrapText(ctx, capsule.message, W - 80);
  const startY = H / 2 - (lines.length * 50) / 2 + 20;
  lines.forEach((line, i) => {
    ctx.fillText(line, W / 2, startY + i * 50);
  });

  // フッター
  ctx.fillStyle = "#888";
  ctx.font = "300 14px 'Noto Sans JP', sans-serif";
  ctx.fillText("#こころのガチャ", W / 2, H - 50);

  return canvas.toDataURL("image/png");
}

function wrapText(ctx, text, maxWidth) {
  const chars = text.split("");
  const lines = [];
  let cur = "";
  for (let i = 0; i < chars.length; i++) {
    const test = cur + chars[i];
    if (ctx.measureText(test).width > maxWidth && cur.length > 0) {
      lines.push(cur);
      cur = chars[i];
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ========================================
// 15. トースト通知
// ========================================

let toastTimer = null;
function showToast(text) {
  const $t = $("#toast");
  $t.text(text).addClass("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $t.removeClass("show"), 2200);
}

// ========================================
// 16. ビュー (タブ) 切替
// ========================================

function switchView(name) {
  $(".view").removeClass("active");
  $("#view-" + name).addClass("active");
  $(".nav-btn").removeClass("active");
  $('.nav-btn[data-view="' + name + '"]').addClass("active");
  if (name === "collection") {
    renderCollection();
    $("#nav-collection-dot").removeClass("show");
  }
  if (name === "favorites") renderFavorites();
  // ページ上部にスクロール
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ========================================
// 17. モーダル
// ========================================

function openModal(id) {
  $("#" + id).addClass("active").attr("aria-hidden", "false");
}
function closeModal(id) {
  $("#" + id).removeClass("active").attr("aria-hidden", "true");
}

// ========================================
// 18. 初期化
// ========================================

$(function () {
  migrateLegacy();
  currentMood = "calm";

  // 初期表示
  updateHeaderUI();
  updateStatusUI();
  updateSettingsUI();
  updatePityHint();
  updateDailyCardUI();
  renderCollection();
  renderFavorites();

  // ガチャボタン
  $("#gacha-button").on("click", () => { SE.click(); runGacha(); });

  // 気分セレクト
  $(".mood-btn").on("click", function () {
    SE.tap();
    $(".mood-btn").removeClass("active");
    $(this).addClass("active");
    currentMood = $(this).data("mood");
  });

  // デイリーカード
  $("#daily-card").on("click", function () {
    if (isDailyOpened()) return;
    SE.daily();
    const cap = openDaily();
    updateDailyCardUI();
    updateStatusUI();
    renderCollection();
    showToast("今日の言葉が届きました");
  });

  // タブ切替
  $(".nav-btn").on("click", function () {
    SE.tap();
    switchView($(this).data("view"));
  });

  // 図鑑フィルター
  $(document).on("click", ".filter-btn", function () {
    SE.tap();
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
    currentFilter = $(this).data("filter");
    renderCollection();
  });

  // 図鑑カードクリック → 詳細
  $(document).on("click", ".coll-card", function () {
    const id = parseInt($(this).data("id"), 10);
    const c = capsules.find(x => x.id === id);
    if (!c) return;
    const collected = getCollected()[id];
    if (!collected) {
      showToast("まだ取得していません");
      return;
    }
    SE.tap();
    const firstAt = new Date(collected.firstAt);
    $("#card-detail-body").html(
      '<div class="card-detail-rarity rarity-' + c.rarity.toLowerCase() + '">' + c.rarity + '</div>' +
      '<p class="card-detail-category">' + c.category + '</p>' +
      '<p class="card-detail-message">' + escapeHtml(c.message) + '</p>' +
      '<p class="card-detail-meta">取得日：' + firstAt.getFullYear() + '/' + (firstAt.getMonth() + 1) + '/' + firstAt.getDate() + '</p>' +
      '<button class="card-detail-fav" data-id="' + c.id + '">' + (isFavorite(c.id) ? '♥ お気に入りから外す' : '♡ お気に入りに追加') + '</button>'
    );
    openModal("card-detail-modal");
  });

  // 詳細モーダルのお気に入りトグル
  $(document).on("click", ".card-detail-fav", function () {
    const id = parseInt($(this).data("id"), 10);
    toggleFavorite(id);
    $(this).text(isFavorite(id) ? '♥ お気に入りから外す' : '♡ お気に入りに追加');
    if (id === currentResultId) updateFavoriteBtn();
    renderFavorites();
    updateStatusUI();
  });

  // お気に入り解除 (リスト内)
  $(document).on("click", ".fav-remove", function (e) {
    e.stopPropagation();
    const id = parseInt($(this).data("id"), 10);
    toggleFavorite(id);
    if (id === currentResultId) updateFavoriteBtn();
    renderFavorites();
    updateStatusUI();
  });

  // 結果カードのハート
  $("#favorite-btn").on("click", function () {
    if (!currentResultId) return;
    toggleFavorite(currentResultId);
    updateFavoriteBtn();
    renderFavorites();
    updateStatusUI();
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
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => showToast("コピーしました"));
    } else {
      showToast("コピーに失敗しました");
    }
  });

  // 設定モーダル
  $("#settings-btn").on("click", () => { SE.tap(); updateSettingsUI(); openModal("settings-modal"); });

  // モーダル閉じる (×ボタン or 背景クリック)
  $(document).on("click", "[data-close]", function () {
    closeModal($(this).data("close"));
  });

  // サウンドトグル
  $("#sound-toggle").on("change", function () {
    lsSet(KEYS.soundOn, this.checked);
    if (this.checked) SE.tap();
  });

  // リセット
  $("#reset-btn").on("click", function () {
    if (!confirm("すべての進捗をリセットします。よろしいですか？")) return;
    Object.keys(KEYS).forEach(k => {
      if (k.indexOf("legacy") === -1) localStorage.removeItem(KEYS[k]);
    });
    updateHeaderUI();
    updateStatusUI();
    updateSettingsUI();
    updatePityHint();
    updateDailyCardUI();
    renderCollection();
    renderFavorites();
    closeModal("settings-modal");
    showToast("リセットしました");
  });

  // ESC でモーダル閉じる
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      $(".modal.active").each(function () {
        closeModal(this.id);
      });
    }
  });
});
