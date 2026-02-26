// Heurithm Website Redesign — opusr Design Tone
// Figma Plugin: Creates the full redesigned website layout
// =====================================================
// Design System: Based on opusr.jp (dark navy + gold accent)
// File: kawada_work (DxEEphhLtKrarfulbob5iL)
// Page: Page 1 (node-id 0:1)

// Handle messages from the UI (WebSocket bridge)
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'CREATE_HEURITHM_DESIGN' || msg.type === 'RUN_NOW') {
    await main();
  }
  if (msg.type === 'CLOSE') {
    figma.closePlugin();
  }
};

// Show UI with WebSocket bridge option, or run immediately
if (figma.command === 'run-now') {
  main();
} else {
  figma.showUI(__html__, { width: 360, height: 300 });
  // Auto-run after short delay if no WS connection needed
  setTimeout(() => main(), 500);
}

const C = {
  bgPrimary:    { r: 0.082, g: 0.098, b: 0.149 },  // #151926
  bgSecondary:  { r: 0.110, g: 0.137, b: 0.220 },  // #1c2338
  bgCard:       { r: 0.122, g: 0.157, b: 0.251 },  // #1f2840
  bgCardHover:  { r: 0.145, g: 0.188, b: 0.314 },  // #253050
  accent:       { r: 0.961, g: 0.710, b: 0.063 },  // #f5b510
  accentDark:   { r: 0.831, g: 0.604, b: 0.000 },  // #d49a00
  textPrimary:  { r: 1.000, g: 1.000, b: 1.000 },  // #ffffff
  textSecond:   { r: 0.533, g: 0.573, b: 0.643 },  // #8892a4
  textMuted:    { r: 0.353, g: 0.392, b: 0.463 },  // #5a6476
  border:       { r: 0.165, g: 0.204, b: 0.314 },  // #2a3450
  borderLight:  { r: 0.227, g: 0.275, b: 0.408 },  // #3a4668
  green:        { r: 0.282, g: 0.863, b: 0.510 },  // #48dc82
  purple:       { r: 0.486, g: 0.282, b: 0.863 },
  orange:       { r: 0.863, g: 0.486, b: 0.282 },
  blue:         { r: 0.282, g: 0.392, b: 0.863 },
};

const PAGE_W = 1440;
const PADDING = 80;

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
function rect(x, y, w, h, fill, r = 0) {
  const node = figma.createRectangle();
  node.x = x; node.y = y;
  node.resize(w, h);
  node.fills = [{ type: 'SOLID', color: fill }];
  if (r > 0) node.cornerRadius = r;
  return node;
}

function border(node, color, w = 1) {
  node.strokes = [{ type: 'SOLID', color }];
  node.strokeWeight = w;
  node.strokeAlign = 'INSIDE';
}

function frame(name, x, y, w, h, fill = null) {
  const f = figma.createFrame();
  f.name = name; f.x = x; f.y = y;
  f.resize(w, h);
  f.clipsContent = false;
  f.fills = fill ? [{ type: 'SOLID', color: fill }] : [];
  return f;
}

function autoFrame(name, dir = 'HORIZONTAL', gap = 0) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = dir;
  f.itemSpacing = gap;
  f.fills = [];
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  return f;
}

async function text(content, x, y, size, weight, color, family = 'Noto Sans JP') {
  try { await figma.loadFontAsync({ family, style: weight }); } catch (_) {
    await figma.loadFontAsync({ family: 'Inter', style: weight });
    family = 'Inter';
  }
  const t = figma.createText();
  t.x = x; t.y = y;
  t.fontName = { family, style: weight };
  t.fontSize = size;
  t.fills = [{ type: 'SOLID', color }];
  t.characters = content;
  return t;
}

function shadow(node, alpha = 0.4) {
  node.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: alpha },
    offset: { x: 0, y: 4 },
    radius: 24,
    visible: true,
    blendMode: 'NORMAL',
    spread: 0,
  }];
}

function pill(x, y, w, h, color, alpha = 0.1) {
  const bg = rect(x, y, w, h, color, 100);
  bg.opacity = alpha;
  return bg;
}

