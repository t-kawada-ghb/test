// CreatorBridge Service Page Generator
// Figma Plugin - runs inside Figma to generate the full service page design

// ===== DESIGN TOKENS =====
const TOKEN = {
  color: {
    bgPrimary:     { r: 0.102, g: 0.102, b: 0.180, a: 1 }, // #1a1a2e
    bgSecondary:   { r: 0.086, g: 0.129, b: 0.243, a: 1 }, // #16213e
    surface:       { r: 0.059, g: 0.204, b: 0.376, a: 1 }, // #0f3460
    accent:        { r: 0.914, g: 0.271, b: 0.376, a: 1 }, // #e94560
    accentLight:   { r: 1.000, g: 0.420, b: 0.420, a: 1 }, // #ff6b6b
    white:         { r: 1,     g: 1,     b: 1,     a: 1 },
    textMuted:     { r: 0.627, g: 0.627, b: 0.690, a: 1 }, // #a0a0b0
    border:        { r: 1,     g: 1,     b: 1,     a: 0.10 },
    cardBg:        { r: 0.086, g: 0.129, b: 0.243, a: 1 },
    overlay:       { r: 0.914, g: 0.271, b: 0.376, a: 0.12 },
  },
  font: {
    black:  { family: 'Inter', style: 'Black' },
    bold:   { family: 'Inter', style: 'Bold' },
    semi:   { family: 'Inter', style: 'SemiBold' },
    medium: { family: 'Inter', style: 'Medium' },
    reg:    { family: 'Inter', style: 'Regular' },
  },
  radius: { sm: 6, md: 8, lg: 16, xl: 20, pill: 100 },
};

// ===== HELPERS =====
async function loadFonts() {
  const fonts = Object.values(TOKEN.font);
  await Promise.all(fonts.map(f => figma.loadFontAsync(f)));
}

function solid(color) {
  return [{ type: 'SOLID', color: { r: color.r, g: color.g, b: color.b }, opacity: color.a ?? 1 }];
}

function gradientFill(from, to, angle = 135) {
  const rad = (angle * Math.PI) / 180;
  return [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [
      [Math.cos(rad), -Math.sin(rad), 0.5 - 0.5 * Math.cos(rad) + 0.5 * Math.sin(rad)],
      [Math.sin(rad),  Math.cos(rad), 0.5 - 0.5 * Math.sin(rad) - 0.5 * Math.cos(rad)],
    ],
    gradientStops: [
      { color: { r: from.r, g: from.g, b: from.b, a: from.a ?? 1 }, position: 0 },
      { color: { r: to.r,   g: to.g,   b: to.b,   a: to.a   ?? 1 }, position: 1 },
    ],
  }];
}

function border(color) {
  return [{
    type: 'SOLID',
    color: { r: color.r, g: color.g, b: color.b },
    opacity: color.a ?? 1,
  }];
}

function makeRect(props = {}) {
  const node = figma.createRectangle();
  if (props.name)    node.name = props.name;
  if (props.x != null) node.x = props.x;
  if (props.y != null) node.y = props.y;
  if (props.w)       node.resize(props.w, props.h ?? props.w);
  if (props.fills)   node.fills = props.fills;
  if (props.radius != null) node.cornerRadius = props.radius;
  if (props.strokes) { node.strokes = props.strokes; node.strokeWeight = 1; }
  return node;
}

function makeFrame(props = {}) {
  const node = figma.createFrame();
  if (props.name)    node.name = props.name;
  if (props.x != null) node.x = props.x;
  if (props.y != null) node.y = props.y;
  if (props.w)       node.resize(props.w, props.h ?? 100);
  if (props.fills)   node.fills = props.fills;
  else               node.fills = [];
  if (props.radius != null)  node.cornerRadius = props.radius;
  if (props.strokes) { node.strokes = props.strokes; node.strokeWeight = 1; node.strokeAlign = 'INSIDE'; }
  if (props.clip != null)    node.clipsContent = props.clip;
  if (props.layout) {
    node.layoutMode = props.layout;
    node.primaryAxisSizingMode = props.primarySizing ?? 'AUTO';
    node.counterAxisSizingMode = props.counterSizing ?? 'AUTO';
    if (props.gap != null)        node.itemSpacing = props.gap;
    if (props.paddingH != null)   { node.paddingLeft = props.paddingH; node.paddingRight = props.paddingH; }
    if (props.paddingV != null)   { node.paddingTop = props.paddingV; node.paddingBottom = props.paddingV; }
    if (props.padTop != null)     node.paddingTop = props.padTop;
    if (props.padBottom != null)  node.paddingBottom = props.padBottom;
    if (props.padLeft != null)    node.paddingLeft = props.padLeft;
    if (props.padRight != null)   node.paddingRight = props.padRight;
    if (props.align)              node.primaryAxisAlignItems = props.align;
    if (props.crossAlign)         node.counterAxisAlignItems = props.crossAlign;
    if (props.wrap)               node.layoutWrap = 'WRAP';
  }
  return node;
}

async function makeText(props = {}) {
  const node = figma.createText();
  const font = props.font ?? TOKEN.font.reg;
  await figma.loadFontAsync(font);
  node.fontName = font;
  node.characters = props.text ?? '';
  node.fontSize = props.size ?? 14;
  node.fills = props.fills ?? solid(TOKEN.color.white);
  if (props.name)       node.name = props.name;
  if (props.x != null)  node.x = props.x;
  if (props.y != null)  node.y = props.y;
  if (props.lineH)      node.lineHeight = { value: props.lineH, unit: 'PIXELS' };
  if (props.letterSpacing) node.letterSpacing = { value: props.letterSpacing, unit: 'PIXELS' };
  if (props.align)      node.textAlignHorizontal = props.align;
  if (props.autoWidth)  node.textAutoResize = 'WIDTH_AND_HEIGHT';
  else                  node.textAutoResize = 'HEIGHT';
  if (props.w)          node.resize(props.w, node.height);
  return node;
}

