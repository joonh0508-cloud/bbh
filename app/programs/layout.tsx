"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useConfig } from "../context/ConfigContext";

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { config, isLoaded } = useConfig();

  if (!isLoaded) return <div className="min-h-screen bg-gray-50" />;

  const tabs = [
    { name: config.tab1Name, href: "/programs/dst" },
    { name: config.tab2Name, href: "/programs/saltwater" },
    { name: config.tab3Name, href: "/programs/area" },
    { name: config.tab4Name, href: "/programs/functions" },
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

        {/* 탭 네비게이션 (버튼 형태) */}
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const isPlaceholder = tab.href !== "/programs/dst" && tab.href !== "/programs/saltwater";
            
            return (
              <Link
                key={tab.href}
                href={isPlaceholder ? "#" : tab.href}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap shadow-sm border ${
                  isActive
                    ? "bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-md transform scale-[1.02]"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                } ${isPlaceholder ? "cursor-not-allowed opacity-50 hover:bg-white hover:text-gray-600" : ""}`}
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
