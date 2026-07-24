"use client";

import { useState } from "react";
import { curriculumList, CurriculumData, GradeData, MajorUnit } from "@/lib/curriculumData";
import { Sparkles, Download, BookOpen, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

interface Problem {
  id: number;
  question: string;
  options?: string[];
  hint?: string;
  answer: string;
  solution: string;
}

export default function ProblemGeneratorPage() {
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<"2015" | "2022">("2022");
  const [selectedGradeIndex, setSelectedGradeIndex] = useState<number>(0);
  const [selectedMajorIndex, setSelectedMajorIndex] = useState<number>(0);
  const [selectedMinorIndex, setSelectedMinorIndex] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<"상" | "중" | "하">("중");
  const [count, setCount] = useState<number>(5);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // 현재 선택된 교육과정 데이터
  const currentCurriculum: CurriculumData =
    curriculumList.find((c) => c.id === selectedCurriculumId) || curriculumList[1];
  
  // 현재 선택된 학년 데이터
  const currentGrade: GradeData =
    currentCurriculum.grades[selectedGradeIndex] || currentCurriculum.grades[0];

  // 현재 선택된 대단원 데이터
  const currentMajor: MajorUnit =
    currentGrade.majorUnits[selectedMajorIndex] || currentGrade.majorUnits[0];

  // 현재 선택된 소단원 데이터
  const currentMinor: string =
    currentMajor.subUnits[selectedMinorIndex] || currentMajor.subUnits[0] || "";

  // 문제 생성 API 호출
  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg("");
    setProblems([]);

    try {
      const res = await fetch("/api/generate-problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          curriculum: currentCurriculum.name,
          grade: currentGrade.gradeName,
          majorUnit: currentMajor.name,
          minorUnit: currentMinor,
          difficulty,
          count,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "문제 생성 중 오류가 발생했습니다.");
      }

      if (data.problems && Array.isArray(data.problems)) {
        setProblems(data.problems);
      } else {
        throw new Error("문제 형식이 올바르지 않습니다.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "문제 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 한글(HWP) 문서 파일 생성 및 다운로드
  const handleDownloadHWP = () => {
    if (problems.length === 0) return;

    let hwpContent = `====================================================
채채의 수학 창고 - AI 자동 생성 수학 문제지
====================================================
■ 교육과정: ${currentCurriculum.name}
■ 대상학년: ${currentGrade.gradeName}
■ 단원: ${currentMajor.name} > ${currentMinor}
■ 난이도: ${difficulty} | 총 ${problems.length}문항
====================================================\n\n`;

    problems.forEach((p, idx) => {
      hwpContent += `[문제 ${idx + 1}] ${p.question}\n`;
      if (p.options && p.options.length > 0) {
        hwpContent += `  ${p.options.join("   ")}\n`;
      }
      hwpContent += `\n`;
    });

    hwpContent += `\n====================================================\n`;
    hwpContent += `[ 정답 및 상세 해설 ]\n`;
    hwpContent += `====================================================\n\n`;

    problems.forEach((p, idx) => {
      hwpContent += `[문제 ${idx + 1}] 정답: ${p.answer}\n`;
      if (p.hint) hwpContent += `  💡 힌트: ${p.hint}\n`;
      hwpContent += `  📝 풀이: ${p.solution}\n\n`;
    });

    // 한글(HWP)과 호환되는 Blob 파일 생성 (.hwp 확장자)
    const blob = new Blob(["\ufeff" + hwpContent], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `[채채수학]_${currentGrade.gradeName}_${currentMinor}_(${difficulty}_${problems.length}문항).hwp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
      
      {/* 헤더 설명 영역 */}
      <div className="text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          AI 맞춤형 수학 문제 은행
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] mb-2">
          교육과정 단원별 문제 생성기
        </h2>
        <p className="text-gray-500">
          2015 & 2022 개정 교육과정 단원과 난이도를 선택하여 최대 30문제를 생성하고, 한글(HWP) 파일로 다운로드받으세요.
        </p>
      </div>

      {/* 옵션 설정 카드 */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-6">
        
        {/* 교육과정 선택 탭 */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[#1d1d1f] w-20">교육과정</span>
          <div className="flex gap-2">
            {curriculumList.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCurriculumId(c.id);
                  setSelectedGradeIndex(0);
                  setSelectedMajorIndex(0);
                  setSelectedMinorIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCurriculumId === c.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* 학년 / 대단원 / 소단원 셀렉트 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 학년 선택 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">학년 선택</label>
            <select
              value={selectedGradeIndex}
              onChange={(e) => {
                setSelectedGradeIndex(Number(e.target.value));
                setSelectedMajorIndex(0);
                setSelectedMinorIndex(0);
              }}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f]"
            >
              {currentCurriculum.grades.map((g, idx) => (
                <option key={idx} value={idx}>
                  {g.gradeName}
                </option>
              ))}
            </select>
          </div>

          {/* 대단원 선택 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">대단원 선택</label>
            <select
              value={selectedMajorIndex}
              onChange={(e) => {
                setSelectedMajorIndex(Number(e.target.value));
                setSelectedMinorIndex(0);
              }}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f]"
            >
              {currentGrade.majorUnits.map((m, idx) => (
                <option key={idx} value={idx}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* 소단원 선택 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">소단원 선택</label>
            <select
              value={selectedMinorIndex}
              onChange={(e) => setSelectedMinorIndex(Number(e.target.value))}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f]"
            >
              {currentMajor.subUnits.map((sub, idx) => (
                <option key={idx} value={idx}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 난이도 & 문제 수 선택 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-200/60">
          
          {/* 난이도 선택 */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-500">난이도</span>
            <div className="flex gap-2">
              {(["하", "중", "상"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    difficulty === d
                      ? "bg-[#1d1d1f] text-white shadow-xs"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {d === "하" ? "하 (기초)" : d === "중" ? "중 (표준)" : "상 (심화)"}
                </button>
              ))}
            </div>
          </div>

          {/* 문제 수 선택 */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-500">문제 수</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={1}
                max={30}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-32 accent-blue-600"
              />
              <span className="text-sm font-bold text-blue-600 w-12 text-center">{count}문제</span>
            </div>
          </div>

        </div>

        {/* 생성 버튼 */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>AI가 고품질 문제를 생성 중입니다... (최대 30초 소요)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span>{count}문제 AI 생성하기</span>
            </>
          )}
        </button>

      </div>

      {/* 에러 메시지 */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 생성된 문제지 뷰어 */}
      {problems.length > 0 && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          
          {/* 시험지 툴바 */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-50/70 p-4 rounded-2xl border border-blue-100 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-[#1d1d1f]">
                생성 완료 ({problems.length}문항)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 rounded-xl text-xs font-semibold border border-gray-200 hover:bg-gray-50 transition-colors shadow-xs"
              >
                {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showAnswers ? "정답/해설 가리기" : "정답/해설 보기"}
              </button>

              <button
                onClick={handleDownloadHWP}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1d1d1f] text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4 text-blue-400" />
                한글(HWP) 다운로드
              </button>
            </div>
          </div>

          {/* 문제 리스트 */}
          <div className="flex flex-col gap-6">
            {problems.map((p, idx) => (
              <div key={p.id || idx} className="bg-gray-50/60 p-6 rounded-2xl border border-gray-100 flex flex-col gap-4">
                
                {/* 문제 제목 */}
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="text-base font-semibold text-[#1d1d1f] leading-relaxed pt-0.5">
                    {p.question}
                  </div>
                </div>

                {/* 객관식 보기 (있는 경우) */}
                {p.options && p.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pl-10 text-sm text-gray-700">
                    {p.options.map((opt, optIdx) => (
                      <div key={optIdx} className="bg-white px-3 py-2 rounded-lg border border-gray-200/80">
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                {/* 정답 및 상세 해설 (토글시 노출) */}
                {showAnswers && (
                  <div className="mt-2 pl-10 flex flex-col gap-2 pt-4 border-t border-gray-200/60">
                    <div className="text-sm font-bold text-blue-700">
                      [정답] {p.answer}
                    </div>
                    {p.hint && (
                      <div className="text-xs text-gray-500">
                        💡 <b>힌트:</b> {p.hint}
                      </div>
                    )}
                    <div className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-200/80 leading-relaxed whitespace-pre-wrap">
                      <b>📝 상세 풀이:</b><br />
                      {p.solution}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