function makeSeparator(w, color = TOKEN.color.border) {
  const line = figma.createLine();
  line.resize(w, 0);
  line.strokes = border(color);
  line.strokeWeight = 1;
  return line;
}

function chip(text, bg, textColor) {
  const frame = makeFrame({
    name: `chip-${text}`,
    layout: 'HORIZONTAL',
    paddingH: 10, paddingV: 5,
    radius: TOKEN.radius.pill,
    fills: [{ type: 'SOLID', color: { r: bg.r, g: bg.g, b: bg.b }, opacity: bg.a ?? 1 }],
    primarySizing: 'AUTO',
    counterSizing: 'AUTO',
    crossAlign: 'CENTER',
    align: 'CENTER',
  });
  const t = figma.createText();
  t.fontName = TOKEN.font.bold;
  t.characters = text;
  t.fontSize = 11;
  t.fills = solid(textColor);
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  frame.appendChild(t);
  return frame;
}

// ===== SECTION BUILDERS =====

// --- NAV ---
async function buildNav(pageW) {
  const nav = makeFrame({
    name: 'Nav',
    w: pageW, h: 64,
    fills: [{ type: 'SOLID', color: { r: 0.102, g: 0.102, b: 0.180 }, opacity: 0.92 }],
    strokes: border(TOKEN.color.border),
    layout: 'HORIZONTAL',
    paddingH: 80, paddingV: 0,
    align: 'SPACE_BETWEEN',
    crossAlign: 'CENTER',
    primarySizing: 'FIXED',
    counterSizing: 'FIXED',
  });

  // Logo
  const logo = makeFrame({
    name: 'Logo',
    layout: 'HORIZONTAL',
    gap: 0,
    crossAlign: 'CENTER',
    primarySizing: 'AUTO',
    counterSizing: 'AUTO',
  });
  const l1 = await makeText({ text: 'Creator', size: 22, font: TOKEN.font.black });
  const l2 = await makeText({ text: 'Bridge', size: 22, font: TOKEN.font.black, fills: solid(TOKEN.color.accent) });
  logo.appendChild(l1);
  logo.appendChild(l2);

  // Nav links
  const links = makeFrame({
    name: 'NavLinks',
    layout: 'HORIZONTAL',
    gap: 32,
    crossAlign: 'CENTER',
    primarySizing: 'AUTO',
    counterSizing: 'AUTO',
  });
  for (const lbl of ['仕組み', '特徴', '対象者', '料金']) {
    const t = await makeText({ text: lbl, size: 14, fills: solid(TOKEN.color.textMuted) });
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    links.appendChild(t);
  }

  // CTA button
  const ctaBtn = makeFrame({
    name: 'NavCTA',
    layout: 'HORIZONTAL',
    paddingH: 20, paddingV: 10,
    radius: TOKEN.radius.sm,
    fills: gradientFill(TOKEN.color.accent, { r: 0.760, g: 0.094, b: 0.357, a: 1 }),
    primarySizing: 'AUTO',
    counterSizing: 'AUTO',
    crossAlign: 'CENTER',
  });
  const ctaTxt = await makeText({ text: '無料登録', size: 14, font: TOKEN.font.bold });
  ctaBtn.appendChild(ctaTxt);

  nav.appendChild(logo);
  nav.appendChild(links);
  nav.appendChild(ctaBtn);
  return nav;
}