// ─────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────
async function buildNav(parent) {
  const nav = frame('🧭 Navigation', 0, 0, PAGE_W, 72, C.bgPrimary);
  shadow(nav, 0.25);

  // Bottom border
  const nb = rect(0, 71, PAGE_W, 1, C.border);
  nav.appendChild(nb);

  // Logo mark
  const lm = rect(PADDING, 18, 36, 36, C.accent, 8);
  nav.appendChild(lm);
  nav.appendChild(await text('H', PADDING + 11, 27, 16, 'Bold', C.bgPrimary, 'Inter'));
  nav.appendChild(await text('Heurithm', PADDING + 46, 26, 18, 'Bold', C.textPrimary, 'Inter'));

  // Nav links
  const links = ['サービス', '会社情報', 'opusr', 'ニュース'];
  let lx = 560;
  for (const l of links) {
    nav.appendChild(await text(l, lx, 28, 14, 'Medium', C.textSecond));
    lx += 110;
  }

  // CTA buttons
  const ghost = await text('お問い合わせ', PAGE_W - 310, 28, 14, 'Regular', C.textSecond);
  nav.appendChild(ghost);

  const ctaBg = rect(PAGE_W - 196, 18, 156, 36, C.accent, 6);
  nav.appendChild(ctaBg);
  nav.appendChild(await text('opusr を見る →', PAGE_W - 186, 27, 13, 'SemiBold', C.bgPrimary));

  parent.appendChild(nav);
  return 72;
}

