/**
 * Figma Plugin: Heurithm Website Redesign
 * ========================================
 * このプラグインをFigmaで実行することで、opusr.jpのデザイントンマナを
 * 適用したHeurithm Webサイトのデザインを自動生成します。
 *
 * 実行方法:
 * 1. Figmaを開く
 * 2. Plugins > Development > New Plugin を選択
 * 3. このスクリプトをコード部分に貼り付けてRunを実行
 */

// =====================
// Design Tokens
// =====================
const TOKENS = {
  colors: {
    bgPrimary:    { r: 21/255,  g: 25/255,  b: 38/255,  a: 1 },  // #151926
    bgSecondary:  { r: 28/255,  g: 35/255,  b: 56/255,  a: 1 },  // #1c2338
    bgCard:       { r: 31/255,  g: 40/255,  b: 64/255,  a: 1 },  // #1f2840
    bgCardHover:  { r: 37/255,  g: 48/255,  b: 80/255,  a: 1 },  // #253050
    accent:       { r: 245/255, g: 181/255, b: 16/255,  a: 1 },  // #f5b510
    accentLight:  { r: 255/255, g: 201/255, b: 60/255,  a: 1 },  // #ffc93c
    textPrimary:  { r: 1,       g: 1,       b: 1,       a: 1 },  // #ffffff
    textSecondary:{ r: 136/255, g: 146/255, b: 164/255, a: 1 },  // #8892a4
    textMuted:    { r: 90/255,  g: 100/255, b: 118/255, a: 1 },  // #5a6476
    border:       { r: 42/255,  g: 52/255,  b: 80/255,  a: 1 },  // #2a3450
    borderLight:  { r: 58/255,  g: 70/255,  b: 104/255, a: 1 },  // #3a4668
  },
  typography: {
    fontJP: 'Noto Sans JP',
    fontEN: 'Montserrat',
  },
  spacing: {
    xs: 8,   sm: 16,  md: 24,  lg: 40,
    xl: 64,  xxl: 96, xxxl: 120,
  },
  radius: {
    sm: 6, md: 12, lg: 20,
  },
};

// =====================
// Helper: Create Rectangle
// =====================
function createRect(x, y, w, h, fillColor, cornerRadius = 0) {
  const rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(w, h);
  rect.fills = [{ type: 'SOLID', color: fillColor }];
  if (cornerRadius > 0) rect.cornerRadius = cornerRadius;
  return rect;
}

// =====================
// Helper: Create Text Node
// =====================
async function createText(content, x, y, size, weight, color, fontFamily = 'Noto Sans JP') {
  await figma.loadFontAsync({ family: fontFamily, style: weight });
  const text = figma.createText();
  text.x = x;
  text.y = y;
  text.fontName = { family: fontFamily, style: weight };
  text.fontSize = size;
  text.fills = [{ type: 'SOLID', color: color }];
  text.characters = content;
  return text;
}

// =====================
// Helper: Create Frame
// =====================
function createFrame(name, x, y, w, h, fillColor = null) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.x = x;
  frame.y = y;
  frame.resize(w, h);
  if (fillColor) {
    frame.fills = [{ type: 'SOLID', color: fillColor }];
  } else {
    frame.fills = [];
  }
  frame.clipsContent = true;
  return frame;
}

// =====================
// Helper: Add Stroke Border
// =====================
function addBorder(node, color, weight = 1) {
  node.strokes = [{ type: 'SOLID', color: color }];
  node.strokeWeight = weight;
  node.strokeAlign = 'INSIDE';
}

// =====================
// Helper: Create Auto Layout Frame
// =====================
function createAutoFrame(name, direction = 'HORIZONTAL', gap = 16) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = direction;
  frame.itemSpacing = gap;
  frame.fills = [];
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  return frame;
}

// =====================
// Component: Navigation Bar
// =====================
async function buildNavigation(parent, pageWidth) {
  const nav = createFrame('Navigation', 0, 0, pageWidth, 72, TOKENS.colors.bgPrimary);
  nav.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.3 },
    offset: { x: 0, y: 1 },
    radius: 0,
    visible: true,
    blendMode: 'NORMAL',
    spread: 0,
  }];

  // Logo mark (gold square)
  const logoMark = createRect(40, 18, 36, 36, TOKENS.colors.accent, 8);
  nav.appendChild(logoMark);

  // Logo text
  const logoText = await createText('Heurithm', 84, 26, 18, 'Bold', TOKENS.colors.textPrimary, 'Montserrat');
  nav.appendChild(logoText);

  // Nav links
  const navItems = ['サービス', '会社情報', 'opusr', 'ニュース'];
  let linkX = 640;
  for (const item of navItems) {
    const link = await createText(item, linkX, 28, 14, 'Medium', TOKENS.colors.textSecondary);
    nav.appendChild(link);
    linkX += 100;
  }

  // CTA Button (gold)
  const ctaBg = createRect(pageWidth - 180, 18, 140, 36, TOKENS.colors.accent, 6);
  nav.appendChild(ctaBg);
  const ctaText = await createText('opusr を見る', pageWidth - 164, 27, 14, 'SemiBold', TOKENS.colors.bgPrimary);
  nav.appendChild(ctaText);

  parent.appendChild(nav);
  return nav;
}