// --- HERO ---
async function buildHero(pageW) {
  const section = makeFrame({
    name: 'Hero',
    w: pageW, h: 760,
    fills: solid(TOKEN.color.bgPrimary),
    clip: true,
  });

  // Background glow
  const glow1 = makeRect({ w: 700, h: 700, radius: 350, fills: [{ type: 'SOLID', color: { r: 0.914, g: 0.271, b: 0.376 }, opacity: 0.10 }] });
  glow1.x = pageW * 0.45; glow1.y = -100;
  section.appendChild(glow1);

  // Content wrapper
  const content = makeFrame({
    name: 'HeroContent',
    layout: 'HORIZONTAL',
    gap: 80,
    paddingH: 80,
    paddingV: 100,
    crossAlign: 'CENTER',
    primarySizing: 'FIXED',
    counterSizing: 'FIXED',
    w: pageW, h: 760,
  });

  // Left side
  const left = makeFrame({
    name: 'HeroLeft',
    layout: 'VERTICAL',
    gap: 0,
    primarySizing: 'AUTO',
    counterSizing: 'FIXED',
    w: 560,
  });

  // Badge
  const badge = makeFrame({
    name: 'Badge',
    layout: 'HORIZONTAL',
    paddingH: 16, paddingV: 6,
    radius: TOKEN.radius.pill,
    fills: [{ type: 'SOLID', color: TOKEN.color.accent, opacity: 0.15 }],
    strokes: [{ type: 'SOLID', color: TOKEN.color.accent, opacity: 0.4 }],
    primarySizing: 'AUTO',
    counterSizing: 'AUTO',
  });
  const badgeTxt = await makeText({ text: 'NEW — 2024年スタート', size: 12, font: TOKEN.font.bold, fills: solid(TOKEN.color.accentLight) });
  badgeTxt.textAutoResize = 'WIDTH_AND_HEIGHT';
  badgeTxt.letterSpacing = { value: 0.5, unit: 'PIXELS' };
  badge.appendChild(badgeTxt);
  left.appendChild(badge);

  // Spacer
  const sp1 = makeFrame({ name: 'spacer', h: 20, w: 1 }); left.appendChild(sp1);

  // Heading
  const h1 = await makeText({
    text: '経験豊富なクリエイターと\nビジョンある企業を\n最適にマッチング',
    size: 48, font: TOKEN.font.black,
    lineH: 62, w: 560,
  });
  left.appendChild(h1);

  const sp2 = makeFrame({ name: 'spacer', h: 24, w: 1 }); left.appendChild(sp2);

  // Subtext
  const sub = await makeText({
    text: '10年以上の実績を持つデザイナー、ライター、映像クリエイターと、\n本質的な品質を求める企業をダイレクトにつなぐプラットフォーム。',
    size: 16, fills: solid(TOKEN.color.textMuted), lineH: 28, w: 520,
  });
  left.appendChild(sub);

  const sp3 = makeFrame({ name: 'spacer', h: 40, w: 1 }); left.appendChild(sp3);

  // Buttons
  const btns = makeFrame({
    name: 'HeroButtons',
    layout: 'HORIZONTAL',
    gap: 16,
    primarySizing: 'AUTO',
    counterSizing: 'AUTO',
    crossAlign: 'CENTER',
  });
  const btnPrimary = makeFrame({
    name: 'BtnPrimary',
    layout: 'HORIZONTAL',
    paddingH: 32, paddingV: 16,
    radius: TOKEN.radius.md,
    fills: gradientFill(TOKEN.color.accent, { r: 0.760, g: 0.094, b: 0.357, a: 1 }),
    primarySizing: 'AUTO', counterSizing: 'AUTO',
  });
  btnPrimary.appendChild(await makeText({ text: 'クリエイターとして登録', size: 16, font: TOKEN.font.bold }));

  const btnSecondary = makeFrame({
    name: 'BtnSecondary',
    layout: 'HORIZONTAL',
    paddingH: 32, paddingV: 16,
    radius: TOKEN.radius.md,
    fills: [],
    strokes: border(TOKEN.color.border),
    primarySizing: 'AUTO', counterSizing: 'AUTO',
  });
  btnSecondary.appendChild(await makeText({ text: '企業として採用する', size: 16, font: TOKEN.font.semi }));

  btns.appendChild(btnPrimary);
  btns.appendChild(btnSecondary);
  left.appendChild(btns);

  const sp4 = makeFrame({ name: 'spacer', h: 48, w: 1 }); left.appendChild(sp4);

  // Divider
  const div = makeSeparator(560);
  left.appendChild(div);

  const sp5 = makeFrame({ name: 'spacer', h: 32, w: 1 }); left.appendChild(sp5);

  // Stats
  const stats = makeFrame({
    name: 'Stats',
    layout: 'HORIZONTAL',
    gap: 48,
    primarySizing: 'AUTO', counterSizing: 'AUTO',
  });
  const statData = [
    { num: '2,400+', label: '登録クリエイター' },
    { num: '850+',   label: '掲載企業' },
    { num: '94%',    label: 'マッチング満足度' },
  ];
  for (const s of statData) {
    const item = makeFrame({ name: `Stat-${s.num}`, layout: 'VERTICAL', gap: 4, primarySizing: 'AUTO', counterSizing: 'AUTO' });
    const num = await makeText({ text: s.num, size: 28, font: TOKEN.font.black, fills: solid(TOKEN.color.accentLight) });
    num.textAutoResize = 'WIDTH_AND_HEIGHT';
    const lbl = await makeText({ text: s.label, size: 12, fills: solid(TOKEN.color.textMuted) });
    lbl.textAutoResize = 'WIDTH_AND_HEIGHT';
    item.appendChild(num);
    item.appendChild(lbl);
    stats.appendChild(item);
  }
  left.appendChild(stats);

  // Right side — Profile Cards
  const right = makeFrame({
    name: 'HeroVisual',
    w: 400, h: 460,
    primarySizing: 'FIXED', counterSizing: 'FIXED',
  });

  const cardData = [
    { name: '田中 美咲', role: 'UI/UXデザイナー · 12年', emoji: '🎨', tags: ['Figma', 'Webデザイン'], offsetX: 0,   offsetY: 0,  rotation: -3 },
    { name: '山田 健太', role: 'コピーライター · 15年',   emoji: '📝', tags: ['ブランディング', '広告'],   offsetX: 80,  offsetY: 60, rotation: 0  },
    { name: '鈴木 綾子', role: '映像ディレクター · 10年', emoji: '🎬', tags: ['動画制作', 'CM'],           offsetX: 160, offsetY: 30, rotation: 2  },
  ];

  for (const [i, cd] of cardData.entries()) {
    const card = makeFrame({
      name: `ProfileCard-${cd.name}`,
      w: 240, h: 140,
      fills: solid(TOKEN.color.bgSecondary),
      strokes: border(TOKEN.color.border),
      radius: TOKEN.radius.lg,
      layout: 'VERTICAL',
      gap: 6,
      paddingH: 20, paddingV: 18,
      primarySizing: 'FIXED', counterSizing: 'FIXED',
    });

    const emojiTxt = await makeText({ text: cd.emoji, size: 28 });
    emojiTxt.textAutoResize = 'WIDTH_AND_HEIGHT';
    const nameT = await makeText({ text: cd.name, size: 14, font: TOKEN.font.bold });
    nameT.textAutoResize = 'WIDTH_AND_HEIGHT';
    const roleT = await makeText({ text: cd.role, size: 12, fills: solid(TOKEN.color.textMuted) });
    roleT.textAutoResize = 'WIDTH_AND_HEIGHT';

    const tagRow = makeFrame({ name: 'TagRow', layout: 'HORIZONTAL', gap: 6, primarySizing: 'AUTO', counterSizing: 'AUTO', wrap: true });
    for (const tag of cd.tags) {
      tagRow.appendChild(chip(tag, { r: 0.914, g: 0.271, b: 0.376, a: 0.15 }, TOKEN.color.accentLight));
    }

    card.appendChild(emojiTxt);
    card.appendChild(nameT);
    card.appendChild(roleT);
    card.appendChild(tagRow);

    card.x = cd.offsetX;
    card.y = cd.offsetY;
    card.rotation = cd.rotation;
    right.appendChild(card);
  }

  // Match badge
  const matchBadge = makeFrame({
    name: 'MatchBadge',
    layout: 'HORIZONTAL',
    paddingH: 16, paddingV: 12,
    radius: 10,
    fills: gradientFill(TOKEN.color.accent, { r: 0.760, g: 0.094, b: 0.357, a: 1 }),
    primarySizing: 'AUTO', counterSizing: 'AUTO',
  });
  matchBadge.appendChild(await makeText({ text: '✓ マッチング完了', size: 14, font: TOKEN.font.bold }));
  matchBadge.x = 200;
  matchBadge.y = 340;
  right.appendChild(matchBadge);

  content.appendChild(left);
  content.appendChild(right);
  section.appendChild(content);

  return section;
}