// ─────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────
async function buildHero(parent, y) {
  const H = 860;
  const sec = frame('🦸 Hero', 0, y, PAGE_W, H, C.bgPrimary);

  // Background glow
  const glow = rect(PAGE_W * 0.4, 60, PAGE_W * 0.65, 560, C.accent, 0);
  glow.opacity = 0.04;
  sec.appendChild(glow);

  // Grid lines (4 vertical, 3 horizontal)
  for (let i = 0; i < 5; i++) {
    const g = rect(PADDING + i * 200, 0, 1, H, C.border);
    g.opacity = 0.2;
    sec.appendChild(g);
  }
  for (let i = 0; i < 4; i++) {
    const g = rect(0, 120 + i * 160, PAGE_W, 1, C.border);
    g.opacity = 0.15;
    sec.appendChild(g);
  }

  // ── Left Column ──
  // Badge
  const badgeBg = pill(PADDING, 96, 244, 30, C.accent, 0.1);
  border(badgeBg, { ...C.accent, a: 0.25 });
  sec.appendChild(badgeBg);
  const badgeDot = rect(PADDING + 10, 108, 8, 8, C.accent, 4);
  sec.appendChild(badgeDot);
  sec.appendChild(await text('クリエイターと企業をつなぐ', PADDING + 26, 102, 12, 'Medium', C.accent));

  // Title
  sec.appendChild(await text('テクノロジーの力で', PADDING, 148, 56, 'Black', C.textPrimary));
  sec.appendChild(await text('新しい選択肢を', PADDING, 214, 56, 'Black', C.accent));
  sec.appendChild(await text('創出する', PADDING, 280, 56, 'Black', C.textPrimary));

  // Subtitle
  const sub = await text(
    '株式会社Heurithm（ヒューリズム）は、クリエイターと企業の\nビジネスマッチングを通じて新たな可能性を届けます。',
    PADDING, 360, 16, 'Regular', C.textSecond
  );
  sub.lineHeight = { unit: 'PERCENT', value: 175 };
  sec.appendChild(sub);

  // Primary CTA
  const pb = rect(PADDING, 440, 216, 52, C.accent, 6);
  sec.appendChild(pb);
  sec.appendChild(await text('サービスを見る →', PADDING + 22, 455, 16, 'SemiBold', C.bgPrimary));

  // Secondary CTA
  const sb = rect(PADDING + 232, 440, 160, 52, C.textPrimary, 6);
  sb.fills = [];
  border(sb, C.borderLight);
  sec.appendChild(sb);
  sec.appendChild(await text('会社について', PADDING + 260, 455, 16, 'Medium', C.textPrimary));

  // Stats divider
  const div = rect(PADDING, 524, 520, 1, C.border);
  sec.appendChild(div);

  // Stats
  const stats = [
    { v: '2,400+', l: '登録クリエイター数', x: PADDING },
    { v: '840+',   l: '提携企業数',        x: PADDING + 180 },
    { v: '98%',    l: 'マッチング満足度',  x: PADDING + 340 },
  ];
  for (const s of stats) {
    const n = await text(s.v, s.x, 548, 32, 'Black', C.accent, 'Inter');
    sec.appendChild(n);
    const l = await text(s.l, s.x, 590, 12, 'Regular', C.textSecond);
    sec.appendChild(l);
  }

  // ── Right Column: Creator Card ──
  const CX = PAGE_W / 2 + 20;
  const CW = PAGE_W / 2 - 100;

  // Floating notification card
  const notifBg = rect(CX + CW - 60, 80, 220, 64, C.bgSecondary, 12);
  shadow(notifBg, 0.5);
  border(notifBg, C.border);
  sec.appendChild(notifBg);
  const notifIcon = rect(CX + CW - 44, 96, 32, 32, C.accent, 8);
  notifIcon.opacity = 0.15;
  sec.appendChild(notifIcon);
  sec.appendChild(await text('🎉', CX + CW - 38, 100, 18, 'Regular', C.accent));
  sec.appendChild(await text('新規オファーが届きました', CX + CW + 4, 90, 11, 'SemiBold', C.textPrimary));
  sec.appendChild(await text('動画制作 ¥350,000〜', CX + CW + 4, 108, 10, 'Regular', C.textSecond));

  // Main creator card
  const card = rect(CX, 156, CW, 440, C.bgCard, 20);
  shadow(card, 0.4);
  border(card, C.border);
  sec.appendChild(card);

  // Card header
  sec.appendChild(await text('アクティブなクリエイター', CX + 24, 180, 15, 'Bold', C.textPrimary));

  // Status badge
  const sbBg = pill(CX + CW - 116, 176, 92, 24, C.green, 0.12);
  border(sbBg, { ...C.green, a: 0.3 });
  sec.appendChild(sbBg);
  sec.appendChild(await text('● Live', CX + CW - 100, 182, 11, 'SemiBold', C.green, 'Inter'));

  // Creator rows
  const creators = [
    { name: '田中 健太',  role: '動画クリエイター',    color: C.blue },
    { name: '鈴木 美咲',  role: 'UIデザイナー',         color: C.orange },
    { name: '山本 拓也',  role: '3DCGアーティスト',     color: C.green },
    { name: '荒木 千尋',  role: 'グラフィックデザイナー', color: C.purple },
  ];

  for (let i = 0; i < creators.length; i++) {
    const ry = 218 + i * 80;
    const cr = creators[i];

    const rowBg = rect(CX + 16, ry, CW - 32, 64, C.textPrimary, 6);
    rowBg.opacity = 0.03;
    border(rowBg, C.border);
    sec.appendChild(rowBg);

    const av = rect(CX + 28, ry + 14, 36, 36, cr.color, 18);
    sec.appendChild(av);
    sec.appendChild(await text(cr.name[0], CX + 38, ry + 22, 16, 'Bold', C.textPrimary, 'Inter'));

    sec.appendChild(await text(cr.name, CX + 76, ry + 18, 13, 'Bold', C.textPrimary));
    sec.appendChild(await text(cr.role, CX + 76, ry + 38, 11, 'Regular', C.textSecond));

    const statusLabel = await text('オファー受付中', CX + CW - 130, ry + 26, 11, 'SemiBold', C.accent);
    sec.appendChild(statusLabel);
  }

  parent.appendChild(sec);
  return y + H;
}

