import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { curriculum, grade, majorUnit, minorUnit, difficulty, count, userApiKey } = await req.json();

    const rawKey = userApiKey || process.env.OPENAI_API_KEY || "";
    const apiKey = rawKey.trim().replace(/^['"]|['"]$/g, "");

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY가 설정되지 않았습니다. 상단 '🔑 API 키 입력' 버튼을 누르시고 API 키(sk-...)를 직접 입력해 주세요.",
        },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const problemCount = Math.min(Math.max(Number(count) || 5, 1), 30);

    const prompt = `
당신은 대한민국 최고 수준의 수학 교육 출제 위원입니다.
다음 요청 조건에 부합하는 고품질 수학 문제 세트를 생성해 주세요:

[출제 조건]
- 교육과정: ${curriculum}
- 대상 학년: ${grade}
- 대단원: ${majorUnit}
- 소단원: ${minorUnit}
- 난이도: ${difficulty} (상: 심화/응용/수능형, 중: 표준 유형, 하: 기초 개념 확인)
- 출제 문제 수: 총 ${problemCount}문제

[응답 형식]
반드시 다음 구조의 JSON 형식으로만 응답해 주세요. 다른 설명 텍스트나 markdown backtick 문법 없이 순수 JSON 객체만 반환해야 합니다:
{
  "problems": [
    {
      "id": 1,
      "question": "문제 내용 (수식이나 표가 필요한 경우 텍스트로 명확하게 표현)",
      "options": ["① 보기1", "② 보기2", "③ 보기3", "④ 보기4", "⑤ 보기5"], // 객관식인 경우 제공, 주관식인 경우 빈 배열 []
      "hint": "문제 풀이를 돕는 핵심 힌트 1줄",
      "answer": "정답",
      "solution": "단계별 상세 풀이 과정"
    }
  ]
}
`;

    let rawResponse = "";

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional math problem author for Korean schools. You must output pure valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });
      rawResponse = completion.choices[0]?.message?.content || "";
    } catch (modelErr: any) {
      console.warn("gpt-4o-mini problem gen failed, fallback to gpt-3.5-turbo:", modelErr?.message);
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional math problem author for Korean schools. You must output pure valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });
      rawResponse = completion.choices[0]?.message?.content || "";
    }

    let cleaned = rawResponse.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Problem generation API error:", error);

    let msg = error?.message || "문제 생성 중 오류가 발생했습니다.";
    if (error?.status === 401 || error?.code === "invalid_api_key") {
      msg = "유효하지 않은 API 키입니다. '🔑 API 키 입력' 버튼을 눌러 올바른 API 키(sk-...)를 입력해 주세요.";
    } else if (error?.status === 429 || error?.code === "insufficient_quota") {
      msg = "OpenAI 계정 크레딧(잔액)이 부족합니다. platform.openai.com 결제 설정을 확인해 주세요.";
    }

    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