// --- HOW IT WORKS ---
async function buildHowItWorks(pageW) {
  const section = makeFrame({
    name: 'HowItWorks',
    w: pageW,
    fills: solid(TOKEN.color.bgSecondary),
    layout: 'VERTICAL',
    paddingH: 80, paddingV: 80,
    gap: 0,
    primarySizing: 'AUTO', counterSizing: 'FIXED',
  });

  const lbl = await makeText({ text: 'HOW IT WORKS', size: 12, font: TOKEN.font.bold, fills: solid(TOKEN.color.accent) });
  lbl.textAutoResize = 'WIDTH_AND_HEIGHT';
  lbl.letterSpacing = { value: 2, unit: 'PIXELS' };
  section.appendChild(lbl);

  section.appendChild(makeFrame({ name: 'sp', h: 12, w: 1 }));

  const title = await makeText({ text: 'シンプルな3ステップで\n理想のマッチングへ', size: 36, font: TOKEN.font.black, lineH: 48, w: pageW - 160 });
  section.appendChild(title);

  section.appendChild(makeFrame({ name: 'sp', h: 12, w: 1 }));

  const desc = await makeText({ text: '面倒な手続きは最小限に。スピーディーに、質の高いコラボレーションをスタートできます。', size: 15, fills: solid(TOKEN.color.textMuted), lineH: 26, w: 560 });
  section.appendChild(desc);

  section.appendChild(makeFrame({ name: 'sp', h: 48, w: 1 }));

  const steps = [
    { num: '01', icon: '📋', title: 'プロフィール作成',  desc: '実績・スキル・得意領域を登録。ポートフォリオをそのままアップロードできます。' },
    { num: '02', icon: '🤖', title: 'AIマッチング',      desc: '独自アルゴリズムがスキル・業界・ワークスタイルを分析し、最適な候補を提示します。' },
    { num: '03', icon: '🤝', title: '直接交渉・契約',    desc: 'プラットフォーム内で安全にコミュニケーション。契約書のテンプレートも完備。' },
    { num: '04', icon: '🚀', title: 'プロジェクト開始',  desc: '進捗管理・請求・支払いをワンプラットフォームで完結。面倒な事務作業ゼロ。' },
  ];

  const grid = makeFrame({
    name: 'StepsGrid',
    layout: 'HORIZONTAL',
    gap: 24,
    primarySizing: 'AUTO', counterSizing: 'AUTO',
  });

  for (const s of steps) {
    const card = makeFrame({
      name: `Step-${s.num}`,
      w: (pageW - 160 - 72) / 4,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.03 }],
      strokes: border(TOKEN.color.border),
      radius: TOKEN.radius.lg,
      layout: 'VERTICAL',
      gap: 10,
      paddingH: 24, paddingV: 28,
      primarySizing: 'AUTO', counterSizing: 'FIXED',
    });
    const numT = await makeText({ text: s.num, size: 36, font: TOKEN.font.black, fills: [{ type: 'SOLID', color: { r: 0.914, g: 0.271, b: 0.376 }, opacity: 0.2 }] });
    numT.textAutoResize = 'WIDTH_AND_HEIGHT';
    const iconT = await makeText({ text: s.icon, size: 28 });
    iconT.textAutoResize = 'WIDTH_AND_HEIGHT';
    const titleT = await makeText({ text: s.title, size: 15, font: TOKEN.font.bold, w: (pageW - 160 - 72) / 4 - 48 });
    const descT = await makeText({ text: s.desc, size: 13, fills: solid(TOKEN.color.textMuted), lineH: 22, w: (pageW - 160 - 72) / 4 - 48 });
    card.appendChild(numT);
    card.appendChild(iconT);
    card.appendChild(titleT);
    card.appendChild(descT);
    grid.appendChild(card);
  }
  section.appendChild(grid);
  return section;
}

