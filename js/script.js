// ========================================
// こころのガチャ - メインスクリプト (レベルアップ版)
// レアリティシステム + コレクション機能 + 派手な演出
// ========================================

// 各カプセルにレアリティを付与（id は localStorage コレクション用の一意キー）
const capsules = [
  // SSR (3%, 1個) - 自己肯定感が一番上がるメッセージ
  { id: 1, rarity: "SSR", category: "ほっとする言葉", message: "今日は、ちゃんとここまで来ただけで十分です。" },

  // SR (12%, 2個) - 心に響く短い格言
  { id: 2, rarity: "SR", category: "短い格言", message: "静かな人ほど、深く進んでいる。" },
  { id: 3, rarity: "SR", category: "短い格言", message: "急がないことが、崩れない強さになる。" },

  // R (25%, 4個) - 自分を整える系
  { id: 4, rarity: "R", category: "自分を整える一言", message: "今の自分に必要なのは、気合いではなく余白かもしれません。" },
  { id: 5, rarity: "R", category: "自分を整える一言", message: "考えすぎたら、まず身体をゆるめる。" },
  { id: 6, rarity: "R", category: "自分を整える一言", message: "今日は完璧より、回復を優先していい。" },
  { id: 7, rarity: "R", category: "短い格言", message: "整えることも、前に進むことの一部です。" },

  // N (60%, 5個) - ほっとする言葉 / 小さなアドバイス
  { id: 8,  rarity: "N", category: "ほっとする言葉", message: "焦らなくても大丈夫。深呼吸ひとつ分だけ、前に進めばいい。" },
  { id: 9,  rarity: "N", category: "ほっとする言葉", message: "全部を今日片づけなくてもいい。" },
  { id: 10, rarity: "N", category: "小さなアドバイス", message: "まずは水を一口飲みましょう。" },
  { id: 11, rarity: "N", category: "小さなアドバイス", message: "スマホを閉じて、10秒だけ遠くを見てみましょう。" },
  { id: 12, rarity: "N", category: "小さなアドバイス", message: "次にやることを、ひとつだけ決めれば大丈夫です。" }
];

// レア度別の確率 (合計 100)
const rarityRates = { SSR: 3, SR: 12, R: 25, N: 60 };

// レア度別の演出設定
const rarityEffects = {
  N:   { shakeClass: "shake",     shakeDuration: 500,  cardClass: "" },
  R:   { shakeClass: "shake-r",   shakeDuration: 700,  cardClass: "card-r" },
  SR:  { shakeClass: "shake-sr",  shakeDuration: 1000, cardClass: "card-sr" },
  SSR: { shakeClass: "shake-ssr", shakeDuration: 1400, cardClass: "card-ssr" }
};

// localStorage キー
const STORAGE_KEY = "kokoro-gacha-collected";
const COUNT_KEY   = "kokoro-gacha-count";

// 回した回数を localStorage から復元
let count = parseInt(localStorage.getItem(COUNT_KEY) || "0", 10);

// 取得済み id 配列を取得
function getCollected() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