// =====================
// Component: Hero Section
// =====================
async function buildHero(parent, pageWidth, yOffset) {
  const heroHeight = 900;
  const hero = createFrame('Hero Section', 0, yOffset, pageWidth, heroHeight, TOKENS.colors.bgPrimary);

  // Background gradient effect (simulated with rect + opacity)
  const gradientBg = createRect(pageWidth * 0.3, 100, pageWidth * 0.7, 500, TOKENS.colors.accent, 0);
  gradientBg.opacity = 0.04;
  hero.appendChild(gradientBg);

  // Grid overlay (decorative lines - simplified)
  const gridRect = createRect(0, 0, pageWidth, heroHeight, { r: 42/255, g: 52/255, b: 80/255 }, 0);
  gridRect.opacity = 0.15;
  hero.appendChild(gridRect);

  // === Left Content ===

  // Badge
  const badgeBg = createRect(80, 120, 220, 30, TOKENS.colors.accent, 100);
  badgeBg.opacity = 0.1;
  hero.appendChild(badgeBg);
  const badgeText = await createText('クリエイターと企業をつなぐ', 96, 127, 12, 'Medium', TOKENS.colors.accent);
  hero.appendChild(badgeText);

  // Main Title
  const title1 = await createText('テクノロジーの力で', 80, 172, 52, 'Black', TOKENS.colors.textPrimary);
  hero.appendChild(title1);

  const title2 = await createText('新しい選択肢を', 80, 234, 52, 'Black', TOKENS.colors.accent);
  hero.appendChild(title2);

  const title3 = await createText('創出する', 80, 296, 52, 'Black', TOKENS.colors.textPrimary);
  hero.appendChild(title3);

  // Subtitle
  const subtitle = await createText(
    '株式会社Heurithm（ヒューリズム）は、クリエイターと企業のビジネス\nマッチングを通じて、制作の現場に新たな可能性を届けます。',
    80, 378, 16, 'Regular', TOKENS.colors.textSecondary
  );
  subtitle.lineHeight = { value: 180, unit: 'PERCENT' };
  hero.appendChild(subtitle);

  // CTA Buttons
  // Primary button (gold)
  const primaryBtn = createRect(80, 460, 200, 52, TOKENS.colors.accent, 6);
  hero.appendChild(primaryBtn);
  const primaryBtnText = await createText('サービスを見る →', 104, 475, 16, 'SemiBold', TOKENS.colors.bgPrimary);
  hero.appendChild(primaryBtnText);

  // Secondary button (outline)
  const secondaryBtn = createRect(296, 460, 160, 52, { r: 0, g: 0, b: 0 }, 6);
  secondaryBtn.fills = [];
  addBorder(secondaryBtn, TOKENS.colors.borderLight);
  hero.appendChild(secondaryBtn);
  const secondaryBtnText = await createText('会社について', 320, 475, 16, 'Medium', TOKENS.colors.textPrimary);
  hero.appendChild(secondaryBtnText);

  // Divider line
  const divider = createRect(80, 544, 480, 1, TOKENS.colors.border);
  hero.appendChild(divider);

  // Stats
  const stats = [
    { value: '2,400+', label: '登録クリエイター数', x: 80 },
    { value: '840+', label: '提携企業数', x: 260 },
    { value: '98%', label: 'マッチング満足度', x: 420 },
  ];
  for (const stat of stats) {
    const num = await createText(stat.value, stat.x, 568, 32, 'Black', TOKENS.colors.accent, 'Montserrat');
    hero.appendChild(num);
    const lbl = await createText(stat.label, stat.x, 608, 12, 'Regular', TOKENS.colors.textSecondary);
    hero.appendChild(lbl);
  }

  // === Right: Card Mockup ===
  const cardX = pageWidth / 2 + 40;
  const cardW = pageWidth / 2 - 120;
  const cardY = 100;

  // Main card background
  const card = createRect(cardX, cardY, cardW, 420, TOKENS.colors.bgCard, 20);
  addBorder(card, TOKENS.colors.border);
  hero.appendChild(card);

  // Card header
  const cardTitle = await createText('アクティブなクリエイター', cardX + 24, cardY + 24, 15, 'Bold', TOKENS.colors.textPrimary);
  hero.appendChild(cardTitle);

  // Status badge
  const statusBadge = createRect(cardX + cardW - 120, cardY + 20, 96, 26, { r: 72/255, g: 220/255, b: 130/255 }, 100);
  statusBadge.opacity = 0.15;
  hero.appendChild(statusBadge);
  const statusText = await createText('● Live', cardX + cardW - 104, cardY + 26, 11, 'SemiBold', { r: 72/255, g: 220/255, b: 130/255 });
  hero.appendChild(statusText);

  // Creator items
  const creators = [
    { name: '田中 健太', type: '動画クリエイター', avatarColor: { r: 72/255, g: 100/255, b: 220/255 } },
    { name: '鈴木 美咲', type: 'UIデザイナー',     avatarColor: { r: 220/255, g: 124/255, b: 72/255 } },
    { name: '山本 拓也', type: '3DCGアーティスト', avatarColor: { r: 72/255, g: 220/255, b: 130/255 } },
    { name: '荒木 千尋', type: 'グラフィックデザイナー', avatarColor: { r: 124/255, g: 72/255, b: 220/255 } },
  ];

  creators.forEach((creator, i) => {
    const itemY = cardY + 68 + i * 76;

    // Row background
    const rowBg = createRect(cardX + 16, itemY, cardW - 32, 64, { r: 1, g: 1, b: 1 }, 6);
    rowBg.opacity = 0.03;
    addBorder(rowBg, TOKENS.colors.border);
    hero.appendChild(rowBg);

    // Avatar
    const avatar = createRect(cardX + 28, itemY + 14, 36, 36, creator.avatarColor, 18);
    hero.appendChild(avatar);

    // Creator info (async - handled sequentially in main)
    hero._creatorData = hero._creatorData || [];
    hero._creatorData.push({ creator, cardX, itemY });
  });

  // Notification floating card
  const notifX = cardX + cardW - 40;
  const notifBg = createRect(notifX, cardY - 24, 220, 68, TOKENS.colors.bgSecondary, 12);
  addBorder(notifBg, TOKENS.colors.border);
  hero.appendChild(notifBg);

  parent.appendChild(hero);

  // Now add creator text (must be sequential for font loading)
  for (const item of (hero._creatorData || [])) {
    const { creator, cardX, itemY } = item;
    const nameText = await createText(creator.name, cardX + 76, itemY + 16, 13, 'Bold', TOKENS.colors.textPrimary);
    hero.appendChild(nameText);
    const typeText = await createText(creator.type, cardX + 76, itemY + 36, 11, 'Regular', TOKENS.colors.textSecondary);
    hero.appendChild(typeText);
    const statusLabel = await createText('オファー受付中', cardX + (hero.width / 2) - 30, itemY + 24, 11, 'SemiBold', TOKENS.colors.accent);
    hero.appendChild(statusLabel);
  }

  // Notification content
  const notifTitle = await createText('新規オファーが届きました', notifX + 12, cardY - 16, 12, 'Bold', TOKENS.colors.textPrimary);
  hero.appendChild(notifTitle);
  const notifSub = await createText('動画制作 ¥350,000〜', notifX + 12, cardY, 11, 'Regular', TOKENS.colors.textSecondary);
  hero.appendChild(notifSub);

  return hero;
}