// --- FEATURES ---
async function buildFeatures(pageW) {
  const section = makeFrame({
    name: 'Features',
    w: pageW,
    fills: solid(TOKEN.color.bgPrimary),
    layout: 'VERTICAL',
    paddingH: 80, paddingV: 80,
    gap: 0,
    primarySizing: 'AUTO', counterSizing: 'FIXED',
  });

  const lbl = await makeText({ text: 'FEATURES', size: 12, font: TOKEN.font.bold, fills: solid(TOKEN.color.accent) });
  lbl.textAutoResize = 'WIDTH_AND_HEIGHT';
  lbl.letterSpacing = { value: 2, unit: 'PIXELS' };
  section.appendChild(lbl);
  section.appendChild(makeFrame({ name: 'sp', h: 12, w: 1 }));
  section.appendChild(await makeText({ text: '選ばれる理由', size: 36, font: TOKEN.font.black, w: pageW - 160 }));
  section.appendChild(makeFrame({ name: 'sp', h: 12, w: 1 }));
  section.appendChild(await makeText({ text: '他のフリーランスプラットフォームにはない、プロ向けの機能を揃えています。', size: 15, fills: solid(TOKEN.color.textMuted), lineH: 26, w: 560 }));
  section.appendChild(makeFrame({ name: 'sp', h: 48, w: 1 }));

  const features = [
    { icon: '🎯', title: '経験値でフィルタリング',    desc: '実務経験5年以上を必須条件としたクリエイターのみ登録可能。品質保証された人材プールで時間を節約。' },
    { icon: '🔒', title: '実績審査・本人確認済み',     desc: '全登録クリエイターの過去実績と本人確認を審査。詐欺・なりすましゼロの信頼できる環境。' },
    { icon: '💬', title: '安全な決済・エスクロー',     desc: '支払いは納品確認後に自動振込。未払い・未納品トラブルをシステムで完全防止。' },
    { icon: '📊', title: '詳細なスキルグラフ',         desc: '各クリエイターのスキルセットをレーダーチャートで可視化。比較・選定が直感的に行えます。' },
    { icon: '🌐', title: '業界特化マッチング',         desc: 'IT・広告・出版・映像など20以上の業界カテゴリで専門性の高いマッチングを実現。' },
    { icon: '⭐', title: '双方向レビューシステム',     desc: 'プロジェクト完了後にクリエイター・企業が互いを評価。透明性の高い信頼スコアを構築。' },
  ];

  const colW = (pageW - 160 - 48) / 3;
  // Row 1
  const row1 = makeFrame({ name: 'FeatRow1', layout: 'HORIZONTAL', gap: 24, primarySizing: 'AUTO', counterSizing: 'AUTO' });
  const row2 = makeFrame({ name: 'FeatRow2', layout: 'HORIZONTAL', gap: 24, primarySizing: 'AUTO', counterSizing: 'AUTO' });

  for (const [i, f] of features.entries()) {
    const card = makeFrame({
      name: `Feature-${f.title}`,
      w: colW,
      fills: solid(TOKEN.color.bgSecondary),
      strokes: border(TOKEN.color.border),
      radius: TOKEN.radius.lg,
      layout: 'VERTICAL',
      gap: 12,
      paddingH: 28, paddingV: 28,
      primarySizing: 'AUTO', counterSizing: 'FIXED',
    });

    const iconBox = makeFrame({
      name: 'IconBox',
      w: 52, h: 52,
      radius: 12,
      fills: [{ type: 'SOLID', color: TOKEN.color.accent, opacity: 0.12 }],
      layout: 'HORIZONTAL',
      align: 'CENTER', crossAlign: 'CENTER',
      primarySizing: 'FIXED', counterSizing: 'FIXED',
    });
    const iconT = await makeText({ text: f.icon, size: 22 });
    iconT.textAutoResize = 'WIDTH_AND_HEIGHT';
    iconBox.appendChild(iconT);

    card.appendChild(iconBox);
    card.appendChild(await makeText({ text: f.title, size: 15, font: TOKEN.font.bold, w: colW - 56 }));
    card.appendChild(await makeText({ text: f.desc, size: 13, fills: solid(TOKEN.color.textMuted), lineH: 22, w: colW - 56 }));
    (i < 3 ? row1 : row2).appendChild(card);
  }
  section.appendChild(row1);
  section.appendChild(makeFrame({ name: 'sp', h: 24, w: 1 }));
  section.appendChild(row2);
  return section;
}

