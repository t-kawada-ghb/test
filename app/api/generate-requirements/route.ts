import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `あなたはクリエイターと企業のマッチングプラットフォームの要件定義の専門家です。
ユーザーからクリエイティブ案件の概要を受け取り、プロジェクトの要件定義に必要な項目を詳細に策定してください。

以下のJSON形式で出力してください（マークダウンのコードブロックは不要、JSONのみ出力）:

{
  "projectTitle": "プロジェクト名（概要から推定）",
  "sections": [
    {
      "id": "セクションID",
      "title": "セクションタイトル",
      "items": [
        {
          "label": "項目名",
          "value": "具体的な内容・提案",
          "required": true または false,
          "notes": "補足・確認事項（任意）"
        }
      ]
    }
  ]
}

以下のセクションを必ず含めること:
1. project_overview - プロジェクト概要（目的・背景・課題）
2. deliverables - 成果物定義（納品物・フォーマット・数量）
3. target - ターゲット・用途（誰に・何のために）
4. creator_requirements - クリエイター要件（スキル・経験・スタイル）
5. schedule - スケジュール（マイルストーン・納期）
6. budget - 予算感（概算・支払い条件）
7. constraints - 制約条件（NG事項・権利関係・機密情報）
8. references - 参考資料・イメージ（方向性・競合事例）
9. approval_flow - 承認フロー（確認回数・修正対応）
10. success_criteria - 完了条件・成功指標

各項目は概要から読み取れる情報を具体的に記載し、
不明な点は「要確認: [確認すべき内容]」の形式で記載してください。`;

export async function POST(req: NextRequest) {
  try {
    const { overview } = await req.json();

    if (!overview || typeof overview !== "string" || overview.trim() === "") {
      return NextResponse.json({ error: "概要を入力してください" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `以下のクリエイティブ案件の概要から要件定義を策定してください:\n\n${overview}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const requirements = JSON.parse(content.text);
    return NextResponse.json(requirements);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "レスポンスの解析に失敗しました" }, { status: 500 });
    }
    console.error(error);
    return NextResponse.json({ error: "要件定義の生成に失敗しました" }, { status: 500 });
  }
}
