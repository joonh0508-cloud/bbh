import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const rawKey = process.env.OPENAI_API_KEY || "";
    // 작은따옴표/큰따옴표/공백 제거
    const apiKey = rawKey.trim().replace(/^['"]|['"]$/g, "");

    if (!apiKey) {
      return NextResponse.json(
        {
          reply:
            "⚠️ **OPENAI_API_KEY 환경변수가 설정되지 않았습니다.**\n\n" +
            "**[해결 방법]**\n" +
            "1. Vercel 대시보드 ➡️ 해당 프로젝트 ➡️ **Settings** ➡️ **Environment Variables** 메뉴로 이동합니다.\n" +
            "2. Key에 `OPENAI_API_KEY`, Value에 OpenAI API 키(`sk-...`)를 등록합니다.\n" +
            "3. ⚠️ **중요**: 환경변수를 추가한 후 반드시 Vercel에서 **Redeploy(재배포)**를 실행하거나, 새로운 커밋을 push해야 서버에 환경변수가 주입됩니다!",
        },
        { status: 200 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const { messages } = await req.json();

    const systemMessage = {
      role: "system",
      content:
        "너는 친절하고 설명력이 뛰어난 초·중·고 수학 전문 AI 튜터 '채채 수학 챗봇'이야. 모든 수학 기호, 공식, 방정식, 분수, 제곱근, 인덱스 등 수학적 표현은 반드시 올바른 LaTeX 수식 문법으로 작성해 줘. 인라인 수식은 $...$ (예: $x^2 + y^2 = 1$, $\\frac{a}{b}$, $\\sqrt{x}$), 블록 수식은 $$...$$ 으로 감싸서 학생이 깔끔하고 정교한 수식을 렌더링받을 수 있도록 출력해 줘. 친근하고 따뜻한 어조와 이모지를 적절히 사용해 줘.",
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, ...(messages || [])],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const reply = completion.choices[0]?.message?.content || "죄송합니다. 답변을 생성하지 못했습니다.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("OpenAI API Error Detail:", error);

    let userFriendlyMsg = "OpenAI API 호출 중 오류가 발생했습니다.";

    if (error?.status === 401 || error?.code === "invalid_api_key") {
      userFriendlyMsg =
        "⚠️ **유효하지 않은 OPENAI_API_KEY입니다.**\n\nOpenAI 대시보드(platform.openai.com)에서 발급받은 올바른 API 키(`sk-...`)인지 확인해 주세요.";
    } else if (error?.status === 429 || error?.code === "insufficient_quota") {
      userFriendlyMsg =
        "⚠️ **OpenAI 계정 크레딧(잔액)이 부족하거나 사용량 제약이 발생했습니다.**\n\nOpenAI Billing 설정에서 결제 수단 및 잔액을 확인해 주세요.";
    } else if (error?.message) {
      userFriendlyMsg = `⚠️ **API 오류**: ${error.message}`;
    }

    return NextResponse.json({ reply: userFriendlyMsg }, { status: 200 });
  }
}