// --- TARGET ---
async function buildTarget(pageW) {
  const section = makeFrame({
    name: 'Target',
    w: pageW,
    fills: solid(TOKEN.color.bgSecondary),
    layout: 'VERTICAL',
    paddingH: 80, paddingV: 80,
    gap: 0,
    primarySizing: 'AUTO', counterSizing: 'FIXED',
  });

  const lbl = await makeText({ text: 'FOR WHOM', size: 12, font: TOKEN.font.bold, fills: solid(TOKEN.color.accent) });
  lbl.textAutoResize = 'WIDTH_AND_HEIGHT';
  lbl.letterSpacing = { value: 2, unit: 'PIXELS' };
  section.appendChild(lbl);
  section.appendChild(makeFrame({ name: 'sp', h: 12, w: 1 }));
  section.appendChild(await makeText({ text: 'どんな人・企業に向いている？', size: 36, font: TOKEN.font.black, w: pageW - 160 }));
  section.appendChild(makeFrame({ name: 'sp', h: 12, w: 1 }));
  section.appendChild(await makeText({ text: 'CreatorBridgeは「量より質」を追求する方のためのプラットフォームです。', size: 15, fills: solid(TOKEN.color.textMuted), lineH: 26, w: 560 }));
  section.appendChild(makeFrame({ name: 'sp', h: 48, w: 1 }));

  const colW = (pageW - 160 - 24) / 2;
  const row = makeFrame({ name: 'TargetCards', layout: 'HORIZONTAL', gap: 24, primarySizing: 'AUTO', counterSizing: 'AUTO' });

  // Creators card
  const creatorCard = makeFrame({
    name: 'CreatorCard',
    w: colW,
    fills: [{ type: 'SOLID', color: { r: 0.914, g: 0.271, b: 0.376 }, opacity: 0.06 }],
    strokes: [{ type: 'SOLID', color: { r: 0.914, g: 0.271, b: 0.376 }, opacity: 0.25 }],
    radius: TOKEN.radius.xl,
    layout: 'VERTICAL',
    gap: 12,
    paddingH: 36, paddingV: 36,
    primarySizing: 'AUTO', counterSizing: 'FIXED',
  });
  const cLbl = await makeText({ text: 'FOR CREATORS', size: 11, font: TOKEN.font.bold, fills: solid(TOKEN.color.accentLight) });
  cLbl.textAutoResize = 'WIDTH_AND_HEIGHT';
  cLbl.letterSpacing = { value: 1.5, unit: 'PIXELS' };
  creatorCard.appendChild(cLbl);
  creatorCard.appendChild(await makeText({ text: '経験豊富なクリエイターの方へ', size: 22, font: TOKEN.font.black, lineH: 32, w: colW - 72 }));
  creatorCard.appendChild(await makeText({ text: 'あなたのスキルと実績を正当に評価してくれる企業と出会えます。', size: 14, fills: solid(TOKEN.color.textMuted), lineH: 24, w: colW - 72 }));
  creatorCard.appendChild(makeFrame({ name: 'sp', h: 8, w: 1 }));
  for (const b of ['適正単価での案件獲得', '長期・継続案件が豊富', 'ポートフォリオを最大限にアピール', '契約・請求の事務作業を自動化']) {
    const row2 = makeFrame({ name: 'BenefitRow', layout: 'HORIZONTAL', gap: 10, primarySizing: 'AUTO', counterSizing: 'AUTO', crossAlign: 'CENTER' });
    const check = await makeText({ text: '✓', size: 14, font: TOKEN.font.bold, fills: solid(TOKEN.color.accentLight) });
    check.textAutoResize = 'WIDTH_AND_HEIGHT';
    const bTxt = await makeText({ text: b, size: 14, fills: solid(TOKEN.color.textMuted) });
    bTxt.textAutoResize = 'WIDTH_AND_HEIGHT';
    row2.appendChild(check);
    row2.appendChild(bTxt);
    creatorCard.appendChild(row2);
  }

  // Company card
  const companyCard = makeFrame({
    name: 'CompanyCard',
    w: colW,
    fills: [{ type: 'SOLID', color: { r: 0.059, g: 0.204, b: 0.376 }, opacity: 0.4 }],
    strokes: [{ type: 'SOLID', color: { r: 0.494, g: 0.722, b: 0.969 }, opacity: 0.2 }],
    radius: TOKEN.radius.xl,
    layout: 'VERTICAL',
    gap: 12,
    paddingH: 36, paddingV: 36,
    primarySizing: 'AUTO', counterSizing: 'FIXED',
  });
  const coLbl = await makeText({ text: 'FOR COMPANIES', size: 11, font: TOKEN.font.bold, fills: [{ type: 'SOLID', color: { r: 0.494, g: 0.722, b: 0.969 } }] });
  coLbl.textAutoResize = 'WIDTH_AND_HEIGHT';
  coLbl.letterSpacing = { value: 1.5, unit: 'PIXELS' };
  companyCard.appendChild(coLbl);
  companyCard.appendChild(await makeText({ text: '優秀な人材を求める企業の方へ', size: 22, font: TOKEN.font.black, lineH: 32, w: colW - 72 }));
  companyCard.appendChild(await makeText({ text: '経験豊富なクリエイターとのコラボレーションで、プロジェクトの品質を一段引き上げましょう。', size: 14, fills: solid(TOKEN.color.textMuted), lineH: 24, w: colW - 72 }));
  companyCard.appendChild(makeFrame({ name: 'sp', h: 8, w: 1 }));
  for (const b of ['審査済みのプロ人材にアクセス', '業界・スキルで精度高く検索', '最短3日でプロジェクト開始', '採用コストを大幅に削減']) {
    const row2 = makeFrame({ name: 'BenefitRow', layout: 'HORIZONTAL', gap: 10, primarySizing: 'AUTO', counterSizing: 'AUTO', crossAlign: 'CENTER' });
    const check = await makeText({ text: '✓', size: 14, font: TOKEN.font.bold, fills: [{ type: 'SOLID', color: { r: 0.494, g: 0.722, b: 0.969 } }] });
    check.textAutoResize = 'WIDTH_AND_HEIGHT';
    const bTxt = await makeText({ text: b, size: 14, fills: solid(TOKEN.color.textMuted) });
    bTxt.textAutoResize = 'WIDTH_AND_HEIGHT';
    row2.appendChild(check);
    row2.appendChild(bTxt);
    companyCard.appendChild(row2);
  }

  row.appendChild(creatorCard);
  row.appendChild(companyCard);
  section.appendChild(row);
  return section;
}