// =====================
// Component: Services Section
// =====================
async function buildServices(parent, pageWidth, yOffset) {
  const sectionH = 900;
  const section = createFrame('Services Section', 0, yOffset, pageWidth, sectionH, TOKENS.colors.bgPrimary);

  // Section Label
  const label = await createText('Our Services', 80, 80, 12, 'SemiBold', TOKENS.colors.accent, 'Montserrat');
  section.appendChild(label);

  // Section Title
  const title = await createText('クリエイターと企業の\n間にあるギャップを埋める', 80, 112, 40, 'Bold', TOKENS.colors.textPrimary);
  title.lineHeight = { value: 140, unit: 'PERCENT' };
  section.appendChild(title);

  // Service Cards Grid (3 columns × 2 rows)
  const services = [
    { icon: '🎯', title: 'スマートマッチング',         desc: 'AIを活用したマッチングアルゴリズムにより、クリエイターのスキルと企業のニーズを精度高く結びつけます。' },
    { icon: '💬', title: 'シームレスなコミュニケーション', desc: 'プラットフォーム内のメッセージ機能で、オファーから契約まで一貫したコミュニケーションが可能です。' },
    { icon: '⚙️', title: 'カスタム条件設定',           desc: '稼働時間・報酬レンジ・希望ジャンルなど、クリエイター自身が仕事条件を細かく設定可能です。' },
    { icon: '🔍', title: '案件公開ボード',             desc: '企業が公開する案件一覧からクリエイター自身が応募する双方向型の仕組みも完備しています。' },
    { icon: '📊', title: '実績・ポートフォリオ管理',   desc: 'クリエイターの作品をプロフェッショナルなポートフォリオとして公開し、実績を蓄積します。' },
    { icon: '🔒', title: '安心・安全な取引環境',       desc: '本人確認・企業審査・エスクロー決済により、双方が安心して取引できる環境を整備しています。' },
  ];

  const cardW = (pageWidth - 80 * 2 - 24 * 2) / 3;
  const cardH = 240;

  for (let i = 0; i < services.length; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = 80 + col * (cardW + 24);
    const cy = 260 + row * (cardH + 24);

    const card = createRect(cx, cy, cardW, cardH, TOKENS.colors.bgCard, 20);
    addBorder(card, TOKENS.colors.border);
    section.appendChild(card);

    // Accent top bar
    const topBar = createRect(cx, cy, cardW, 3, TOKENS.colors.accent, 0);
    topBar.opacity = 0;  // Hidden by default, visible on hover
    section.appendChild(topBar);

    // Icon background
    const iconBg = createRect(cx + 24, cy + 28, 52, 52, TOKENS.colors.accent, 12);
    iconBg.opacity = 0.1;
    section.appendChild(iconBg);

    // Service title
    const cardTitle = await createText(services[i].title, cx + 24, cy + 96, 18, 'Bold', TOKENS.colors.textPrimary);
    section.appendChild(cardTitle);

    // Service description
    const cardDesc = await createText(services[i].desc, cx + 24, cy + 128, 13, 'Regular', TOKENS.colors.textSecondary);
    cardDesc.resize(cardW - 48, 80);
    cardDesc.textAutoResize = 'HEIGHT';
    cardDesc.lineHeight = { value: 180, unit: 'PERCENT' };
    section.appendChild(cardDesc);
  }

  parent.appendChild(section);
  return section;
}

