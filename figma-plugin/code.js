// スリムサポートプラス LP Figma Plugin
// Run this in Figma's plugin development environment (Plugins > Development > New Plugin)

figma.showUI(__html__, { width: 320, height: 120 });

figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'generate') return;

  await figma.loadFontAsync({ family: 'Noto Sans JP', style: 'Regular' }).catch(() => {});
  await figma.loadFontAsync({ family: 'Noto Sans JP', style: 'Bold' }).catch(() => {});

  // Fallback font
  const FONT_REGULAR = { family: 'Noto Sans JP', style: 'Regular' };
  const FONT_BOLD    = { family: 'Noto Sans JP', style: 'Bold' };

  // ── Color palette ──────────────────────────────────────────
  const C = {
    green:        { r: 0.180, g: 0.490, b: 0.196 }, // #2e7d32
    greenLight:   { r: 0.298, g: 0.686, b: 0.314 }, // #4caf50
    greenPale:    { r: 0.910, g: 0.961, b: 0.914 }, // #e8f5e9
    greenMid:     { r: 0.784, g: 0.902, b: 0.788 }, // #c8e6c9
    accent:       { r: 1.000, g: 0.435, b: 0.000 }, // #ff6f00
    accentLight:  { r: 1.000, g: 0.627, b: 0.000 }, // #ffa000
    text:         { r: 0.200, g: 0.200, b: 0.200 }, // #333
    textLight:    { r: 0.400, g: 0.400, b: 0.400 }, // #666
    border:       { r: 0.878, g: 0.878, b: 0.878 }, // #e0e0e0
    bgGray:       { r: 0.976, g: 0.976, b: 0.976 }, // #f9f9f9
    white:        { r: 1.000, g: 1.000, b: 1.000 },
    dark:         { r: 0.200, g: 0.200, b: 0.200 }, // #333 footer
    red:          { r: 0.937, g: 0.604, b: 0.604 }, // #ef9a9a
    yellow:       { r: 1.000, g: 0.800, b: 0.008 }, // #ffcc02
    yellowBg:     { r: 1.000, g: 0.992, b: 0.906 }, // #fffde7
    starYellow:   { r: 1.000, g: 0.757, b: 0.027 }, // #ffc107
  };

  const W = 390; // iPhone-width canvas

  // ── Helper builders ────────────────────────────────────────

  function rgb(c, a = 1) {
    return [{ type: 'SOLID', color: c, opacity: a }];
  }

  function frame(name, w, h, bg) {
    const f = figma.createFrame();
    f.name = name;
    f.resize(w, h);
    if (bg) f.fills = rgb(bg);
    else f.fills = [];
    f.clipsContent = false;
    return f;
  }

  async function text(str, size, color, bold, maxW) {
    const t = figma.createText();
    await figma.loadFontAsync(bold ? FONT_BOLD : FONT_REGULAR).catch(() => {});
    t.fontName = bold ? FONT_BOLD : FONT_REGULAR;
    t.characters = str;
    t.fontSize = size;
    t.fills = rgb(color);
    if (maxW) {
      t.textAutoResize = 'HEIGHT';
      t.resize(maxW, t.height);
    }
    return t;
  }

  function rect(w, h, fill, radius = 0) {
    const r = figma.createRectangle();
    r.resize(w, h);
    r.fills = rgb(fill);
    r.cornerRadius = radius;
    return r;
  }

  function addChild(parent, child, x, y) {
    parent.appendChild(child);
    child.x = x;
    child.y = y;
    return child;
  }

  // ── Page / root frame ──────────────────────────────────────
  const page = figma.currentPage;
  page.name = 'スリムサポートプラス LP';

  const root = frame('LP – スリムサポートプラス', W, 100, C.white);
  page.appendChild(root);
  root.x = 0;
  root.y = 0;

  let curY = 0; // vertical cursor inside root

  // Each section appended as child frame
  function section(name, h, bg) {
    const s = frame(name, W, h, bg);
    root.appendChild(s);
    s.x = 0;
    s.y = curY;
    curY += h;
    return s;
  }

  const PAD = 20; // horizontal padding

  // ── 1. HEADER ─────────────────────────────────────────────
  {
    const s = section('Header', 52, C.white);
    const border = rect(W, 1, C.border);
    addChild(s, border, 0, 51);

    const logo = await text('SLIM SUPPORT PLUS', 16, C.green, true);
    logo.textAlignHorizontal = 'CENTER';
    addChild(s, logo, (W - 200) / 2, 16);
  }

  // ── 2. NOTICE BAND ────────────────────────────────────────
  {
    const s = section('Notice Band', 44, C.yellowBg);
    const topBorder = rect(W, 2, C.yellow);
    addChild(s, topBorder, 0, 0);
    const botBorder = rect(W, 2, C.yellow);
    addChild(s, botBorder, 0, 42);

    const t = await text('🎁 定期初回限定 50%OFF ／ 送料無料 ／ いつでも解約可能', 12, { r: 0.475, g: 0.333, b: 0.282 }, false, W - PAD * 2);
    t.textAlignHorizontal = 'CENTER';
    addChild(s, t, PAD, 12);
  }

  // ── 3. HERO ───────────────────────────────────────────────
  {
    const s = section('Hero', 560, C.greenPale);

    // eyebrow
    const eyebrow = await text('🌿 機能性表示食品', 13, C.green, true);
    eyebrow.textAlignHorizontal = 'CENTER';
    addChild(s, eyebrow, (W - 160) / 2, 36);

    // headline
    const h1 = await text('毎日の体重・体脂肪ケアが\n続けやすい習慣になる', 24, C.text, true, W - PAD * 2);
    h1.textAlignHorizontal = 'CENTER';
    addChild(s, h1, PAD, 62);

    // sub
    const sub = await text('飲むだけ。たった1日2粒の"新習慣"。', 14, C.textLight, false);
    sub.textAlignHorizontal = 'CENTER';
    addChild(s, sub, (W - 260) / 2, 128);

    // Product card
    const card = frame('Product Card', W - PAD * 2, 220, C.white);
    card.cornerRadius = 16;
    card.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.08 }, offset: { x: 0, y: 4 }, radius: 24, visible: true, blendMode: 'NORMAL' }];
    addChild(s, card, PAD, 156);

    // product image placeholder
    const imgBg = rect(120, 120, C.greenMid, 12);
    addChild(card, imgBg, (card.width - 120) / 2, 20);
    const imgEmoji = await text('🌿', 40, C.white, false);
    addChild(card, imgEmoji, (card.width - 44) / 2, 50);

    // tag
    const tagBg = rect(90, 22, C.green, 2);
    addChild(card, tagBg, (card.width - 90) / 2, 150);
    const tagTxt = await text('機能性表示食品', 10, C.white, true);
    addChild(card, tagTxt, (card.width - 78) / 2, 155);

    // product name
    const pname = await text('スリムサポートプラス', 18, C.text, true, card.width - 24);
    pname.textAlignHorizontal = 'CENTER';
    addChild(card, pname, 12, 178);

    // badges row
    const badges = ['GMOフリー', '添加物不使用', '国内製造'];
    let bx = 12;
    for (const b of badges) {
      const bg = rect(80, 22, C.greenPale, 11);
      addChild(card, bg, bx, 204);
      const bt = await text(b, 10, C.green, true);
      addChild(card, bt, bx + 6, 208);
      bx += 86;
    }

    // CTA button
    const ctaBg = rect(W - PAD * 2, 56, C.accent, 28);
    addChild(s, ctaBg, PAD, 392);
    const ctaTxt = await text('🎁 初回50%OFFで今すぐ試す', 16, C.white, true, W - PAD * 4);
    ctaTxt.textAlignHorizontal = 'CENTER';
    addChild(s, ctaTxt, PAD * 2, 402);
    const ctaSub = await text('✓ 送料無料 ✓ いつでも解約OK', 11, C.white, false, W - PAD * 4);
    ctaSub.textAlignHorizontal = 'CENTER';
    addChild(s, ctaSub, PAD * 2, 424);

    // social proof
    const sp = await text('シリーズ累計出荷数\n120万袋突破（発売から3年）', 13, C.textLight, false, W - PAD * 2);
    sp.textAlignHorizontal = 'CENTER';
    addChild(s, sp, PAD, 472);
  }

  // ── 4. PROBLEM ────────────────────────────────────────────
  {
    const s = section('Problem', 480, C.bgGray);

    // accent tag
    const tagBg = rect(160, 24, C.accent, 2);
    addChild(s, tagBg, PAD, 40);
    const tagTxt = await text('こんなお悩みありませんか？', 10, C.white, true);
    addChild(s, tagTxt, PAD + 4, 45);

    const title = await text('「頑張っているのに\nなかなか変わらない…」', 20, C.text, true, W - PAD * 2);
    title.textAlignHorizontal = 'CENTER';
    addChild(s, title, PAD, 76);

    // divider
    const divider = rect(40, 3, C.green, 1);
    addChild(s, divider, (W - 40) / 2, 140);

    const problems = [
      '食事制限をしても体重が落ちにくくなった',
      '運動しても疲れるだけで結果が出ない',
      '年齢とともに体型が変わってきた気がする',
      '夕方になるとどか食いしてしまう',
      'お腹まわりのぽっこりが気になる',
      '続けやすいダイエットサポートが見つからない',
    ];

    let py = 160;
    for (const p of problems) {
      const bg = rect(W - PAD * 2, 42, C.white, 8);
      addChild(s, bg, PAD, py);
      const leftBar = rect(4, 42, C.red, 0);
      addChild(s, leftBar, PAD, py);
      const pt = await text('… ' + p, 13, C.text, false, W - PAD * 2 - 16);
      addChild(s, pt, PAD + 12, py + 12);
      py += 50;
    }

    // footer note
    const footBg = rect(W - PAD * 2, 60, { r: 1, g: 0.976, b: 0.878 }, 12);
    footBg.strokes = [{ type: 'SOLID', color: C.yellow }];
    footBg.strokeWeight = 2;
    addChild(s, footBg, PAD, py + 4);
    const footTxt = await text('それは「腸内環境」と「脂肪代謝」の\n見直しのタイミングかもしれません', 13, C.text, true, W - PAD * 4);
    footTxt.textAlignHorizontal = 'CENTER';
    addChild(s, footTxt, PAD * 2, py + 16);
  }

  // ── 5. INTRO ──────────────────────────────────────────────
  {
    const s = section('Intro', 320, C.white);

    const tagBg = rect(100, 24, C.green, 2);
    addChild(s, tagBg, PAD, 40);
    const tagTxt = await text('そのお悩みに', 10, C.white, true);
    addChild(s, tagTxt, PAD + 8, 45);

    const title = await text('日本初＊の腸内フローラ改善で\n体脂肪をアプローチする新しい選択', 18, C.text, true, W - PAD * 2);
    title.textAlignHorizontal = 'CENTER';
    addChild(s, title, PAD, 76);

    const divider = rect(40, 3, C.green, 1);
    addChild(s, divider, (W - 40) / 2, 140);

    const cardBg = rect(W - PAD * 2, 120, C.greenPale, 16);
    addChild(s, cardBg, PAD, 160);
    const emoji = await text('🌿', 32, C.text, false);
    addChild(s, emoji, (W - 36) / 2, 168);
    const cardTxt = await text('腸内環境を整える「有胞子性乳酸菌」と、食後の血糖値上昇を抑える「難消化性デキストリン」を独自配合。内側からアプローチする機能性表示食品として、毎日の食生活をサポートします。', 12, C.text, false, W - PAD * 4);
    cardTxt.textAlignHorizontal = 'CENTER';
    addChild(s, cardTxt, PAD * 2, 210);
  }

  // ── 6. FEATURES ───────────────────────────────────────────
  {
    const s = section('Features', 380, C.bgGray);

    const title = await text('3つの特長', 20, C.text, true, W - PAD * 2);
    title.textAlignHorizontal = 'CENTER';
    addChild(s, title, PAD, 40);
    const divider = rect(40, 3, C.green, 1);
    addChild(s, divider, (W - 40) / 2, 74);

    const features = [
      { num: '1', title: '食後の血中中性脂肪の上昇を抑える', desc: '機能性関与成分「難消化性デキストリン」が、食後に過剰な脂肪が吸収されるのをサポート。機能性表示食品として届出済みです。' },
      { num: '2', title: '腸内環境を整え、毎日スッキリ', desc: '「有胞子性乳酸菌」は熱や酸に強く生きたまま腸に届きやすい特性があります。善玉菌を増やし、腸のコンディションを整えます。' },
      { num: '3', title: '食事と一緒に飲むだけ、簡単習慣', desc: '1日2粒、食事のタイミングで水と一緒に飲むだけ。特別な食事制限は不要です。忙しい方にも続けやすい設計です。' },
    ];

    let fy = 96;
    for (const feat of features) {
      const bg = rect(W - PAD * 2, 80, C.white, 12);
      bg.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.05 }, offset: { x: 0, y: 2 }, radius: 8, visible: true, blendMode: 'NORMAL' }];
      addChild(s, bg, PAD, fy);

      const numBg = rect(36, 36, C.green, 18);
      addChild(s, numBg, PAD + 12, fy + 22);
      const numTxt = await text(feat.num, 16, C.white, true);
      addChild(s, numTxt, PAD + 22, fy + 28);

      const ftitle = await text(feat.title, 13, C.text, true, W - PAD * 2 - 68);
      addChild(s, ftitle, PAD + 58, fy + 12);
      const fdesc = await text(feat.desc, 11, C.textLight, false, W - PAD * 2 - 68);
      addChild(s, fdesc, PAD + 58, fy + 34);

      fy += 90;
    }
  }

  // ── 7. INGREDIENTS ────────────────────────────────────────
  {
    const s = section('Ingredients', 400, C.white);

    const title = await text('主要成分', 20, C.text, true, W - PAD * 2);
    title.textAlignHorizontal = 'CENTER';
    addChild(s, title, PAD, 40);
    const divider = rect(40, 3, C.green, 1);
    addChild(s, divider, (W - 40) / 2, 74);

    const ingredients = [
      { icon: '🌿', name: '難消化性デキストリン\n3,000mg', desc: '食後の血中中性脂肪・血糖値上昇を抑える機能性関与成分。' },
      { icon: '🦠', name: '有胞子性乳酸菌\n30億個', desc: '胞子の鎧をまとった乳酸菌。熱・酸に強く腸まで届きやすい。' },
      { icon: '🌍', name: 'ビフィズス菌BB-12\n20億個', desc: '腸内フローラのバランス維持をサポートする代表的な善玉菌。' },
      { icon: '🍠', name: '食物繊維（イヌリン）\n800mg', desc: '腸内の善玉菌のエサとなるプレバイオティクス成分。菊芋由来。' },
    ];

    const colW = (W - PAD * 2 - 12) / 2;
    ingredients.forEach((ing, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const ix = PAD + col * (colW + 12);
      const iy = 96 + row * 136;

      const bg = rect(colW, 120, C.white, 12);
      bg.strokes = [{ type: 'SOLID', color: C.greenMid }];
      bg.strokeWeight = 2;
      addChild(s, bg, ix, iy);

      const iconTxt = await text(ing.icon, 28, C.text, false);
      addChild(s, iconTxt, ix + colW / 2 - 16, iy + 10);
      const nameTxt = await text(ing.name, 11, C.green, true, colW - 12);
      nameTxt.textAlignHorizontal = 'CENTER';
      addChild(s, nameTxt, ix + 6, iy + 46);
      const descTxt = await text(ing.desc, 10, C.textLight, false, colW - 16);
      descTxt.textAlignHorizontal = 'CENTER';
      addChild(s, descTxt, ix + 8, iy + 82);
    });

    // note
    const noteBg = rect(W - PAD * 2, 48, C.greenPale, 8);
    addChild(s, noteBg, PAD, 374);
    const noteTxt = await text('⚠ 本品は食品衛生法に基づき国内のGMP認定工場で製造しています。機能性表示食品（届出番号：F-XXXX）です。', 10, C.textLight, false, W - PAD * 4);
    addChild(s, noteTxt, PAD * 2, 380);
  }

  // ── 8. RESULT ─────────────────────────────────────────────
  {
    const s = section('Result', 220, C.greenPale);

    const title = await text('飲み続けた方のリアルな結果', 18, C.text, true, W - PAD * 2);
    title.textAlignHorizontal = 'CENTER';
    addChild(s, title, PAD, 32);
    const divider = rect(40, 3, C.green, 1);
    addChild(s, divider, (W - 40) / 2, 66);

    const stats = [
      { num: '92%', label: '継続満足度\n（3ヶ月後）' },
      { num: '-3.2kg', label: '平均体重変化\n（3ヶ月）' },
      { num: '88%', label: 'お腹スッキリ\n実感率' },
    ];
    const sw = (W - PAD * 2 - 16) / 3;
    stats.forEach((st, i) => {
      const bg = rect(sw, 80, C.white, 12);
      bg.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.06 }, offset: { x: 0, y: 2 }, radius: 8, visible: true, blendMode: 'NORMAL' }];
      addChild(s, bg, PAD + i * (sw + 8), 86);
      const numTxt = await text(st.num, 18, C.green, true, sw - 8);
      numTxt.textAlignHorizontal = 'CENTER';
      addChild(s, numTxt, PAD + i * (sw + 8) + 4, 98);
      const labelTxt = await text(st.label, 10, C.textLight, false, sw - 8);
      labelTxt.textAlignHorizontal = 'CENTER';
      addChild(s, labelTxt, PAD + i * (sw + 8) + 4, 130);
    });

    const note = await text('＊当社モニター調査（n=200名、3ヶ月飲用後）個人差があります。', 10, C.textLight, false, W - PAD * 2);
    note.textAlignHorizontal = 'CENTER';
    addChild(s, note, PAD, 186);
  }

  // ── 9. REVIEWS ────────────────────────────────────────────
  {
    const s = section('Reviews', 460, C.bgGray);

    const title = await text('お客様の声', 20, C.text, true, W - PAD * 2);
    title.textAlignHorizontal = 'CENTER';
    addChild(s, title, PAD, 32);
    const divider = rect(40, 3, C.green, 1);
    addChild(s, divider, (W - 40) / 2, 66);

    const reviews = [
      { name: 'T.M さん（43歳・女性）', stars: '★★★★★', text: '産後から体重が戻らず悩んでいました。飲み始めて1ヶ月で体の変化を感じ、3ヶ月後には服のサイズが1サイズ下がりました！腸の調子もよくなり、毎朝スッキリです。', period: '継続3ヶ月' },
      { name: 'K.S さん（38歳・女性）', stars: '★★★★★', text: '食事制限が続かない私でも、これを飲むだけで意識が変わりました。お腹周りが少しずつすっきりしてきて、夫にも「変わったね」と言われました。', period: '継続2ヶ月' },
      { name: 'A.Y さん（51歳・女性）', stars: '★★★★☆', text: '更年期以降、どんな方法を試しても体重が落ちなかったのに、このサプリを飲み始めてから腸の動きが変わった気がします。まだ飲み始めて1ヶ月ですが、続けてみようと思います。', period: '継続1ヶ月' },
    ];

    let ry = 88;
    for (const rev of reviews) {
      const bg = rect(W - PAD * 2, 110, C.white, 12);
      bg.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.05 }, offset: { x: 0, y: 2 }, radius: 8, visible: true, blendMode: 'NORMAL' }];
      addChild(s, bg, PAD, ry);

      const nameTxt = await text(rev.name, 12, C.text, true);
      addChild(s, nameTxt, PAD + 12, ry + 12);
      const starsTxt = await text(rev.stars, 13, C.starYellow, false);
      addChild(s, starsTxt, W - PAD - 80, ry + 12);

      const revTxt = await text(rev.text, 11, C.text, false, W - PAD * 2 - 24);
      addChild(s, revTxt, PAD + 12, ry + 34);

      const tagBg = rect(72, 20, C.greenPale, 10);
      addChild(s, tagBg, PAD + 12, ry + 88);
      const tagTxt = await text(rev.period, 10, C.green, true);
      addChild(s, tagTxt, PAD + 16, ry + 92);

      ry += 120;
    }

    const disclaimer = await text('＊個人の感想です。効果・効能を保証するものではありません。', 10, C.textLight, false, W - PAD * 2);
    disclaimer.textAlignHorizontal = 'CENTER';
    addChild(s, disclaimer, PAD, ry + 4);
  }

  // ── 10. EXPERT ────────────────────────────────────────────
  {
    const s = section('Expert', 380, C.white);

    const title = await text('専門家からのコメント', 20, C.text, true, W - PAD * 2);
    title.textAlignHorizontal = 'CENTER';
    addChild(s, title, PAD, 32);
    const divider = rect(40, 3, C.green, 1);
    addChild(s, divider, (W - 40) / 2, 66);

    const experts = [
      { role: '消化器内科医 / 腸内フローラ研究', name: '田中 誠一 先生', comment: '腸内環境と体重管理の関係は、近年多くの研究で示されています。乳酸菌と食物繊維の同時摂取は理にかなったアプローチです。継続することで内側からの変化が期待できます。' },
      { role: '管理栄養士 / 分子栄養学', name: '鈴木 明子 先生', comment: '難消化性デキストリンは機能性関与成分として、食後の中性脂肪上昇を抑える働きが科学的に認められています。毎日の食事と一緒に摂ることで、無理なく脂質代謝をサポートできます。' },
    ];

    let ey = 88;
    for (const exp of experts) {
      const bg = rect(W - PAD * 2, 120, C.white, 16);
      bg.strokes = [{ type: 'SOLID', color: C.greenMid }];
      bg.strokeWeight = 2;
      addChild(s, bg, PAD, ey);

      const avatar = rect(52, 52, C.greenMid, 26);
      addChild(s, avatar, PAD + 12, ey + 16);
      const avatarTxt = await text('👨‍⚕️', 24, C.text, false);
      addChild(s, avatarTxt, PAD + 22, ey + 28);

      const roleTxt = await text(exp.role, 10, C.textLight, false, W - PAD * 2 - 80);
      addChild(s, roleTxt, PAD + 76, ey + 12);
      const nameTxt = await text(exp.name, 13, C.text, true, W - PAD * 2 - 80);
      addChild(s, nameTxt, PAD + 76, ey + 28);
      const commentTxt = await text(exp.comment, 11, C.textLight, false, W - PAD * 2 - 80);
      addChild(s, commentTxt, PAD + 76, ey + 52);

      ey += 136;
    }
  }

  // ── 11. HOW TO ORDER ──────────────────────────────────────
  {
    const s = section('How to Order', 220, C.bgGray);

    const title = await text('ご注文の流れ', 20, C.text, true, W - PAD * 2);
    title.textAlignHorizontal = 'CENTER';
    addChild(s, title, PAD, 32);
    const divider = rect(40, 3, C.green, 1);
    addChild(s, divider, (W - 40) / 2, 66);

    const steps = [
      { num: '1', title: 'プランを選ぶ', desc: '定期コース or 通常購入' },
      { num: '2', title: 'フォーム入力', desc: '氏名・住所・支払い方法' },
      { num: '3', title: 'ご自宅に届く', desc: '最短翌日発送' },
    ];
    const sw = (W - PAD * 2 - 16) / 3;
    steps.forEach((st, i) => {
      const sx = PAD + i * (sw + 8);
      const numBg = rect(40, 40, C.green, 20);
      addChild(s, numBg, sx + (sw - 40) / 2, 90);
      const numTxt = await text(st.num, 18, C.white, true);
      addChild(s, numTxt, sx + (sw - 40) / 2 + 12, 100);
      const stTitle = await text(st.title, 12, C.text, true, sw);
      stTitle.textAlignHorizontal = 'CENTER';
      addChild(s, stTitle, sx, 140);
      const stDesc = await text(st.desc, 10, C.textLight, false, sw);
      stDesc.textAlignHorizontal = 'CENTER';
      addChild(s, stDesc, sx, 158);
    });
  }

  // ── 12. PRICE / ORDER ─────────────────────────────────────
  {
    const s = section('Price', 560, C.white);

    const title = await text('今すぐ始める', 20, C.text, true, W - PAD * 2);
    title.textAlignHorizontal = 'CENTER';
    addChild(s, title, PAD, 32);
    const divider = rect(40, 3, C.green, 1);
    addChild(s, divider, (W - 40) / 2, 66);

    const halfW = (W - PAD * 2 - 12) / 2;

    // Recommended card
    const recCard = rect(halfW, 200, { r: 1, g: 0.973, b: 0.941 }, 16);
    recCard.strokes = [{ type: 'SOLID', color: C.accent }];
    recCard.strokeWeight = 2;
    addChild(s, recCard, PAD, 96);

    const recBadge = rect(80, 24, C.accent, 12);
    addChild(s, recBadge, PAD + (halfW - 80) / 2, 84);
    const recBadgeTxt = await text('★ 一番人気', 10, C.white, true);
    addChild(s, recBadgeTxt, PAD + (halfW - 80) / 2 + 10, 90);

    const recPlanTxt = await text('定期コース（60日分）', 11, C.textLight, true, halfW - 16);
    recPlanTxt.textAlignHorizontal = 'CENTER';
    addChild(s, recPlanTxt, PAD + 8, 110);
    const recPrice = await text('2,980円', 24, C.accent, true);
    addChild(s, recPrice, PAD + 20, 132);
    const recTax = await text('（税込 3,278円）', 10, C.textLight, false);
    addChild(s, recTax, PAD + 20, 162);
    const recOrig = await text('通常価格 6,480円', 10, { r: 0.667, g: 0.667, b: 0.667 }, false);
    addChild(s, recOrig, PAD + 20, 178);
    const recOff = rect(64, 20, { r: 1, g: 0.090, b: 0.267 }, 10);
    addChild(s, recOff, PAD + 20, 196);
    const recOffTxt = await text('初回 50%OFF', 10, C.white, true);
    addChild(s, recOffTxt, PAD + 24, 200);
    const recFeatures = await text('✓ 送料無料\n✓ 2回目以降30%OFF\n✓ いつでも解約OK', 10, C.text, false, halfW - 16);
    addChild(s, recFeatures, PAD + 8, 222);

    // Normal card
    const normCard = rect(halfW, 200, C.white, 16);
    normCard.strokes = [{ type: 'SOLID', color: C.border }];
    normCard.strokeWeight = 2;
    addChild(s, normCard, PAD + halfW + 12, 96);

    const normPlanTxt = await text('通常購入（30日分）', 11, C.textLight, true, halfW - 16);
    normPlanTxt.textAlignHorizontal = 'CENTER';
    addChild(s, normPlanTxt, PAD + halfW + 20, 110);
    const normPrice = await text('3,480円', 24, C.accent, true);
    addChild(s, normPrice, PAD + halfW + 20, 132);
    const normTax = await text('（税込 3,828円）', 10, C.textLight, false);
    addChild(s, normTax, PAD + halfW + 20, 162);
    const normShip = await text('送料 550円', 10, { r: 0.667, g: 0.667, b: 0.667 }, false);
    addChild(s, normShip, PAD + halfW + 20, 178);
    const normFeatures = await text('✓ お試しに最適\n✓ 縛りなし', 10, C.text, false, halfW - 16);
    addChild(s, normFeatures, PAD + halfW + 20, 222);

    // CTA
    const ctaBg = rect(W - PAD * 2, 56, C.accent, 28);
    addChild(s, ctaBg, PAD, 320);
    const ctaTxt = await text('🎁 定期初回50%OFFで申し込む', 15, C.white, true, W - PAD * 4);
    ctaTxt.textAlignHorizontal = 'CENTER';
    addChild(s, ctaTxt, PAD * 2, 330);
    const ctaSub = await text('✓ 送料無料 ✓ 2回目以降もお得 ✓ いつでも解約可', 10, C.white, false, W - PAD * 4);
    ctaSub.textAlignHorizontal = 'CENTER';
    addChild(s, ctaSub, PAD * 2, 352);

    // Guarantee
    const guarBg = rect(W - PAD * 2, 80, C.greenPale, 12);
    guarBg.strokes = [{ type: 'SOLID', color: C.greenMid }];
    guarBg.strokeWeight = 2;
    addChild(s, guarBg, PAD, 396);
    const guarTitle = await text('🛡 30日間全額返金保証', 14, C.green, true, W - PAD * 4);
    guarTitle.textAlignHorizontal = 'CENTER';
    addChild(s, guarTitle, PAD * 2, 408);
    const guarDesc = await text('お届けから30日以内にご連絡ください。全額返金いたします（初回お届け分1本に限る）。', 11, C.textLight, false, W - PAD * 4);
    guarDesc.textAlignHorizontal = 'CENTER';
    addChild(s, guarDesc, PAD * 2, 432);

    // Subscription details
    const detailBg = rect(W - PAD * 2, 88, C.greenPale, 12);
    addChild(s, detailBg, PAD, 492);
    const detailTxt = await text('✓ 定期コースについて\n・2回目以降は30%OFFの4,536円（税込）\n・お届け間隔は30日・60日から選択可能\n・次回お届け日の10日前までにいつでも解約できます', 10, C.textLight, false, W - PAD * 4);
    addChild(s, detailTxt, PAD * 2, 500);
  }

  // ── 13. FAQ ───────────────────────────────────────────────
  {
    const s = section('FAQ', 520, C.bgGray);

    const title = await text('よくあるご質問', 20, C.text, true, W - PAD * 2);
    title.textAlignHorizontal = 'CENTER';
    addChild(s, title, PAD, 32);
    const divider = rect(40, 3, C.green, 1);
    addChild(s, divider, (W - 40) / 2, 66);

    const faqs = [
      { q: 'いつ飲めばいいですか？', a: '食事と一緒にお飲みください。毎日同じタイミングで飲む習慣をつけると続けやすくなります。' },
      { q: '副作用はありますか？', a: '食品ですので通常の副作用はありません。まれにお腹が緩くなる場合があります。' },
      { q: 'いつ頃から効果を感じられますか？', a: '腸内環境の変化は2〜4週間が目安です。体重への変化は継続3ヶ月を目標にお飲みください。' },
      { q: '薬との併用は大丈夫ですか？', a: '現在薬を服用中の方は、念のため医師や薬剤師にご相談ください。' },
      { q: '解約はいつでもできますか？', a: 'はい、次回お届け日の10日前までにフリーダイヤルまたはマイページよりお手続きください。' },
      { q: '支払い方法は何が使えますか？', a: 'クレジットカード（VISA・Master・JCB・AMEX）、Amazon Pay、代金引換（+330円）がご利用いただけます。' },
    ];

    let fy = 88;
    for (const faq of faqs) {
      const bg = rect(W - PAD * 2, 70, C.white, 10);
      bg.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.06 }, offset: { x: 0, y: 1 }, radius: 4, visible: true, blendMode: 'NORMAL' }];
      addChild(s, bg, PAD, fy);
      const qTxt = await text('Q  ' + faq.q, 12, C.text, true, W - PAD * 2 - 24);
      addChild(s, qTxt, PAD + 12, fy + 10);
      const aTxt = await text(faq.a, 11, C.textLight, false, W - PAD * 2 - 24);
      addChild(s, aTxt, PAD + 12, fy + 34);
      fy += 80;
    }
  }

  // ── 14. FINAL CTA ─────────────────────────────────────────
  {
    const s = section('Final CTA', 240, C.greenPale);

    const title = await text('今日から始める、\n内側からのケア。', 22, C.text, true, W - PAD * 2);
    title.textAlignHorizontal = 'CENTER';
    addChild(s, title, PAD, 36);

    const desc = await text('毎日1日2粒。それだけで腸と向き合う新しい習慣を始めましょう。', 13, C.textLight, false, W - PAD * 2);
    desc.textAlignHorizontal = 'CENTER';
    addChild(s, desc, PAD, 112);

    const ctaBg = rect(W - PAD * 2, 56, C.accent, 28);
    addChild(s, ctaBg, PAD, 152);
    const ctaTxt = await text('🎁 定期初回50%OFFで申し込む', 15, C.white, true, W - PAD * 4);
    ctaTxt.textAlignHorizontal = 'CENTER';
    addChild(s, ctaTxt, PAD * 2, 162);
    const ctaSub = await text('✓ 送料無料 ✓ いつでも解約OK ✓ 30日間返金保証', 10, C.white, false, W - PAD * 4);
    ctaSub.textAlignHorizontal = 'CENTER';
    addChild(s, ctaSub, PAD * 2, 184);
  }

  // ── 15. COMPANY INFO ──────────────────────────────────────
  {
    const s = section('Company', 260, C.white);
    const border = rect(W, 1, C.border);
    addChild(s, border, 0, 0);

    const title = await text('特定商取引法に基づく表示', 14, C.text, true);
    addChild(s, title, PAD, 20);

    const rows = [
      ['販売業者', '株式会社〇〇ウエルネス'],
      ['代表者', '代表取締役 〇〇 〇〇'],
      ['所在地', '〒100-0000 東京都〇〇区〇〇1-1-1'],
      ['電話番号', '0120-XXX-XXX（受付 9:00〜18:00）'],
      ['メール', 'support@example.com'],
      ['送料', '定期コース：無料 / 通常購入：550円'],
      ['お届け', 'ご注文確認後、2〜5営業日以内に発送'],
    ];

    let ty = 50;
    for (const [label, val] of rows) {
      const rowBorder = rect(W - PAD * 2, 1, C.border);
      addChild(s, rowBorder, PAD, ty);
      const labelTxt = await text(label, 11, C.textLight, false, 80);
      addChild(s, labelTxt, PAD, ty + 6);
      const valTxt = await text(val, 11, C.text, false, W - PAD * 2 - 90);
      addChild(s, valTxt, PAD + 90, ty + 6);
      ty += 28;
    }
  }

  // ── 16. FOOTER ────────────────────────────────────────────
  {
    const s = section('Footer', 120, C.dark);

    const links = await text('特定商取引法に基づく表示　プライバシーポリシー　利用規約　お問い合わせ', 10, { r: 0.667, g: 0.667, b: 0.667 }, false, W - PAD * 2);
    links.textAlignHorizontal = 'CENTER';
    addChild(s, links, PAD, 20);

    const copy = await text('Copyright © 2025 株式会社〇〇ウエルネス All Rights Reserved.', 11, { r: 0.800, g: 0.800, b: 0.800 }, false, W - PAD * 2);
    copy.textAlignHorizontal = 'CENTER';
    addChild(s, copy, PAD, 48);

    const notice = await text('本品は機能性表示食品です（届出番号：F-XXXX）。食生活は、主食、主菜、副菜を基本に、食事のバランスを。', 10, { r: 0.533, g: 0.533, b: 0.533 }, false, W - PAD * 2);
    notice.textAlignHorizontal = 'CENTER';
    addChild(s, notice, PAD, 72);
  }

  // ── 17. FLOATING CTA ──────────────────────────────────────
  {
    const floatFrame = frame('Floating CTA (Fixed)', W, 72, C.white);
    floatFrame.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.12 }, offset: { x: 0, y: -4 }, radius: 16, visible: true, blendMode: 'NORMAL' }];
    page.appendChild(floatFrame);
    floatFrame.x = W + 40;
    floatFrame.y = 0;

    const ctaBg = rect(W - PAD * 2, 50, C.accent, 25);
    addChild(floatFrame, ctaBg, PAD, 10);
    const ctaTxt = await text('🎁 今すぐ定期初回50%OFFで申し込む', 14, C.white, true, W - PAD * 4);
    ctaTxt.textAlignHorizontal = 'CENTER';
    addChild(floatFrame, ctaTxt, PAD * 2, 18);
    const ctaSub = await text('✓ 送料無料 ✓ いつでも解約OK', 10, C.white, false, W - PAD * 4);
    ctaSub.textAlignHorizontal = 'CENTER';
    addChild(floatFrame, ctaSub, PAD * 2, 40);
  }

  // Resize root to fit all sections
  root.resize(W, curY);
  figma.viewport.scrollAndZoomIntoView([root]);

  figma.notify('✅ スリムサポートプラス LP デザインを生成しました！', { timeout: 4000 });
  figma.closePlugin();
};