// --- PRICING ---
async function buildPricing(pageW) {
  const section = makeFrame({
    name: 'Pricing',
    w: pageW,
    fills: solid(TOKEN.color.bgPrimary),
    layout: 'VERTICAL',
    paddingH: 80, paddingV: 80,
    gap: 0,
    primarySizing: 'AUTO', counterSizing: 'FIXED',
    crossAlign: 'CENTER',
    align: 'MIN',
  });

  const lbl = await makeText({ text: 'PRICING', size: 12, font: TOKEN.font.bold, fills: solid(TOKEN.color.accent), align: 'CENTER' });
  lbl.textAutoResize = 'WIDTH_AND_HEIGHT';
  lbl.letterSpacing = { value: 2, unit: 'PIXELS' };
  section.appendChild(lbl);
  section.appendChild(makeFrame({ name: 'sp', h: 12, w: 1 }));

  const titleT = await makeText({ text: 'シンプルな料金プラン', size: 36, font: TOKEN.font.black, align: 'CENTER', w: pageW - 160 });
  section.appendChild(titleT);
  section.appendChild(makeFrame({ name: 'sp', h: 48, w: 1 }));

  const plans = [
    {
      name: 'フリー', price: '¥0', period: '永久無料',
      items: ['プロフィール作成・公開', '月3件まで応募・スカウト', '基本メッセージ機能', '取引手数料 20%'],
      featured: false,
    },
    {
      name: 'スタンダード', price: '¥4,980', period: '/ 月（税込）',
      items: ['無制限の応募・スカウト', '優先表示・注目バッジ', '高度な絞り込み検索', '取引手数料 10%', '月次レポート・分析'],
      featured: true,
    },
    {
      name: 'エンタープライズ', price: '要相談', period: '年間契約',
      items: ['専任コンシェルジュ', '取引手数料 5%', '複数アカウント管理', 'カスタムSLA対応', '請求書払い対応'],
      featured: false,
    },
  ];

  const colW = (pageW - 160 - 48) / 3;
  const planRow = makeFrame({ name: 'PricingCards', layout: 'HORIZONTAL', gap: 24, primarySizing: 'AUTO', counterSizing: 'AUTO' });

  for (const p of plans) {
    const card = makeFrame({
      name: `Plan-${p.name}`,
      w: colW,
      fills: p.featured
        ? [{ type: 'SOLID', color: { r: 0.914, g: 0.271, b: 0.376 }, opacity: 0.06 }]
        : solid(TOKEN.color.bgSecondary),
      strokes: p.featured
        ? [{ type: 'SOLID', color: { r: 0.914, g: 0.271, b: 0.376 }, opacity: 0.5 }]
        : border(TOKEN.color.border),
      radius: TOKEN.radius.xl,
      layout: 'VERTICAL',
      gap: 12,
      paddingH: 32, paddingV: 36,
      primarySizing: 'AUTO', counterSizing: 'FIXED',
      crossAlign: 'MIN',
    });

    if (p.featured) {
      const fb = makeFrame({
        name: 'FeaturedBadge',
        layout: 'HORIZONTAL',
        paddingH: 16, paddingV: 6,
        radius: TOKEN.radius.pill,
        fills: gradientFill(TOKEN.color.accent, { r: 0.760, g: 0.094, b: 0.357, a: 1 }),
        primarySizing: 'AUTO', counterSizing: 'AUTO',
        crossAlign: 'CENTER',
      });
      fb.appendChild(await makeText({ text: 'もっとも人気', size: 11, font: TOKEN.font.bold }));
      card.appendChild(fb);
    }

    const nameT = await makeText({ text: p.name, size: 14, fills: solid(TOKEN.color.textMuted) });
    nameT.textAutoResize = 'WIDTH_AND_HEIGHT';
    const priceT = await makeText({ text: p.price, size: 36, font: TOKEN.font.black });
    priceT.textAutoResize = 'WIDTH_AND_HEIGHT';
    const periodT = await makeText({ text: p.period, size: 13, fills: solid(TOKEN.color.textMuted) });
    periodT.textAutoResize = 'WIDTH_AND_HEIGHT';

    card.appendChild(nameT);
    card.appendChild(priceT);
    card.appendChild(periodT);
    card.appendChild(makeFrame({ name: 'sp', h: 8, w: 1 }));

    for (const item of p.items) {
      const itemRow = makeFrame({ name: 'PlanItem', layout: 'HORIZONTAL', gap: 8, primarySizing: 'AUTO', counterSizing: 'AUTO', crossAlign: 'CENTER' });
      const chk = await makeText({ text: '✓', size: 13, font: TOKEN.font.bold, fills: solid(TOKEN.color.accentLight) });
      chk.textAutoResize = 'WIDTH_AND_HEIGHT';
      const iT = await makeText({ text: item, size: 13, fills: solid(TOKEN.color.textMuted) });
      iT.textAutoResize = 'WIDTH_AND_HEIGHT';
      itemRow.appendChild(chk);
      itemRow.appendChild(iT);
      card.appendChild(itemRow);
    }
    card.appendChild(makeFrame({ name: 'sp', h: 12, w: 1 }));

    const btn = makeFrame({
      name: p.featured ? 'BtnFeatured' : 'BtnNormal',
      layout: 'HORIZONTAL',
      paddingH: 24, paddingV: 14,
      radius: TOKEN.radius.md,
      fills: p.featured ? gradientFill(TOKEN.color.accent, { r: 0.760, g: 0.094, b: 0.357, a: 1 }) : [],
      strokes: p.featured ? [] : border(TOKEN.color.border),
      primarySizing: 'FIXED', counterSizing: 'AUTO',
      w: colW - 64,
      align: 'CENTER', crossAlign: 'CENTER',
    });
    btn.appendChild(await makeText({ text: p.featured ? '14日間無料で試す' : (p.name === 'フリー' ? '無料で始める' : 'お問い合わせ'), size: 14, font: TOKEN.font.bold }));
    card.appendChild(btn);
    planRow.appendChild(card);
  }
  section.appendChild(planRow);
  return section;
}

// --- CTA ---
async function buildCTA(pageW) {
  const section = makeFrame({
    name: 'CTA',
    w: pageW,
    fills: gradientFill(TOKEN.color.surface, TOKEN.color.bgSecondary),
    layout: 'VERTICAL',
    paddingH: 80, paddingV: 96,
    gap: 0,
    primarySizing: 'AUTO', counterSizing: 'FIXED',
    crossAlign: 'CENTER',
    align: 'MIN',
  });

  const t1 = await makeText({ text: '今すぐ、理想のパートナーと\n出会いましょう', size: 40, font: TOKEN.font.black, align: 'CENTER', lineH: 54, w: pageW - 160 });
  section.appendChild(t1);
  section.appendChild(makeFrame({ name: 'sp', h: 20, w: 1 }));
  const t2 = await makeText({ text: '登録は無料。5分でプロフィールを作成して、あなたに合った案件・人材を見つけてください。', size: 16, fills: solid(TOKEN.color.textMuted), align: 'CENTER', lineH: 28, w: 560 });
  section.appendChild(t2);
  section.appendChild(makeFrame({ name: 'sp', h: 40, w: 1 }));

  const btns = makeFrame({ name: 'CTAButtons', layout: 'HORIZONTAL', gap: 16, primarySizing: 'AUTO', counterSizing: 'AUTO' });
  const b1 = makeFrame({ name: 'BtnPrimary', layout: 'HORIZONTAL', paddingH: 36, paddingV: 18, radius: TOKEN.radius.md, fills: gradientFill(TOKEN.color.accent, { r: 0.760, g: 0.094, b: 0.357, a: 1 }), primarySizing: 'AUTO', counterSizing: 'AUTO' });
  b1.appendChild(await makeText({ text: 'クリエイターとして無料登録', size: 16, font: TOKEN.font.bold }));
  const b2 = makeFrame({ name: 'BtnSecondary', layout: 'HORIZONTAL', paddingH: 36, paddingV: 18, radius: TOKEN.radius.md, fills: [], strokes: border(TOKEN.color.border), primarySizing: 'AUTO', counterSizing: 'AUTO' });
  b2.appendChild(await makeText({ text: '企業として採用を始める', size: 16, font: TOKEN.font.semi }));
  btns.appendChild(b1);
  btns.appendChild(b2);
  section.appendChild(btns);
  return section;
}