// =====================
// Component: About Section
// =====================
async function buildAbout(parent, pageWidth, yOffset) {
  const sectionH = 700;
  const section = createFrame('About Section', 0, yOffset, pageWidth, sectionH, TOKENS.colors.bgPrimary);

  // Left: Content
  const label = await createText('About Us', 80, 80, 12, 'SemiBold', TOKENS.colors.accent, 'Montserrat');
  section.appendChild(label);

  const title = await createText('テクノロジーの力で\n新しい選択肢を\n創出する', 80, 112, 40, 'Bold', TOKENS.colors.textPrimary);
  title.lineHeight = { value: 140, unit: 'PERCENT' };
  section.appendChild(title);

  const desc = await createText(
    '私たち株式会社Heurithm（ヒューリズム）は、クリエイターと\nビジネスの間に存在する課題をテクノロジーで解決します。',
    80, 310, 15, 'Regular', TOKENS.colors.textSecondary
  );
  desc.lineHeight = { value: 180, unit: 'PERCENT' };
  section.appendChild(desc);

  // Points
  const points = [
    { num: '01', text: 'クリエイター視点でのサービス設計\n現役クリエイターの声を反映した開発。' },
    { num: '02', text: '透明性の高いマッチングプロセス\nクリエイターが自分のキャリアをコントロール。' },
    { num: '03', text: '継続的なプロダクト改善\nユーザーフィードバックをもとにアップデート。' },
  ];

  for (let i = 0; i < points.length; i++) {
    const py = 390 + i * 84;
    // Dot
    const dot = createRect(80, py, 24, 24, TOKENS.colors.accent, 12);
    dot.opacity = 0.12;
    addBorder(dot, TOKENS.colors.accent);
    section.appendChild(dot);
    const dotNum = await createText(points[i].num, 85, py + 5, 10, 'Bold', TOKENS.colors.accent, 'Montserrat');
    section.appendChild(dotNum);
    const pointText = await createText(points[i].text, 116, py, 14, 'Regular', TOKENS.colors.textSecondary);
    pointText.lineHeight = { value: 170, unit: 'PERCENT' };
    section.appendChild(pointText);
  }

  // Right: Metric Cards
  const metrics = [
    { label: '登録クリエイター数', value: '2,400', unit: '+' },
    { label: '月間マッチング成立数', value: '340', unit: '件/月' },
    { label: '平均案件単価', value: '¥280K', unit: '' },
    { label: 'ユーザー満足度', value: '98', unit: '%' },
  ];

  const halfW = pageWidth / 2;
  for (let i = 0; i < metrics.length; i++) {
    const mx = halfW + 40;
    const my = 80 + i * 140;
    const metric = metrics[i];

    const cardBg = createRect(mx, my, halfW - 80, 120, TOKENS.colors.bgCard, 12);
    addBorder(cardBg, TOKENS.colors.border);
    section.appendChild(cardBg);

    const metricLabel = await createText(metric.label, mx + 24, my + 20, 13, 'Regular', TOKENS.colors.textSecondary);
    section.appendChild(metricLabel);

    const metricVal = await createText(metric.value + metric.unit, mx + 24, my + 48, 32, 'Black', TOKENS.colors.accent, 'Montserrat');
    section.appendChild(metricVal);

    // Progress bar bg
    const barBg = createRect(mx + 24, my + 96, halfW - 128, 4, TOKENS.colors.border, 2);
    section.appendChild(barBg);

    const fills = [70, 55, 45, 95];
    const barFill = createRect(mx + 24, my + 96, (halfW - 128) * fills[i] / 100, 4, TOKENS.colors.accent, 2);
    section.appendChild(barFill);
  }

  parent.appendChild(section);
  return section;
}

