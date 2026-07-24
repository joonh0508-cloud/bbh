"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Settings } from "lucide-react";
import SettingsModal from "../components/SettingsModal";
import { useConfig } from "./context/ConfigContext";

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { config, isLoaded } = useConfig();

  // 설정이 렌더링되기 전 깜빡임 방지
  if (!isLoaded) return <div className="min-h-screen bg-gray-50" />;

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* 상단 헤더 영역 */}
      <header className="w-full max-w-5xl mx-auto px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/70 sticky top-0 z-50 border-b border-gray-100">
        <div className="text-xl font-semibold tracking-tighter text-[#1d1d1f]">
          채채의 수학
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/programs" className="text-sm font-medium text-[#0066cc] hover:text-blue-700 cursor-pointer transition-colors duration-200">
            수학 프로그램
          </Link>
          <Link href="/board" className="text-sm text-gray-500 hover:text-[#1d1d1f] cursor-pointer transition-colors duration-200">
            자료실
          </Link>
          <button onClick={() => setIsSettingsOpen(true)} className="text-sm text-gray-500 hover:text-[#1d1d1f] cursor-pointer transition-colors duration-200">
            설정
          </button>
        </nav>
      </header>

      {/* 메인 콘텐츠 영역 (Hero Section) */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        {/* 환영 인사 뱃지 */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#0066cc] text-sm font-medium mb-8 shadow-sm">
          <span>채채의 수학 창고</span>
        </div>

        {/* 메인 타이틀 (동적) */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-[#1d1d1f]">
          {config.mainTitle}
        </h1>
        
        {/* 서브 설명 (동적) */}
        <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl leading-relaxed whitespace-pre-wrap">
          {config.subDescription}
        </p>

        {/* 기능 버튼들이 있던 자리 (삭제됨) */}
      </main>

      {/* 하단 푸터 영역 */}
      <footer className="w-full border-t border-gray-100 mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <div>© {new Date().getFullYear()} 채채의 수학. All rights reserved.</div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <span className="hover:text-gray-600 cursor-pointer transition-colors">이용약관</span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors">개인정보처리방침</span>
          </div>
        </div>
      </footer>

      {/* 설정 모달창 */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
