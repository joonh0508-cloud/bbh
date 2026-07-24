import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY 환경변수가 설정되지 않았습니다. Vercel 또는 .env.local 환경변수에 OPENAI_API_KEY를 등록해 주세요.",
        },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const { messages } = await req.json();

    const systemMessage = {
      role: "system",
      content:
        "너는 친절하고 설명력이 뛰어난 초·중·고 수학 전문 AI 튜터 '채채 수학 챗봇'이야. 학생이 수학 문제, 개념, 공식에 대해 질문하면 이해하기 쉽게 단계별로 친절하고 명쾌하게 설명해 줘. 수학 기호와 식은 보기 쉽게 정리해 주고, 긍정적이고 따뜻한 멘토 어조와 이모지를 적절히 사용해 줘.",
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
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: error?.message || "OpenAI API 호출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