// =====================
// Component: opusr Showcase
// =====================
async function buildOpusr(parent, pageWidth, yOffset) {
  const sectionH = 600;
  const section = createFrame('opusr Showcase', 0, yOffset, pageWidth, sectionH, TOKENS.colors.bgPrimary);

  // Card background
  const innerCard = createRect(80, 40, pageWidth - 160, sectionH - 80, TOKENS.colors.bgCard, 20);
  addBorder(innerCard, TOKENS.colors.border);
  section.appendChild(innerCard);

  // Left content
  const labelBg = createRect(112, 72, 120, 26, TOKENS.colors.accent, 100);
  labelBg.opacity = 0.12;
  section.appendChild(labelBg);
  const labelText = await createText('Flagship Service', 120, 78, 12, 'SemiBold', TOKENS.colors.accent, 'Montserrat');
  section.appendChild(labelText);

  const title1 = await createText('あなたの作品に', 112, 116, 36, 'Bold', TOKENS.colors.textPrimary);
  section.appendChild(title1);
  const title2 = await createText('理想のオファーが届く', 112, 160, 36, 'Bold', TOKENS.colors.textPrimary);
  section.appendChild(title2);
  const title3 = await createText('opusr', 112, 204, 48, 'Black', TOKENS.colors.accent, 'Montserrat');
  section.appendChild(title3);

  const opusrDesc = await createText(
    '作品を登録したらオファーを待つだけ。クリエイター視点で\n設計されたビジネスマッチングサービス。',
    112, 268, 15, 'Regular', TOKENS.colors.textSecondary
  );
  opusrDesc.lineHeight = { value: 180, unit: 'PERCENT' };
  section.appendChild(opusrDesc);

  // Feature list
  const features = [
    '作品登録後、企業から直接オファーが届く',
    'プラットフォーム内でスムーズにメッセージやり取り',
    '稼働条件・希望単価を自分でカスタム設定',
    '動画制作・UI/UX・3DCG など多彩なカテゴリ対応',
  ];
  for (let i = 0; i < features.length; i++) {
    const fy = 340 + i * 32;
    const checkBg = createRect(112, fy, 18, 18, TOKENS.colors.accent, 9);
    checkBg.opacity = 0.15;
    addBorder(checkBg, TOKENS.colors.accent);
    section.appendChild(checkBg);
    const featureText = await createText(features[i], 140, fy, 13, 'Regular', TOKENS.colors.textSecondary);
    section.appendChild(featureText);
  }

  // CTA Button
  const opusrBtn = createRect(112, 492, 220, 52, TOKENS.colors.accent, 6);
  section.appendChild(opusrBtn);
  const opusrBtnText = await createText('opusr を使ってみる →', 136, 507, 15, 'SemiBold', TOKENS.colors.bgPrimary);
  section.appendChild(opusrBtnText);

  // Right: Mockup
  const halfW = pageWidth / 2;
  const mockupBg = createRect(halfW + 40, 72, halfW - 120, sectionH - 144, TOKENS.colors.bgSecondary, 12);
  addBorder(mockupBg, TOKENS.colors.border);
  section.appendChild(mockupBg);

  // Window dots
  const dotColors = [
    { r: 255/255, g: 95/255, b: 86/255 },
    { r: 255/255, g: 189/255, b: 46/255 },
    { r: 39/255, g: 201/255, b: 63/255 },
  ];
  dotColors.forEach((color, i) => {
    const dot = createRect(halfW + 60 + i * 18, 96, 10, 10, color, 5);
    section.appendChild(dot);
  });

  // Filter tags
  const tags = ['すべて', '動画制作', 'UI/UX', '3DCG'];
  let tagX = halfW + 40;
  for (const tag of tags) {
    const tagBg = createRect(tagX + 16, 124, 80, 24, tag === 'すべて' ? TOKENS.colors.accent : { r: 1, g: 1, b: 1 }, 100);
    tagBg.opacity = tag === 'すべて' ? 0.1 : 0.04;
    if (tag !== 'すべて') addBorder(tagBg, TOKENS.colors.border);
    section.appendChild(tagBg);
    const tagText = await createText(tag, tagX + 22, 130, 11, 'Medium', tag === 'すべて' ? TOKENS.colors.accent : TOKENS.colors.textSecondary);
    section.appendChild(tagText);
    tagX += 96;
  }

  // Creator mini-cards grid (2x2)
  const gridStartX = halfW + 56;
  const gridStartY = 164;
  const miniCardW = (halfW - 152) / 2 - 8;
  const miniCardH = 140;

  const gradients = [
    { r: 72/255, g: 100/255, b: 220/255 },
    { r: 220/255, g: 124/255, b: 72/255 },
    { r: 72/255, g: 220/255, b: 130/255 },
    { r: 220/255, g: 72/255, b: 196/255 },
  ];
  const miniCreators = ['田中 健太', '鈴木 美咲', '山本 拓也', '荒木 千尋'];

  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = gridStartX + col * (miniCardW + 8);
    const cy = gridStartY + row * (miniCardH + 8);

    const miniCard = createRect(cx, cy, miniCardW, miniCardH, { r: 1, g: 1, b: 1 }, 6);
    miniCard.opacity = 0.03;
    addBorder(miniCard, TOKENS.colors.border);
    section.appendChild(miniCard);

    // Image placeholder
    const imgPlaceholder = createRect(cx + 8, cy + 8, miniCardW - 16, 80, gradients[i], 4);
    imgPlaceholder.opacity = 0.6;
    section.appendChild(imgPlaceholder);

    const mName = await createText(miniCreators[i], cx + 8, cy + 96, 11, 'Bold', TOKENS.colors.textPrimary);
    section.appendChild(mName);
  }

  parent.appendChild(section);
  return section;
}

