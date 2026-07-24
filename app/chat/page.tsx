"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Send, Sparkles, Bot, User, RefreshCw, Key, Check } from "lucide-react";
import MathText from "@/components/MathText";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "안녕하세요! 반가워요 😊 저는 수학 문제를 함께 풀어주는 **채채 AI 수학 튜터**입니다.\n궁금한 수학 개념이나 잘 안 풀리는 문제, 공식을 편하게 물어보세요!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userApiKey, setUserApiKey] = useState("");
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem("user_openai_api_key");
    if (savedKey) {
      setUserApiKey(savedKey);
      setTempKeyInput(savedKey);
    }
  }, []);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = tempKeyInput.trim();
    setUserApiKey(cleanKey);
    localStorage.setItem("user_openai_api_key", cleanKey);
    setIsKeyModalOpen(false);
    alert(cleanKey ? "API 키가 성공적으로 저장되었습니다!" : "API 키가 초기화되었습니다.");
  };

  const sampleQuestions = [
    "소금물 농도 공식 쉽게 알려줘!",
    "거속시(거리·속력·시간) 관계가 뭐야?",
    "피타고라스 정리가 뭐야?",
    "이차방정식 근의 공식 공식이 뭐야?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const apiMessages = newMessages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, userApiKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "답변을 불러오는데 실패했습니다.");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `⚠️ 오류 발생: ${error.message}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 상단 헤더 영역 */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              메인으로
            </Link>
            <div className="h-4 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h1 className="text-lg font-bold text-[#1d1d1f] tracking-tight">
                AI 수학 튜터 챗봇
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                userApiKey
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{userApiKey ? "API 키 설정됨" : "API 키 직접 입력"}</span>
            </button>

            <button
              onClick={() =>
                setMessages([
                  {
                    id: "welcome",
                    role: "assistant",
                    content:
                      "대화가 초기화되었습니다! 궁금한 수학 질답을 다시 입력해 보세요 😊",
                  },
                ])
              }
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full transition-colors"
              title="대화 초기화"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 메인 대화 영역 */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col justify-between">
        
        {/* 대화 목록 */}
        <div className="flex flex-col gap-4 mb-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#1d1d1f] text-white rounded-br-none shadow-sm"
                    : "bg-white text-[#1d1d1f] rounded-bl-none border border-gray-100 shadow-sm"
                }`}
              >
                <MathText content={msg.content} />
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* 로딩 애니메이션 */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 하단 추천 질문 칩 & 입력창 */}
        <div className="sticky bottom-4 z-10 flex flex-col gap-3">
          
          {/* 추천 질문 칩들 */}
          {messages.length < 3 && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-3.5 py-2 bg-white/90 hover:bg-white text-xs font-semibold text-gray-600 hover:text-blue-600 border border-gray-200 rounded-full backdrop-blur-md shadow-xs transition-all whitespace-nowrap"
                >
                  ✨ {q}
                </button>
              ))}
            </div>
          )}

          {/* 질문 입력창 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-lg"
          >
            <input
              type="text"
              placeholder="수학 질문을 작성해 주세요... (예: 피타고라스 정리가 뭐야?)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm focus:outline-none text-[#1d1d1f]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 shadow-sm shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </main>

      {/* API 키 직접 입력 모달 */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form onSubmit={handleSaveKey} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-4">
            <h3 className="text-lg font-bold text-[#1d1d1f] text-center">OpenAI API 키 직접 설정</h3>
            <p className="text-xs text-gray-500 leading-relaxed text-center">
              Vercel 서버 환경변수 연동이 지연되는 경우, platform.openai.com에서 발급받은 <b>API 키(sk-...)</b>를 아래에 입력해 주시면 즉시 100% 정상 작동합니다!
            </p>
            <input
              type="password"
              placeholder="sk-..."
              value={tempKeyInput}
              onChange={(e) => setTempKeyInput(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f]"
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsKeyModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm"
              >
                저장 및 적용
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
