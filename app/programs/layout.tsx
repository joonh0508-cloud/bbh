"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: "거리·속력·시간", href: "/programs/dst" },
    { name: "소금물의 농도", href: "/programs/saltwater" },
    { name: "도형의 넓이 (예정)", href: "/programs/area" },
    { name: "함수 그래프 (예정)", href: "/programs/functions" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 상단 헤더 영역 */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              메인으로
            </Link>
            <div className="h-4 w-px bg-gray-200"></div>
            <h1 className="text-lg font-semibold text-[#1d1d1f] tracking-tight">
              수학 프로그램
            </h1>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const isPlaceholder = tab.href !== "/programs/dst" && tab.href !== "/programs/saltwater";
            
            return (
              <Link
                key={tab.href}
                href={isPlaceholder ? "#" : tab.href}
                className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-[#1d1d1f] text-[#1d1d1f]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                } ${isPlaceholder ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
      </header>

      {/* 개별 프로그램 콘텐츠 렌더링 영역 */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
