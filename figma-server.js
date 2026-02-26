/**
 * Heurithm Figma Design Server
 * ==============================
 * WebSocket server that communicates with the Figma plugin
 * to create the Heurithm website redesign in Figma.
 *
 * Usage:
 *   node figma-server.js
 *
 * Then in Figma:
 *   1. Open Plugins > Development > figma-plugin
 *   2. Click "WebSocket接続"
 *   3. Design will be created automatically
 */

const http = require('http');
const { WebSocketServer } = require('ws');

const PORT = 3030;

// =====================
// Design Color Tokens
// =====================
const C = {
  bgPrimary:   { r: 0.082, g: 0.098, b: 0.149, a: 1 },
  bgSecondary: { r: 0.110, g: 0.137, b: 0.220, a: 1 },
  bgCard:      { r: 0.122, g: 0.157, b: 0.251, a: 1 },
  accent:      { r: 0.961, g: 0.710, b: 0.063, a: 1 },
  textPrimary: { r: 1.000, g: 1.000, b: 1.000, a: 1 },
  textSecond:  { r: 0.533, g: 0.573, b: 0.643, a: 1 },
  textMuted:   { r: 0.353, g: 0.392, b: 0.463, a: 1 },
  border:      { r: 0.165, g: 0.204, b: 0.314, a: 1 },
  borderLight: { r: 0.227, g: 0.275, b: 0.408, a: 1 },
  green:       { r: 0.282, g: 0.863, b: 0.510, a: 1 },
};

// =====================
// Design Schema
// Sent to Figma plugin as instructions
// =====================
const DESIGN_SCHEMA = {
  type: 'CREATE_HEURITHM_DESIGN',
  pageWidth: 1440,
  tokens: C,
  sections: [
    {
      type: 'NAVIGATION',
      height: 72,
      elements: [
        { type: 'RECT', x: 0, y: 0, w: 1440, h: 72, fill: C.bgPrimary, name: 'NavBg' },
        { type: 'RECT', x: 0, y: 71, w: 1440, h: 1, fill: C.border, name: 'NavBorder' },
        { type: 'RECT', x: 80, y: 18, w: 36, h: 36, fill: C.accent, radius: 8, name: 'LogoMark' },
        { type: 'TEXT', x: 126, y: 26, content: 'Heurithm', size: 18, weight: 'Bold', color: C.textPrimary, family: 'Inter', name: 'LogoText' },
        { type: 'TEXT', x: 555, y: 28, content: 'サービス', size: 14, weight: 'Regular', color: C.textSecond, name: 'NavLink1' },
        { type: 'TEXT', x: 665, y: 28, content: '会社情報', size: 14, weight: 'Regular', color: C.textSecond, name: 'NavLink2' },
        { type: 'TEXT', x: 775, y: 28, content: 'opusr', size: 14, weight: 'Regular', color: C.textSecond, name: 'NavLink3' },
        { type: 'TEXT', x: 865, y: 28, content: 'ニュース', size: 14, weight: 'Regular', color: C.textSecond, name: 'NavLink4' },
        { type: 'RECT', x: 1244, y: 18, w: 156, h: 36, fill: C.accent, radius: 6, name: 'CTABg' },
        { type: 'TEXT', x: 1258, y: 28, content: 'opusr を見る →', size: 13, weight: 'SemiBold', color: C.bgPrimary, name: 'CTAText' },
      ],
    },
    {
      type: 'HERO',
      yOffset: 72,
      height: 860,
      elements: [
        { type: 'RECT', x: 0, y: 0, w: 1440, h: 860, fill: C.bgPrimary, name: 'HeroBg' },
        // Badge
        { type: 'RECT', x: 80, y: 96, w: 244, h: 30, fill: C.accent, radius: 100, opacity: 0.1, name: 'BadgeBg' },
        { type: 'TEXT', x: 110, y: 104, content: 'クリエイターと企業をつなぐ', size: 12, weight: 'Medium', color: C.accent, name: 'BadgeText' },
        // Hero title
        { type: 'TEXT', x: 80, y: 148, content: 'テクノロジーの力で', size: 56, weight: 'Black', color: C.textPrimary, name: 'HeroTitle1' },
        { type: 'TEXT', x: 80, y: 214, content: '新しい選択肢を', size: 56, weight: 'Black', color: C.accent, name: 'HeroTitle2' },
        { type: 'TEXT', x: 80, y: 280, content: '創出する', size: 56, weight: 'Black', color: C.textPrimary, name: 'HeroTitle3' },
        // Description
        { type: 'TEXT', x: 80, y: 360, content: '株式会社Heurithm（ヒューリズム）は、クリエイターと企業のビジネスマッチングを\n通じて、制作の現場に新たな可能性を届けます。', size: 16, weight: 'Regular', color: C.textSecond, name: 'HeroDesc' },
        // CTA buttons
        { type: 'RECT', x: 80, y: 428, w: 216, h: 52, fill: C.accent, radius: 6, name: 'PrimaryBtn' },
        { type: 'TEXT', x: 104, y: 443, content: 'サービスを見る →', size: 16, weight: 'SemiBold', color: C.bgPrimary, name: 'PrimaryBtnText' },
        { type: 'RECT', x: 312, y: 428, w: 160, h: 52, fill: null, stroke: C.borderLight, radius: 6, name: 'SecondaryBtn' },
        { type: 'TEXT', x: 340, y: 443, content: '会社について', size: 16, weight: 'Medium', color: C.textPrimary, name: 'SecondaryBtnText' },
        // Stats
        { type: 'RECT', x: 80, y: 512, w: 520, h: 1, fill: C.border, name: 'StatsDivider' },
        { type: 'TEXT', x: 80, y: 536, content: '2,400+', size: 32, weight: 'Black', color: C.accent, family: 'Inter', name: 'Stat1' },
        { type: 'TEXT', x: 80, y: 576, content: '登録クリエイター数', size: 12, weight: 'Regular', color: C.textSecond, name: 'StatLabel1' },
        { type: 'TEXT', x: 260, y: 536, content: '840+', size: 32, weight: 'Black', color: C.accent, family: 'Inter', name: 'Stat2' },
        { type: 'TEXT', x: 260, y: 576, content: '提携企業数', size: 12, weight: 'Regular', color: C.textSecond, name: 'StatLabel2' },
        { type: 'TEXT', x: 420, y: 536, content: '98%', size: 32, weight: 'Black', color: C.accent, family: 'Inter', name: 'Stat3' },
        { type: 'TEXT', x: 420, y: 576, content: 'マッチング満足度', size: 12, weight: 'Regular', color: C.textSecond, name: 'StatLabel3' },
        // Creator card
        { type: 'RECT', x: 760, y: 144, w: 600, h: 440, fill: C.bgCard, stroke: C.border, radius: 20, name: 'CreatorCard' },
        { type: 'TEXT', x: 784, y: 174, content: 'アクティブなクリエイター', size: 15, weight: 'Bold', color: C.textPrimary, name: 'CardTitle' },
        { type: 'RECT', x: 1280, y: 160, w: 64, h: 24, fill: C.green, radius: 100, opacity: 0.12, name: 'StatusBadge' },
        { type: 'TEXT', x: 1287, y: 176, content: '● Live', size: 11, weight: 'SemiBold', color: C.green, family: 'Inter', name: 'LiveText' },
      ],
    },
    {
      type: 'SERVICES',
      yOffset: 933,
      height: 900,
      cards: [
        { icon: '🎯', title: 'スマートマッチング', desc: 'AIアルゴリズムによりクリエイターと企業のニーズを高精度でマッチング。', x: 80, y: 270 },
        { icon: '💬', title: 'シームレスなコミュニケーション', desc: 'メッセージ機能でオファーから契約まで一貫したやり取りが可能。', x: 504, y: 270 },
        { icon: '⚙️', title: 'カスタム条件設定', desc: '稼働条件を細かく設定。理想の案件だけを受け取れます。', x: 928, y: 270 },
        { icon: '🔍', title: '案件公開ボード', desc: '双方向型の仕組みで積極的に機会を掴めます。', x: 80, y: 526 },
        { icon: '📊', title: '実績・ポートフォリオ管理', desc: '実績を蓄積し高品質なオファーを引き寄せます。', x: 504, y: 526 },
        { icon: '🔒', title: '安心・安全な取引環境', desc: '本人確認・エスクロー決済で安全な取引環境を提供。', x: 928, y: 526 },
      ],
    },
    {
      type: 'ABOUT',
      yOffset: 1834,
      height: 720,
    },
    {
      type: 'OPUSR',
      yOffset: 2555,
      height: 620,
    },
    {
      type: 'NEWS',
      yOffset: 3176,
      height: 560,
      items: [
        { date: '2025.01.15', tag: 'プレスリリース', title: 'opusr、クリエイター登録数\n2,000名突破のお知らせ' },
        { date: '2024.12.08', tag: 'アップデート', title: '新機能「案件公開ボード」の\nリリースについて' },
        { date: '2024.11.20', tag: 'お知らせ', title: 'シリーズA資金調達\n完了のご報告' },
      ],
    },
    {
      type: 'CTA',
      yOffset: 3737,
      height: 480,
    },
    {
      type: 'FOOTER',
      yOffset: 4217,
      height: 400,
    },
  ],
};