// 取得済み id を保存
function saveCollected(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

// id をコレクションに追加（新規なら true、既存なら false）
function addToCollection(id) {
  const collected = getCollected();
  if (!collected.includes(id)) {
    collected.push(id);
    saveCollected(collected);
    return true;
  }
  return false;
}

// 重み付き抽選でレア度を決め、その中からランダムに1個選ぶ
function pickCapsule() {
  const r = Math.random() * 100;
  let rarity;
  if (r < rarityRates.SSR) {
    rarity = "SSR";
  } else if (r < rarityRates.SSR + rarityRates.SR) {
    rarity = "SR";
  } else if (r < rarityRates.SSR + rarityRates.SR + rarityRates.R) {
    rarity = "R";
  } else {
    rarity = "N";
  }
  const pool = capsules.filter(c => c.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

// コレクション表示を更新
function updateCollectionUI() {
  const total = capsules.length;
  const collected = getCollected().length;
  const $text = $("#collection-text");
  const $fill = $("#progress-fill");
  const $reset = $("#reset-button");

  $fill.css("width", (collected / total * 100) + "%");

  if (collected === total) {
    $text.addClass("complete").text("コレクション：" + collected + " / " + total + " ✨ コンプリート！");
    $fill.addClass("complete");
    $reset.addClass("show");
  } else {
    $text.removeClass("complete").text("コレクション：" + collected + " / " + total);
    $fill.removeClass("complete");
    $reset.removeClass("show");
  }
}

// カウント表示を更新
function updateCountUI() {
  $("#count-text").text("回した回数：" + count + "回");
}

// ページ読み込み後に処理を開始
$(function () {

  // カテゴリ → カプセル色クラスのマップ
  const categoryClassMap = {
    "ほっとする言葉": "cat-relax",
    "小さなアドバイス": "cat-advice",
    "短い格言": "cat-quote",
    "自分を整える一言": "cat-balance"
  };

  // 初期表示を反映
  updateCountUI();
  updateCollectionUI();

  // 「ガチャを回す」ボタン
  $("#gacha-button").on("click", function () {

    const $button = $(this);

    // 多重クリック防止 (アニメーション中は無効化)
    if ($button.prop("disabled")) return;
    $button.prop("disabled", true);

    // 1. カウントUP & 保存
    count = count + 1;
    localStorage.setItem(COUNT_KEY, count);
    updateCountUI();

    // 2. 抽選
    const selected = pickCapsule();
    const effect = rarityEffects[selected.rarity];

    // 3. ガチャマシン演出
    const $machine = $("#gacha-machine");
    const $aura = $(".machine-aura");

    // 既存のアニメーションクラスを除去
    $machine.removeClass("shake shake-r shake-sr shake-ssr");
    $aura.removeClass("aura-r aura-sr aura-ssr");

    // 強制再描画してアニメーションを必ず再生させる
    void document.getElementById("gacha-machine").offsetWidth;

    // shake クラスを付与
    $machine.addClass(effect.shakeClass);

    // R以上はマシン周囲にオーラ点灯
    if (selected.rarity === "R")   $aura.addClass("aura-r");
    if (selected.rarity === "SR")  $aura.addClass("aura-sr");
    if (selected.rarity === "SSR") $aura.addClass("aura-ssr");

    // SSRは全画面エフェクト
    if (selected.rarity === "SSR") {
      const $overlay = $("#ssr-overlay");
      $overlay.removeClass("active");
      void document.getElementById("ssr-overlay").offsetWidth;
      $overlay.addClass("active");
      setTimeout(function () {
        $overlay.removeClass("active");
      }, 2800);
    }

    // 4. shake 終了後に結果表示
    setTimeout(function () {
      $machine.removeClass("shake shake-r shake-sr shake-ssr");
      $aura.removeClass("aura-r aura-sr aura-ssr");

      // テキスト表示
      $("#category").text(selected.category);
      $("#message").text(selected.message);

      // レア度バッジ
      const $badge = $("#rarity-badge");
      $badge.removeClass("show rarity-n rarity-r rarity-sr rarity-ssr")
            .addClass("rarity-" + selected.rarity.toLowerCase())
            .text(selected.rarity);
      setTimeout(function () { $badge.addClass("show"); }, 50);

      // 結果カードのレア度別装飾
      const $card = $("#result-card");
      $card.removeClass("fade-in card-r card-sr card-ssr");
      void document.getElementById("result-card").offsetWidth;
      if (effect.cardClass) {
        $card.addClass(effect.cardClass);
      } else {
        $card.addClass("fade-in");
      }

      // カプセル色（カテゴリ + レア度の上書き）
      const $capsule = $(".capsule-icon");
      $capsule.removeClass("cat-relax cat-advice cat-quote cat-balance rarity-r rarity-sr rarity-ssr open");
      const newCatClass = categoryClassMap[selected.category];
      if (newCatClass) $capsule.addClass(newCatClass);
      if (selected.rarity === "R")   $capsule.addClass("rarity-r");
      if (selected.rarity === "SR")  $capsule.addClass("rarity-sr");
      if (selected.rarity === "SSR") $capsule.addClass("rarity-ssr");

      // カプセル開封アニメーション
      void document.querySelector(".capsule-icon").offsetWidth;
      $capsule.addClass("open");

      // コレクションに追加して画面更新
      const isNew = addToCollection(selected.id);
      updateCollectionUI();

      // NEW! バッジ（初取得時のみ）
      const $newBadge = $("#new-badge");
      $newBadge.removeClass("show");
      void document.getElementById("new-badge").offsetWidth;
      if (isNew) $newBadge.addClass("show");

      // カプセルは少し開いたまま保持してから閉じる
      setTimeout(function () { $capsule.removeClass("open"); }, 1500);

    }, effect.shakeDuration);

    // 5. ボタンを再有効化（SSRはオーバーレイ終了まで待つ）
    const buttonLockTime = selected.rarity === "SSR" ? 2800 : effect.shakeDuration + 100;
    setTimeout(function () {
      $button.prop("disabled", false);
    }, buttonLockTime);

  });

  // リセットボタン
  $("#reset-button").on("click", function () {
    if (confirm("コレクションをリセットします。よろしいですか？")) {
      saveCollected([]);
      updateCollectionUI();
    }
  });

});