// ─────────────────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────────────────
async function buildServices(parent, y) {
  const H = 900;
  const sec = frame('⚡ Services', 0, y, PAGE_W, H, C.bgPrimary);

  // Section header
  sec.appendChild(await text('Our Services', PADDING, PADDING, 12, 'SemiBold', C.accent, 'Inter'));
  const t1 = await text('クリエイターと企業の間にある\nギャップを埋める', PADDING, PADDING + 32, 40, 'Bold', C.textPrimary);
  t1.lineHeight = { unit: 'PERCENT', value: 140 };
  sec.appendChild(t1);
  const t2 = await text(
    'テクノロジーを活用し、クリエイターが作品に集中できる環境と、\n企業が最適な人材と出会える仕組みを提供します。',
    PADDING, PADDING + 172, 15, 'Regular', C.textSecond
  );
  t2.lineHeight = { unit: 'PERCENT', value: 175 };
  sec.appendChild(t2);

  // Service cards (3×2 grid)
  const services = [
    { icon: '🎯', title: 'スマートマッチング',           desc: 'AIアルゴリズムによりクリエイターのスキルと企業のニーズを高精度でマッチング。双方の時間を最大化します。' },
    { icon: '💬', title: 'シームレスなコミュニケーション', desc: 'プラットフォーム内のメッセージでオファーから契約まで一貫したやり取りが可能です。' },
    { icon: '⚙️', title: 'カスタム条件設定',             desc: '稼働時間・報酬レンジ・希望ジャンルを細かく設定。理想の案件だけを受け取れます。' },
    { icon: '🔍', title: '案件公開ボード',               desc: '企業が公開する案件一覧からクリエイター自身が応募できる双方向型の仕組み。' },
    { icon: '📊', title: '実績・ポートフォリオ管理',     desc: 'プロフェッショナルなポートフォリオを公開し実績を蓄積。高品質なオファーを引き寄せます。' },
    { icon: '🔒', title: '安心・安全な取引環境',         desc: '本人確認・企業審査・エスクロー決済で双方が安心して取引できる環境を整備。' },
  ];

  const COLS = 3;
  const GAP = 24;
  const CW = (PAGE_W - PADDING * 2 - GAP * (COLS - 1)) / COLS;
  const CH = 232;
  const GRID_TOP = 290;

  for (let i = 0; i < services.length; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const cx = PADDING + col * (CW + GAP);
    const cy = GRID_TOP + row * (CH + GAP);
    const s = services[i];

    const cardBg = rect(cx, cy, CW, CH, C.bgCard, 20);
    border(cardBg, C.border);
    sec.appendChild(cardBg);

    // Top accent bar (gold)
    const topBar = rect(cx, cy, CW, 3, C.accent, 2);
    topBar.opacity = 0.6;
    sec.appendChild(topBar);

    // Icon background
    const iconBg = rect(cx + 24, cy + 24, 48, 48, C.accent, 12);
    iconBg.opacity = 0.1;
    border(iconBg, { ...C.accent, a: 0.2 });
    sec.appendChild(iconBg);
    sec.appendChild(await text(s.icon, cx + 34, cy + 32, 22, 'Regular', C.accent));

    sec.appendChild(await text(s.title, cx + 24, cy + 88, 18, 'Bold', C.textPrimary));

    const desc = await text(s.desc, cx + 24, cy + 120, 13, 'Regular', C.textSecond);
    desc.lineHeight = { unit: 'PERCENT', value: 175 };
    desc.resize(CW - 48, 80);
    desc.textAutoResize = 'HEIGHT';
    sec.appendChild(desc);

    // "Learn more" link
    sec.appendChild(await text('詳しく見る →', cx + 24, cy + CH - 36, 12, 'SemiBold', C.accent));
  }

  parent.appendChild(sec);
  return y + H;
}