// =====================
// WebSocket Server
// =====================
const server = http.createServer();
const wss = new WebSocketServer({ server });

console.log(`\n🎨 Heurithm Figma Design Server`);
console.log(`================================`);
console.log(`Port: ${PORT}`);
console.log(`Status: Starting...`);

wss.on('connection', (ws) => {
  console.log(`\n✅ Figma plugin connected!`);

  ws.on('message', (data) => {
    let msg;
    try {
      msg = JSON.parse(data.toString());
    } catch (e) {
      console.error('Invalid message:', data.toString());
      return;
    }

    console.log(`📥 Message from plugin: ${msg.type}`);

    if (msg.type === 'PLUGIN_READY') {
      console.log(`\n🚀 Sending design schema to Figma...`);
      ws.send(JSON.stringify(DESIGN_SCHEMA));
      console.log(`   ✓ Design schema sent (${JSON.stringify(DESIGN_SCHEMA).length} bytes)`);
    }

    if (msg.type === 'SECTION_COMPLETE') {
      console.log(`   ✓ Section completed: ${msg.section}`);
    }

    if (msg.type === 'DESIGN_COMPLETE') {
      console.log(`\n🎉 Design creation complete!`);
      console.log(`   File: https://www.figma.com/design/DxEEphhLtKrarfulbob5iL/kawada_work`);
      ws.send(JSON.stringify({ type: 'CLOSE' }));
    }

    if (msg.type === 'ERROR') {
      console.error(`\n❌ Error from plugin: ${msg.message}`);
    }
  });

  ws.on('close', () => {
    console.log('\n👋 Plugin disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`\n✅ Server ready on ws://localhost:${PORT}`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Open Figma: https://www.figma.com/design/DxEEphhLtKrarfulbob5iL/kawada_work`);
  console.log(`   2. Run the "Heurithm Redesign" plugin from Plugins > Development`);
  console.log(`   3. Click "WebSocket接続" in the plugin UI`);
  console.log(`   4. Design will be created automatically!\n`);
});