// =====================
// Component: News Section
// =====================
async function buildNews(parent, pageWidth, yOffset) {
  const sectionH = 580;
  const section = createFrame('News Section', 0, yOffset, pageWidth, sectionH, TOKENS.colors.bgPrimary);

  // Header
  const label = await createText('News', 80, 80, 12, 'SemiBold', TOKENS.colors.accent, 'Montserrat');
  section.appendChild(label);
  const title = await createText('最新情報', 80, 108, 40, 'Bold', TOKENS.colors.textPrimary);
  section.appendChild(title);

  // "All News" button
  const allBtn = createRect(pageWidth - 200, 112, 160, 44, { r: 0, g: 0, b: 0 }, 6);
  allBtn.fills = [];
  addBorder(allBtn, TOKENS.colors.borderLight);
  section.appendChild(allBtn);
  const allBtnText = await createText('すべてのニュース →', pageWidth - 188, 124, 14, 'Medium', TOKENS.colors.textPrimary);
  section.appendChild(allBtnText);

  // News cards
  const newsItems = [
    { date: '2025.01.15', tag: 'プレスリリース', title: 'opusr、クリエイター登録数\n2,000名突破のお知らせ' },
    { date: '2024.12.08', tag: 'アップデート',   title: '新機能「案件公開ボード」の\nリリースについて' },
    { date: '2024.11.20', tag: 'お知らせ',       title: 'シリーズA資金調達完了の\nご報告' },
  ];

  const cardW = (pageWidth - 160 - 48) / 3;

  for (let i = 0; i < newsItems.length; i++) {
    const item = newsItems[i];
    const cx = 80 + i * (cardW + 24);
    const cy = 188;

    const card = createRect(cx, cy, cardW, 340, TOKENS.colors.bgCard, 20);
    addBorder(card, TOKENS.colors.border);
    section.appendChild(card);

    // Thumbnail area
    const thumb = createRect(cx, cy, cardW, 180, { r: 31/255, g: 40/255, b: 64/255 }, 0);
    section.appendChild(thumb);
    // Rounded top corners only (approximate)
    const thumbText = await createText('NEWS', cx + cardW / 2 - 40, cy + 68, 40, 'Black', TOKENS.colors.accent, 'Montserrat');
    thumbText.opacity = 0.1;
    section.appendChild(thumbText);

    // Date
    const dateText = await createText(item.date, cx + 24, cy + 196, 12, 'Regular', TOKENS.colors.textMuted, 'Montserrat');
    section.appendChild(dateText);

    // Tag
    const tagBg = createRect(cx + 24 + 72, cy + 192, 80, 22, TOKENS.colors.accent, 100);
    tagBg.opacity = 0.1;
    section.appendChild(tagBg);
    const tagText = await createText(item.tag, cx + 30 + 72, cy + 198, 11, 'Medium', TOKENS.colors.accent);
    section.appendChild(tagText);

    // News title
    const newsTitle = await createText(item.title, cx + 24, cy + 232, 15, 'Bold', TOKENS.colors.textPrimary);
    newsTitle.lineHeight = { value: 160, unit: 'PERCENT' };
    section.appendChild(newsTitle);
  }

  parent.appendChild(section);
  return section;
}