// ─────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────
async function buildAbout(parent, y) {
  const H = 720;
  const sec = frame('🏢 About', 0, y, PAGE_W, H, C.bgPrimary);

  const halfW = PAGE_W / 2 - PADDING;

  // ── Left Column ──
  sec.appendChild(await text('About Us', PADDING, PADDING, 12, 'SemiBold', C.accent, 'Inter'));
  const t = await text('テクノロジーの力で\n新しい選択肢を創出する', PADDING, PADDING + 30, 40, 'Bold', C.textPrimary);
  t.lineHeight = { unit: 'PERCENT', value: 140 };
  sec.appendChild(t);

  const d = await text(
    '私たち株式会社Heurithm（ヒューリズム）は、クリエイターと\nビジネスの間に存在する課題をテクノロジーで解決します。',
    PADDING, PADDING + 180, 15, 'Regular', C.textSecond
  );
  d.lineHeight = { unit: 'PERCENT', value: 180 };
  sec.appendChild(d);

  const points = [
    { n: '01', text: 'クリエイター視点でのサービス設計\n現役クリエイターの声を反映した使いやすい設計。' },
    { n: '02', text: '透明性の高いマッチングプロセス\nクリエイターが自分のキャリアをコントロール可能。' },
    { n: '03', text: '継続的なプロダクト改善\nユーザーフィードバックを基に常にアップデート。' },
  ];

  for (let i = 0; i < points.length; i++) {
    const py = PADDING + 270 + i * 100;
    const dotBg = rect(PADDING, py, 24, 24, C.accent, 12);
    dotBg.opacity = 0.12;
    border(dotBg, C.accent);
    sec.appendChild(dotBg);
    sec.appendChild(await text(points[i].n, PADDING + 5, py + 5, 10, 'Bold', C.accent, 'Inter'));

    const pt = await text(points[i].text, PADDING + 36, py, 14, 'Regular', C.textSecond);
    pt.lineHeight = { unit: 'PERCENT', value: 170 };
    sec.appendChild(pt);
  }

  // ── Right Column: Metric Cards ──
  const metrics = [
    { label: '登録クリエイター数',    value: '2,400+',  pct: 80 },
    { label: '月間マッチング成立数',  value: '340件/月', pct: 65 },
    { label: '平均案件単価',          value: '¥280K',   pct: 55 },
    { label: 'ユーザー満足度',        value: '98%',     pct: 98 },
  ];

  const MX = PAGE_W / 2 + 40;
  const MW = PAGE_W / 2 - 120;

  for (let i = 0; i < metrics.length; i++) {
    const my = PADDING + i * 152;
    const m = metrics[i];

    const cardBg = rect(MX, my, MW, 132, C.bgCard, 12);
    border(cardBg, C.border);
    sec.appendChild(cardBg);

    sec.appendChild(await text(m.label, MX + 24, my + 20, 13, 'Regular', C.textSecond));
    sec.appendChild(await text(m.value, MX + 24, my + 48, 32, 'Black', C.accent, 'Inter'));

    const barBg = rect(MX + 24, my + 100, MW - 48, 4, C.border, 2);
    sec.appendChild(barBg);
    const barFill = rect(MX + 24, my + 100, (MW - 48) * m.pct / 100, 4, C.accent, 2);
    sec.appendChild(barFill);
  }

  parent.appendChild(sec);
  return y + H;
}

