import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, userApiKey } = body;

    // 1. 요청 바디의 userApiKey 2. 환경변수 OPENAI_API_KEY 중 순서대로 선택
    const rawKey = userApiKey || process.env.OPENAI_API_KEY || "";
    const apiKey = rawKey.trim().replace(/^['"]|['"]$/g, "");

    if (!apiKey) {
      return NextResponse.json(
        {
          reply:
            "⚠️ **OpenAI API 키가 설정되지 않았습니다.**\n\n" +
            "**[해결 방법 (2가지 중 하나 선택)]**\n\n" +
            "👉 **방법 1 (추천: 즉시 사용)**: 상단에 있는 **'🔑 API 키 입력'** 버튼을 눌러 발급받으신 OpenAI API 키(`sk-...`)를 직접 입력하시면 바로 대화하실 수 있습니다!\n\n" +
            "👉 **방법 2**: Vercel 대시보드 ➡️ Settings ➡️ Environment Variables에서 `OPENAI_API_KEY`를 추가하고 프로젝트를 Redeploy해 주세요.",
        },
        { status: 200 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const systemMessage = {
      role: "system",
      content:
        "너는 친절하고 설명력이 뛰어난 초·중·고 수학 전문 AI 튜터 '채채 수학 챗봇'이야. 모든 수학 기호, 공식, 방정식, 분수, 제곱근, 인덱스 등 수학적 표현은 반드시 올바른 LaTeX 수식 문법으로 작성해 줘. 인라인 수식은 $...$ (예: $x^2 + y^2 = 1$, $\\frac{a}{b}$, $\\sqrt{x}$), 블록 수식은 $$...$$ 으로 감싸서 학생이 깔끔하고 정교한 수식을 렌더링받을 수 있도록 출력해 줘. 친근하고 따뜻한 어조와 이모지를 적절히 사용해 줘.",
    };

    let reply = "";

    try {
      // 1차 시도: gpt-4o-mini
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [systemMessage, ...(messages || [])],
        temperature: 0.7,
        max_tokens: 1000,
      });
      reply = completion.choices[0]?.message?.content || "";
    } catch (modelErr: any) {
      console.warn("gpt-4o-mini failed, trying gpt-3.5-turbo:", modelErr?.message);
      // 2차 시도: gpt-3.5-turbo 폴백
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...(messages || [])],
        temperature: 0.7,
        max_tokens: 1000,
      });
      reply = completion.choices[0]?.message?.content || "";
    }

    if (!reply) {
      reply = "죄송합니다. 답변을 생성하지 못했습니다.";
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("OpenAI API Error Detail:", error);

    let userFriendlyMsg = "OpenAI API 호출 중 오류가 발생했습니다.";

    if (error?.status === 401 || error?.code === "invalid_api_key") {
      userFriendlyMsg =
        "⚠️ **유효하지 않은 OPENAI_API_KEY입니다.**\n\n상단 '🔑 API 키 입력' 버튼을 눌러 platform.openai.com에서 발급받은 올바른 API 키(`sk-...`)를 입력해 주세요.";
    } else if (error?.status === 429 || error?.code === "insufficient_quota") {
      userFriendlyMsg =
        "⚠️ **OpenAI 계정 크레딧(잔액)이 부족합니다.**\n\nplatform.openai.com 의 Billing 메뉴에서 결제 정보 및 사용 잔액을 확인해 주세요.";
    } else if (error?.message) {
      userFriendlyMsg = `⚠️ **API 오류**: ${error.message}`;
    }

    return NextResponse.json({ reply: userFriendlyMsg }, { status: 200 });
  }
}