// =====================
// Component: CTA Section
// =====================
async function buildCTA(parent, pageWidth, yOffset) {
  const sectionH = 480;
  const section = createFrame('CTA Section', 0, yOffset, pageWidth, sectionH, TOKENS.colors.bgPrimary);

  const innerCard = createRect(80, 40, pageWidth - 160, sectionH - 80, TOKENS.colors.bgCard, 20);
  addBorder(innerCard, TOKENS.colors.border);
  section.appendChild(innerCard);

  // Glow effect
  const glow = createRect(pageWidth / 2 - 200, sectionH / 2 - 100, 400, 200, TOKENS.colors.accent, 0);
  glow.opacity = 0.04;
  section.appendChild(glow);

  // Content
  const label = await createText('Get Started', pageWidth / 2 - 56, 80, 12, 'SemiBold', TOKENS.colors.accent, 'Montserrat');
  section.appendChild(label);

  const ctaTitle1 = await createText('あなたのクリエイティブを', pageWidth / 2 - 200, 116, 40, 'ExtraBold', TOKENS.colors.textPrimary);
  section.appendChild(ctaTitle1);

  const ctaTitle2 = await createText('ビジネスに変える一歩を', pageWidth / 2 - 200, 166, 40, 'ExtraBold', TOKENS.colors.accent);
  section.appendChild(ctaTitle2);

  const ctaDesc = await createText(
    '登録無料。作品を公開するだけで、あなたの理想の案件が向こうからやってきます。',
    pageWidth / 2 - 300, 236, 15, 'Regular', TOKENS.colors.textSecondary
  );
  section.appendChild(ctaDesc);

  // Primary button
  const primaryBtn = createRect(pageWidth / 2 - 220, 296, 260, 52, TOKENS.colors.accent, 6);
  section.appendChild(primaryBtn);
  const primaryBtnText = await createText('無料でクリエイター登録 →', pageWidth / 2 - 200, 311, 15, 'SemiBold', TOKENS.colors.bgPrimary);
  section.appendChild(primaryBtnText);

  // Secondary button
  const secondaryBtn = createRect(pageWidth / 2 + 56, 296, 160, 52, { r: 0, g: 0, b: 0 }, 6);
  secondaryBtn.fills = [];
  addBorder(secondaryBtn, TOKENS.colors.borderLight);
  section.appendChild(secondaryBtn);
  const secondaryBtnText = await createText('企業様はこちら', pageWidth / 2 + 76, 311, 15, 'Medium', TOKENS.colors.textPrimary);
  section.appendChild(secondaryBtnText);

  parent.appendChild(section);
  return section;
}