// ─────────────────────────────────────────────────────────
// OPUSR SHOWCASE
// ─────────────────────────────────────────────────────────
async function buildOpusr(parent, y) {
  const H = 620;
  const sec = frame('✨ opusr Showcase', 0, y, PAGE_W, H, C.bgPrimary);

  // Inner card
  const inner = rect(PADDING, 40, PAGE_W - PADDING * 2, H - 80, C.bgCard, 20);
  border(inner, C.border);
  sec.appendChild(inner);

  // Background glow
  const glow = rect(PAGE_W * 0.7, H / 2 - 100, 300, 300, C.accent, 0);
  glow.opacity = 0.04;
  sec.appendChild(glow);

  // ── Left Content ──
  const CL = PADDING + 32;

  // Tag
  const tagBg = pill(CL, 72, 128, 26, C.accent, 0.12);
  border(tagBg, { ...C.accent, a: 0.3 });
  sec.appendChild(tagBg);
  sec.appendChild(await text('Flagship Service', CL + 8, 78, 12, 'SemiBold', C.accent, 'Inter'));

  // Title
  const t1 = await text('あなたの作品に\n理想のオファーが届く', CL, 116, 36, 'Bold', C.textPrimary);
  t1.lineHeight = { unit: 'PERCENT', value: 140 };
  sec.appendChild(t1);
  sec.appendChild(await text('opusr', CL, 230, 48, 'Black', C.accent, 'Inter'));

  // Description
  const opDesc = await text(
    '作品を登録したらオファーを待つだけ。クリエイター視点\nで設計されたビジネスマッチングサービス。デザイナー、\n動画クリエイター、3DCGアーティストなど対応。',
    CL, 292, 14, 'Regular', C.textSecond
  );
  opDesc.lineHeight = { unit: 'PERCENT', value: 175 };
  sec.appendChild(opDesc);

  // Feature list
  const features = [
    '作品登録後、企業から直接オファーが届く',
    'プラットフォーム内でスムーズにメッセージやり取り',
    '稼働条件・希望単価を自分でカスタム設定',
    '動画・UI/UX・3DCG など20以上のカテゴリ対応',
  ];

  for (let i = 0; i < features.length; i++) {
    const fy = 405 + i * 32;
    const checkBg = rect(CL, fy, 18, 18, C.accent, 9);
    checkBg.opacity = 0.15;
    border(checkBg, C.accent);
    sec.appendChild(checkBg);
    sec.appendChild(await text(features[i], CL + 28, fy, 13, 'Regular', C.textSecond));
  }

  // CTA
  const ctaBg = rect(CL, 544, 228, 50, C.accent, 6);
  sec.appendChild(ctaBg);
  sec.appendChild(await text('opusr を使ってみる →', CL + 16, 558, 14, 'SemiBold', C.bgPrimary));

  const sbBg = rect(CL + 244, 544, 148, 50, C.textPrimary, 6);
  sbBg.fills = [];
  border(sbBg, C.borderLight);
  sec.appendChild(sbBg);
  sec.appendChild(await text('詳細を見る', CL + 270, 558, 14, 'Medium', C.textPrimary));

  // ── Right: App Mockup ──
  const MX = PAGE_W / 2 + 40;
  const MW = PAGE_W / 2 - 120;

  const mockBg = rect(MX, 64, MW, H - 128, C.bgSecondary, 12);
  border(mockBg, C.border);
  sec.appendChild(mockBg);

  // Window dots
  const dotColors = [
    { r: 1, g: 0.373, b: 0.337 },
    { r: 1, g: 0.741, b: 0.180 },
    { r: 0.153, g: 0.788, b: 0.247 },
  ];
  dotColors.forEach((c, i) => {
    sec.appendChild(rect(MX + 20 + i * 20, 88, 10, 10, c, 5));
  });

  // Filter tabs
  const tabs = ['すべて', '動画制作', 'UI/UX', '3DCG'];
  let tx = MX + 16;
  for (const tab of tabs) {
    const isActive = tab === 'すべて';
    const tabBg = rect(tx, 116, 76, 24, isActive ? C.accent : C.textPrimary, 100);
    tabBg.opacity = isActive ? 0.12 : 0.04;
    if (!isActive) border(tabBg, C.border);
    sec.appendChild(tabBg);
    sec.appendChild(await text(tab, tx + 8, 122, 11, 'Medium', isActive ? C.accent : C.textSecond));
    tx += 84;
  }

  // Creator cards grid (2×2)
  const gcols = 2;
  const gcw = (MW - 40) / gcols - 8;
  const gch = 148;
  const gradColors = [C.blue, C.orange, C.green, C.purple];
  const miniNames = ['田中 健太', '鈴木 美咲', '山本 拓也', '荒木 千尋'];

  for (let i = 0; i < 4; i++) {
    const gc = i % gcols;
    const gr = Math.floor(i / gcols);
    const gcx = MX + 16 + gc * (gcw + 8);
    const gcy = 156 + gr * (gch + 8);

    const miniCard = rect(gcx, gcy, gcw, gch, C.textPrimary, 6);
    miniCard.opacity = 0.04;
    border(miniCard, C.border);
    sec.appendChild(miniCard);

    const imgPlaceholder = rect(gcx + 8, gcy + 8, gcw - 16, 88, gradColors[i], 4);
    imgPlaceholder.opacity = 0.7;
    sec.appendChild(imgPlaceholder);

    sec.appendChild(await text(miniNames[i], gcx + 8, gcy + 104, 11, 'Bold', C.textPrimary));
  }

  parent.appendChild(sec);
  return y + H;
}

