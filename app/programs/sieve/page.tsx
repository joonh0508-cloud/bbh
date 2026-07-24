"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ChevronRight, CheckCircle2, Sliders } from "lucide-react";

// n 이하의 소수 구하기 헬퍼 함수
function getPrimesUpTo(limit: number): number[] {
  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) {
    let isPrime = true;
    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }
  return primes;
}

export default function SieveProgram() {
  const [maxNum, setMaxNum] = useState<number>(100);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // sqrt(maxNum) 이하의 소수 단계 자동 계산
  const limit = Math.floor(Math.sqrt(maxNum));
  const primeSteps = getPrimesUpTo(limit);
  const maxStep = primeSteps.length + 1; // 0 ~ primeSteps.length + 1(완료)

  // maxNum 변경 시 초기화
  const handleMaxNumChange = (newMax: number) => {
    setIsPlaying(false);
    setStepIndex(0);
    setMaxNum(newMax);
  };

  // 자동 재생 타이머
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= maxStep) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, maxStep]);

  // 각 숫자의 상태 계산 (1~maxNum)
  const getNumberState = (num: number) => {
    if (num === 1) return { status: "one", label: "소수 아님 (1)" };

    // 현재 단계까지 지워진 합성수인지 검사
    for (let i = 0; i < stepIndex && i < primeSteps.length; i++) {
      const p = primeSteps[i];
      if (num > p && num % p === 0) {
        return { status: "eliminated", eliminatedBy: p, label: `${p}의 배수` };
      }
    }

    // 현재 단계에서 선택된 기준 소수인 경우
    if (stepIndex > 0 && stepIndex <= primeSteps.length) {
      const currentPrime = primeSteps[stepIndex - 1];
      if (num === currentPrime) {
        return { status: "current-prime", label: `기준 소수 ${currentPrime}` };
      }
    }

    // 이미 확정된 소수들 (이전 단계의 주 소수들)
    for (let i = 0; i < stepIndex && i < primeSteps.length; i++) {
      if (num === primeSteps[i]) {
        return { status: "confirmed-prime", label: `확정 소수 ${num}` };
      }
    }

    // 완주 단계일 때 남은 모든 미제거 수는 소수!
    if (stepIndex === maxStep) {
      return { status: "confirmed-prime", label: `확정 소수 ${num}` };
    }

    return { status: "unprocessed", label: "미처리" };
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  const numbers = Array.from({ length: maxNum }, (_, i) => i + 1);

  // 확정된 소수 목록 구하기
  const getConfirmedPrimes = () => {
    return numbers.filter((num) => {
      const st = getNumberState(num);
      return st.status === "confirmed-prime" || st.status === "current-prime";
    });
  };

  const confirmedPrimes = getConfirmedPrimes();

  return (
    <div className="flex flex-col gap-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
      
      {/* 헤더 설명 영역 */}
      <div className="text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-3">
          에라토스테네스의 체
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] mb-2">
          체(Sieve)로 소수(Prime Number) 걸러내기
        </h2>
        <p className="text-gray-500">
          고대 그리스의 수학자 에라토스테네스가 고안한 소수 탐색 알고리즘입니다.
          소수의 배수들을 순차적으로 걸러내어 소수만 남깁니다.
        </p>
      </div>

      {/* 전체 수(N) 설정 패널 */}
      <div className="bg-blue-50/70 border border-blue-100 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1d1d1f]">
          <Sliders className="w-5 h-5 text-blue-600" />
          <span>전체 수 범위 설정 (1 ~ {maxNum})</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {[30, 50, 100, 120, 150, 200].map((preset) => (
            <button
              key={preset}
              onClick={() => handleMaxNumChange(preset)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                maxNum === preset
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              1 ~ {preset}
            </button>
          ))}
          
          {/* 직접 입력 */}
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gray-200 text-xs">
            <span className="text-gray-400">직접입력:</span>
            <input
              type="number"
              min="10"
              max="300"
              value={maxNum}
              onChange={(e) => {
                const val = Math.min(Math.max(parseInt(e.target.value) || 10, 10), 300);
                handleMaxNumChange(val);
              }}
              className="w-12 text-center font-bold focus:outline-none text-[#1d1d1f]"
            />
          </div>
        </div>
      </div>

      {/* 컨트롤 패널 */}
      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* 단계 안내 */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[#1d1d1f]">
            {stepIndex === 0 && "1단계: 1은 소수가 아니므로 제외합니다."}
            {stepIndex > 0 && stepIndex <= primeSteps.length && (
              <>
                <span className="text-blue-600 font-extrabold">{primeSteps[stepIndex - 1]}</span>의 배수를 체로 걸러냅니다. (√{maxNum} ≈ {limit} 이하의 소수)
              </>
            )}
            {stepIndex === maxStep && `탐색 완료! 1~${maxNum} 사이의 모든 소수들을 찾았습니다.`}
          </span>
        </div>

        {/* 재생 조작 버튼들 */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-gray-700 rounded-xl text-xs font-semibold border border-gray-200 hover:bg-gray-100 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            초기화
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            {isPlaying ? <><Pause className="w-3.5 h-3.5" /> 일시정지</> : <><Play className="w-3.5 h-3.5" /> 자동 재생</>}
          </button>

          <button
            disabled={stepIndex >= maxStep}
            onClick={() => setStepIndex((prev) => Math.min(prev + 1, maxStep))}
            className="flex items-center gap-1 px-4 py-2 bg-[#1d1d1f] text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-40"
          >
            <span>다음 단계</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 수 그리드 렌더링 */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 md:gap-3">
        {numbers.map((num) => {
          const state = getNumberState(num);
          let bgClass = "bg-white text-gray-700 border-gray-200 hover:border-blue-400";

          if (state.status === "one") {
            bgClass = "bg-gray-100 text-gray-400 border-gray-100 line-through";
          } else if (state.status === "eliminated") {
            bgClass = "bg-red-50 text-red-300 border-red-100 line-through scale-95 opacity-60";
          } else if (state.status === "current-prime") {
            bgClass = "bg-blue-600 text-white border-blue-600 font-bold scale-105 shadow-md animate-pulse";
          } else if (state.status === "confirmed-prime") {
            bgClass = "bg-blue-500 text-white border-blue-500 font-bold shadow-sm";
          }

          return (
            <div
              key={num}
              className={`h-11 md:h-12 rounded-xl border text-sm font-semibold flex items-center justify-center transition-all duration-300 ${bgClass}`}
            >
              {num}
            </div>
          );
        })}
      </div>

      {/* 상태 범례 (Legend) */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-blue-600"></div>
          <span>기준/확정 소수</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-red-100 border border-red-200"></div>
          <span>걸러낸 합성수 (배수)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-gray-100"></div>
          <span>소수 아님 (1)</span>
        </div>
      </div>

      {/* 발견된 소수 결과 카드 */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-[#1d1d1f]">
              1~{maxNum} 범위의 찾은 소수 ({confirmedPrimes.length}개)
            </h3>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2">
          {confirmedPrimes.length === 0 ? (
            <span className="text-sm text-gray-400">다음 단계 버튼을 눌러 소수를 찾아보세요.</span>
          ) : (
            confirmedPrimes.map((prime) => (
              <span
                key={prime}
                className="px-3 py-1 bg-white border border-blue-200 text-blue-700 font-bold rounded-lg text-sm shadow-xs"
              >
                {prime}
              </span>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