// =====================
// Component: Footer
// =====================
async function buildFooter(parent, pageWidth, yOffset) {
  const footerH = 400;
  const footer = createFrame('Footer', 0, yOffset, pageWidth, footerH, TOKENS.colors.bgSecondary);

  // Top border
  const topBorder = createRect(0, 0, pageWidth, 1, TOKENS.colors.border);
  footer.appendChild(topBorder);

  // Logo
  const logoMark = createRect(80, 56, 36, 36, TOKENS.colors.accent, 8);
  footer.appendChild(logoMark);
  const logoText = await createText('Heurithm', 124, 64, 18, 'Bold', TOKENS.colors.textPrimary, 'Montserrat');
  footer.appendChild(logoText);

  const brandDesc = await createText(
    'テクノロジーの力で新しい選択肢を創出する。\nクリエイターと企業をつなぐビジネスマッチング\nサービス「opusr」を運営しています。',
    80, 112, 13, 'Regular', TOKENS.colors.textSecondary
  );
  brandDesc.lineHeight = { value: 180, unit: 'PERCENT' };
  footer.appendChild(brandDesc);

  // Link columns
  const columns = [
    { title: 'Services',  links: ['opusr', 'クリエイター登録', '企業向けサービス', '料金プラン'] },
    { title: 'Company',   links: ['会社概要', 'ミッション', '採用情報', 'ニュース'] },
    { title: 'Support',   links: ['ヘルプセンター', 'お問い合わせ', '利用規約', 'プライバシーポリシー'] },
  ];

  const colStartX = pageWidth - 640;
  for (let ci = 0; ci < columns.length; ci++) {
    const cx = colStartX + ci * 200;
    const col = columns[ci];

    const colTitle = await createText(col.title, cx, 56, 11, 'Bold', TOKENS.colors.textMuted, 'Montserrat');
    footer.appendChild(colTitle);

    for (let li = 0; li < col.links.length; li++) {
      const linkText = await createText(col.links[li], cx, 88 + li * 32, 14, 'Regular', TOKENS.colors.textSecondary);
      footer.appendChild(linkText);
    }
  }

  // Bottom divider
  const bottomDivider = createRect(80, footerH - 64, pageWidth - 160, 1, TOKENS.colors.border);
  footer.appendChild(bottomDivider);

  // Copyright
  const copyright = await createText('© 2025 Heurithm Inc. All rights reserved.', 80, footerH - 44, 12, 'Regular', TOKENS.colors.textMuted);
  footer.appendChild(copyright);

  // Bottom links
  const bottomLinks = ['利用規約', 'プライバシーポリシー', '特定商取引法'];
  let blX = pageWidth - 80;
  for (const link of bottomLinks.reverse()) {
    const blText = await createText(link, blX - 100, footerH - 44, 12, 'Regular', TOKENS.colors.textMuted);
    footer.appendChild(blText);
    blX -= 120;
  }

  parent.appendChild(footer);
  return footer;
}

// =====================
// Main Entry Point
// =====================
async function main() {
  const PAGE_WIDTH = 1440;

  // Create the main page frame
  const page = figma.currentPage;
  page.name = 'Heurithm Redesign — opusr Tone';

  // Main artboard
  const artboard = createFrame('Heurithm Website — Desktop (1440px)', 0, 0, PAGE_WIDTH, 5000, TOKENS.colors.bgPrimary);
  artboard.clipsContent = false;

  figma.currentPage.appendChild(artboard);

  let currentY = 0;

  // Build each section
  console.log('Building Navigation...');
  await buildNavigation(artboard, PAGE_WIDTH);
  currentY += 72;

  console.log('Building Hero...');
  await buildHero(artboard, PAGE_WIDTH, currentY);
  currentY += 900;

  // Section divider
  artboard.appendChild(createRect(0, currentY, PAGE_WIDTH, 1, TOKENS.colors.border));
  currentY += 1;

  console.log('Building Services...');
  await buildServices(artboard, PAGE_WIDTH, currentY);
  currentY += 900;

  artboard.appendChild(createRect(0, currentY, PAGE_WIDTH, 1, TOKENS.colors.border));
  currentY += 1;

  console.log('Building About...');
  await buildAbout(artboard, PAGE_WIDTH, currentY);
  currentY += 700;

  artboard.appendChild(createRect(0, currentY, PAGE_WIDTH, 1, TOKENS.colors.border));
  currentY += 1;

  console.log('Building opusr Showcase...');
  await buildOpusr(artboard, PAGE_WIDTH, currentY);
  currentY += 600;

  artboard.appendChild(createRect(0, currentY, PAGE_WIDTH, 1, TOKENS.colors.border));
  currentY += 1;

  console.log('Building News...');
  await buildNews(artboard, PAGE_WIDTH, currentY);
  currentY += 580;

  artboard.appendChild(createRect(0, currentY, PAGE_WIDTH, 1, TOKENS.colors.border));
  currentY += 1;

  console.log('Building CTA...');
  await buildCTA(artboard, PAGE_WIDTH, currentY);
  currentY += 480;

  console.log('Building Footer...');
  await buildFooter(artboard, PAGE_WIDTH, currentY);
  currentY += 400;

  // Resize artboard to actual content height
  artboard.resize(PAGE_WIDTH, currentY);

  // Scroll and zoom to fit
  figma.viewport.scrollAndZoomIntoView([artboard]);

  figma.notify('✅ Heurithm デザインを生成しました！', { timeout: 4000 });
  figma.closePlugin();
}

main().catch(err => {
  console.error(err);
  figma.notify('❌ エラーが発生しました: ' + err.message, { error: true });
  figma.closePlugin();
});