// ─────────────────────────────────────────────────────────
// NEWS
// ─────────────────────────────────────────────────────────
async function buildNews(parent, y) {
  const H = 560;
  const sec = frame('📰 News', 0, y, PAGE_W, H, C.bgPrimary);

  // Header
  sec.appendChild(await text('News', PADDING, PADDING, 12, 'SemiBold', C.accent, 'Inter'));
  sec.appendChild(await text('最新情報', PADDING, PADDING + 30, 40, 'Bold', C.textPrimary));

  const allBtn = rect(PAGE_W - PADDING - 168, PADDING + 36, 168, 40, C.textPrimary, 6);
  allBtn.fills = [];
  border(allBtn, C.borderLight);
  sec.appendChild(allBtn);
  sec.appendChild(await text('すべてのニュース →', PAGE_W - PADDING - 152, PADDING + 50, 13, 'Medium', C.textPrimary));

  // News cards
  const newsItems = [
    { date: '2025.01.15', tag: 'プレスリリース', title: 'opusr、クリエイター登録数\n2,000名突破のお知らせ' },
    { date: '2024.12.08', tag: 'アップデート',   title: '新機能「案件公開ボード」の\nリリースについて' },
    { date: '2024.11.20', tag: 'お知らせ',       title: 'シリーズA資金調達\n完了のご報告' },
  ];

  const ncols = 3;
  const ncw = (PAGE_W - PADDING * 2 - 24 * (ncols - 1)) / ncols;
  const CARD_TOP = 170;

  for (let i = 0; i < newsItems.length; i++) {
    const n = newsItems[i];
    const nx = PADDING + i * (ncw + 24);

    const cardBg = rect(nx, CARD_TOP, ncw, 340, C.bgCard, 20);
    border(cardBg, C.border);
    sec.appendChild(cardBg);

    // Thumbnail
    const thumb = rect(nx, CARD_TOP, ncw, 176, C.bgCardHover, 0);
    sec.appendChild(thumb);
    // Round top corners only (approximation)
    const thumbOverlay = await text('NEWS', nx + ncw / 2 - 48, CARD_TOP + 60, 40, 'Black', C.accent, 'Inter');
    thumbOverlay.opacity = 0.1;
    sec.appendChild(thumbOverlay);

    // Separator line
    const sep = rect(nx, CARD_TOP + 176, ncw, 1, C.border);
    sec.appendChild(sep);

    // Meta
    sec.appendChild(await text(n.date, nx + 20, CARD_TOP + 192, 11, 'Regular', C.textMuted, 'Inter'));

    const tagBg = pill(nx + 104, CARD_TOP + 188, 80, 22, C.accent, 0.1);
    border(tagBg, { ...C.accent, a: 0.3 });
    sec.appendChild(tagBg);
    sec.appendChild(await text(n.tag, nx + 112, CARD_TOP + 193, 10, 'Medium', C.accent));

    // Title
    const nt = await text(n.title, nx + 20, CARD_TOP + 228, 15, 'Bold', C.textPrimary);
    nt.lineHeight = { unit: 'PERCENT', value: 155 };
    sec.appendChild(nt);
  }

  parent.appendChild(sec);
  return y + H;
}

// ─────────────────────────────────────────────────────────
// CTA SECTION
// ─────────────────────────────────────────────────────────
async function buildCTA(parent, y) {
  const H = 480;
  const sec = frame('🚀 CTA', 0, y, PAGE_W, H, C.bgPrimary);

  const inner = rect(PADDING, 40, PAGE_W - PADDING * 2, H - 80, C.bgCard, 20);
  border(inner, C.border);
  sec.appendChild(inner);

  // Glow
  const glow = rect(PAGE_W / 2 - 200, H / 2 - 80, 400, 200, C.accent, 0);
  glow.opacity = 0.05;
  sec.appendChild(glow);

  // Content (centered)
  const cx = PAGE_W / 2;

  sec.appendChild(await text('Get Started', cx - 52, 80, 12, 'SemiBold', C.accent, 'Inter'));

  const t1 = await text('あなたのクリエイティブを', cx - 204, 112, 40, 'Bold', C.textPrimary);
  sec.appendChild(t1);
  const t2 = await text('ビジネスに変える一歩を', cx - 184, 162, 40, 'Bold', C.accent);
  sec.appendChild(t2);

  const desc = await text(
    '登録無料。作品を公開するだけで、あなたの理想の案件が向こうからやってきます。',
    cx - 300, 228, 15, 'Regular', C.textSecond
  );
  sec.appendChild(desc);

  // Buttons
  const pb = rect(cx - 228, 292, 264, 52, C.accent, 6);
  sec.appendChild(pb);
  sec.appendChild(await text('無料でクリエイター登録 →', cx - 208, 307, 15, 'SemiBold', C.bgPrimary));

  const sb = rect(cx + 52, 292, 168, 52, C.textPrimary, 6);
  sb.fills = [];
  border(sb, C.borderLight);
  sec.appendChild(sb);
  sec.appendChild(await text('企業様はこちら', cx + 76, 307, 15, 'Medium', C.textPrimary));

  parent.appendChild(sec);
  return y + H;
}