// --- FOOTER ---
async function buildFooter(pageW) {
  const footer = makeFrame({
    name: 'Footer',
    w: pageW,
    fills: [{ type: 'SOLID', color: { r: 0.051, g: 0.051, b: 0.102 } }],
    strokes: border(TOKEN.color.border),
    layout: 'VERTICAL',
    paddingH: 80, paddingV: 48,
    gap: 0,
    primarySizing: 'AUTO', counterSizing: 'FIXED',
  });

  const row = makeFrame({ name: 'FooterTop', layout: 'HORIZONTAL', gap: 0, primarySizing: 'FIXED', counterSizing: 'AUTO', w: pageW - 160 });

  // Brand
  const brand = makeFrame({ name: 'FooterBrand', layout: 'VERTICAL', gap: 12, primarySizing: 'FIXED', counterSizing: 'AUTO', w: 280 });
  const logoRow = makeFrame({ name: 'Logo', layout: 'HORIZONTAL', gap: 0, primarySizing: 'AUTO', counterSizing: 'AUTO' });
  const fl1 = await makeText({ text: 'Creator', size: 20, font: TOKEN.font.black }); fl1.textAutoResize = 'WIDTH_AND_HEIGHT';
  const fl2 = await makeText({ text: 'Bridge', size: 20, font: TOKEN.font.black, fills: solid(TOKEN.color.accent) }); fl2.textAutoResize = 'WIDTH_AND_HEIGHT';
  logoRow.appendChild(fl1); logoRow.appendChild(fl2);
  brand.appendChild(logoRow);
  brand.appendChild(await makeText({ text: '経験豊富なクリエイターと企業をつなぐ、日本初のプロ特化型マッチングプラットフォーム。', size: 13, fills: solid(TOKEN.color.textMuted), lineH: 22, w: 260 }));

  // Columns
  const cols = [
    { title: 'サービス', links: ['クリエイター向け', '企業向け', '料金プラン', '成功事例'] },
    { title: '会社情報', links: ['会社概要', '採用情報', 'ブログ', 'お問い合わせ'] },
    { title: '法的情報', links: ['利用規約', 'プライバシーポリシー', '特定商取引法'] },
  ];

  const colsFrame = makeFrame({ name: 'FooterCols', layout: 'HORIZONTAL', gap: 64, primarySizing: 'AUTO', counterSizing: 'AUTO' });
  for (const col of cols) {
    const c = makeFrame({ name: `FooterCol-${col.title}`, layout: 'VERTICAL', gap: 10, primarySizing: 'AUTO', counterSizing: 'AUTO' });
    const h = await makeText({ text: col.title, size: 13, font: TOKEN.font.bold }); h.textAutoResize = 'WIDTH_AND_HEIGHT';
    c.appendChild(h);
    c.appendChild(makeFrame({ name: 'sp', h: 6, w: 1 }));
    for (const l of col.links) {
      const lt = await makeText({ text: l, size: 13, fills: solid(TOKEN.color.textMuted) }); lt.textAutoResize = 'WIDTH_AND_HEIGHT';
      c.appendChild(lt);
    }
    colsFrame.appendChild(c);
  }

  // Spacer between brand and cols
  const spacer = makeFrame({ name: 'spacer', w: 1, h: 1, primarySizing: 'FIXED', counterSizing: 'FIXED' });
  spacer.layoutGrow = 1;

  row.appendChild(brand);
  row.appendChild(spacer);
  row.appendChild(colsFrame);
  footer.appendChild(row);

  footer.appendChild(makeFrame({ name: 'sp', h: 40, w: 1 }));
  footer.appendChild(makeSeparator(pageW - 160));
  footer.appendChild(makeFrame({ name: 'sp', h: 24, w: 1 }));

  const bottomRow = makeFrame({ name: 'FooterBottom', layout: 'HORIZONTAL', gap: 0, primarySizing: 'FIXED', counterSizing: 'AUTO', w: pageW - 160 });
  const copy = await makeText({ text: '© 2024 CreatorBridge Inc. All rights reserved.', size: 12, fills: solid(TOKEN.color.textMuted) });
  copy.textAutoResize = 'WIDTH_AND_HEIGHT';
  const spacer2 = makeFrame({ name: 'spacer', w: 1, h: 1 }); spacer2.layoutGrow = 1;
  const place = await makeText({ text: '東京都渋谷区', size: 12, fills: solid(TOKEN.color.textMuted) });
  place.textAutoResize = 'WIDTH_AND_HEIGHT';
  bottomRow.appendChild(copy);
  bottomRow.appendChild(spacer2);
  bottomRow.appendChild(place);
  footer.appendChild(bottomRow);
  return footer;
}

// ===== MAIN =====
async function main() {
  await loadFonts();

  const PAGE_W = 1440;

  // Create page container frame
  const page = makeFrame({
    name: 'CreatorBridge – Service Page',
    w: PAGE_W, h: 100,
    fills: solid(TOKEN.color.bgPrimary),
    layout: 'VERTICAL',
    gap: 0,
    primarySizing: 'AUTO',
    counterSizing: 'FIXED',
    clip: true,
  });

  page.appendChild(await buildNav(PAGE_W));
  page.appendChild(await buildHero(PAGE_W));
  page.appendChild(await buildHowItWorks(PAGE_W));
  page.appendChild(await buildFeatures(PAGE_W));
  page.appendChild(await buildTarget(PAGE_W));
  page.appendChild(await buildPricing(PAGE_W));
  page.appendChild(await buildCTA(PAGE_W));
  page.appendChild(await buildFooter(PAGE_W));

  figma.currentPage.appendChild(page);
  figma.viewport.scrollAndZoomIntoView([page]);
  figma.closePlugin('✅ CreatorBridge サービスページの生成が完了しました！');
}

main().catch(err => {
  console.error(err);
  figma.closePlugin('❌ エラーが発生しました: ' + err.message);
});