// ─────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────
async function buildFooter(parent, y) {
  const H = 400;
  const sec = frame('🦶 Footer', 0, y, PAGE_W, H, C.bgSecondary);

  // Top border
  sec.appendChild(rect(0, 0, PAGE_W, 1, C.border));

  // Logo
  const lm = rect(PADDING, 56, 36, 36, C.accent, 8);
  sec.appendChild(lm);
  sec.appendChild(await text('H', PADDING + 11, 65, 16, 'Bold', C.bgPrimary, 'Inter'));
  sec.appendChild(await text('Heurithm', PADDING + 46, 64, 18, 'Bold', C.textPrimary, 'Inter'));

  const brand = await text(
    'テクノロジーの力で新しい選択肢を創出する。\nクリエイターと企業をつなぐビジネスマッチング\nサービス「opusr」を運営しています。',
    PADDING, 112, 13, 'Regular', C.textSecond
  );
  brand.lineHeight = { unit: 'PERCENT', value: 175 };
  sec.appendChild(brand);

  // Link columns
  const cols = [
    { title: 'Services', links: ['opusr', 'クリエイター登録', '企業向けサービス', '料金プラン'],      x: PAGE_W - 640 },
    { title: 'Company',  links: ['会社概要', 'ミッション', '採用情報', 'ニュース'],                    x: PAGE_W - 440 },
    { title: 'Support',  links: ['ヘルプセンター', 'お問い合わせ', '利用規約', 'プライバシーポリシー'], x: PAGE_W - 240 },
  ];

  for (const col of cols) {
    sec.appendChild(await text(col.title, col.x, 56, 11, 'Bold', C.textMuted, 'Inter'));
    for (let i = 0; i < col.links.length; i++) {
      sec.appendChild(await text(col.links[i], col.x, 90 + i * 32, 13, 'Regular', C.textSecond));
    }
  }

  // Bottom divider + copyright
  sec.appendChild(rect(PADDING, H - 60, PAGE_W - PADDING * 2, 1, C.border));
  sec.appendChild(await text('© 2025 Heurithm Inc. All rights reserved.', PADDING, H - 36, 12, 'Regular', C.textMuted, 'Inter'));

  const bottomLinks = ['利用規約', 'プライバシーポリシー', '特定商取引法'];
  let blx = PAGE_W - PADDING;
  for (const l of bottomLinks.reverse()) {
    const bt = await text(l, blx - 100, H - 36, 12, 'Regular', C.textMuted);
    sec.appendChild(bt);
    blx -= 120;
  }

  parent.appendChild(sec);
  return y + H;
}

// ─────────────────────────────────────────────────────────
// DIVIDER
// ─────────────────────────────────────────────────────────
function addDivider(parent, y) {
  const d = rect(0, y, PAGE_W, 1, C.border);
  parent.appendChild(d);
  return y + 1;
}

// ─────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────
async function main() {
  // Remove any existing Heurithm design frames
  figma.currentPage.children
    .filter(n => n.name.includes('Heurithm'))
    .forEach(n => n.remove());

  figma.currentPage.name = 'Heurithm Redesign';

  // Create main artboard
  const artboard = frame('Heurithm — Website Design (1440px)', 0, 0, PAGE_W, 100, C.bgPrimary);
  artboard.clipsContent = false;
  figma.currentPage.appendChild(artboard);

  let y = 0;

  figma.notify('Heurithm デザインを生成中... ⏳', { timeout: 15000 });

  y += await buildNav(artboard);
  y = await buildHero(artboard, y);
  y = addDivider(artboard, y);
  y = await buildServices(artboard, y);
  y = addDivider(artboard, y);
  y = await buildAbout(artboard, y);
  y = addDivider(artboard, y);
  y = await buildOpusr(artboard, y);
  y = addDivider(artboard, y);
  y = await buildNews(artboard, y);
  y = addDivider(artboard, y);
  y = await buildCTA(artboard, y);
  y = await buildFooter(artboard, y);

  artboard.resize(PAGE_W, y);
  figma.viewport.scrollAndZoomIntoView([artboard]);
  figma.notify('✅ Heurithm デザイン完成！', { timeout: 5000 });
  figma.closePlugin();
}

// Note: main() is called by showUI/auto-run logic defined at the top
