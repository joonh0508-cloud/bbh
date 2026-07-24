"use client";

import { useState } from "react";
import { Info, Calculator, CheckCircle2 } from "lucide-react";

type UnknownType = "water" | "salt" | "concentration";

interface BeakerState {
  id: number;
  unknown: UnknownType;
  water: string;
  salt: string;
  concentration: string;
}

export default function SaltwaterProgram() {
  const [beakers, setBeakers] = useState<BeakerState[]>([
    { id: 1, unknown: "water", water: "", salt: "20", concentration: "10" },
    { id: 2, unknown: "water", water: "", salt: "30", concentration: "15" },
  ]);

  const [useSharedUnknown, setUseSharedUnknown] = useState<boolean>(true);

  const updateBeaker = (id: number, field: keyof BeakerState, value: string) => {
    setBeakers((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        
        const updated = { ...b, [field]: value };
        
        if (field === "unknown") {
          if (value === "concentration") {
            updated.concentration = "";
            if (!updated.water) updated.water = "90";
            if (!updated.salt) updated.salt = "10";
          } else if (value === "salt") {
            updated.salt = "";
            if (!updated.water) updated.water = "190";
            if (!updated.concentration) updated.concentration = "5";
          } else if (value === "water") {
            updated.water = "";
            if (!updated.salt) updated.salt = "10";
            if (!updated.concentration) updated.concentration = "10";
          }
        }
        
        return updated;
      })
    );
  };

  // 동일한 미지수로 일괄 변경
  const handleSetSharedUnknown = (unknownType: UnknownType) => {
    setUseSharedUnknown(true);
    setBeakers((prev) =>
      prev.map((b) => {
        const updated = { ...b, unknown: unknownType };
        if (unknownType === "concentration") {
          updated.concentration = "";
          if (!updated.water) updated.water = b.id === 1 ? "90" : "180";
          if (!updated.salt) updated.salt = b.id === 1 ? "10" : "20";
        } else if (unknownType === "salt") {
          updated.salt = "";
          if (!updated.water) updated.water = b.id === 1 ? "90" : "180";
          if (!updated.concentration) updated.concentration = b.id === 1 ? "10" : "10";
        } else if (unknownType === "water") {
          updated.water = "";
          if (!updated.salt) updated.salt = b.id === 1 ? "20" : "30";
          if (!updated.concentration) updated.concentration = b.id === 1 ? "10" : "15";
        }
        return updated;
      })
    );
  };

  const calculateResult = (b: BeakerState) => {
    const W = parseFloat(b.water);
    const S = parseFloat(b.salt);
    const C = parseFloat(b.concentration);

    if (b.unknown === "concentration") {
      if (isNaN(W) || isNaN(S) || W + S === 0) return { value: 0, equation: `x = ?` };
      const res = (S / (W + S)) * 100;
      return { 
        value: res, 
        equation: `x = (${S} / (${W} + ${S})) × 100 = ${res.toFixed(1)}%` 
      };
    } else if (b.unknown === "salt") {
      if (isNaN(W) || isNaN(C) || C >= 100) return { value: 0, equation: `x = ?` };
      const res = (C * W) / (100 - C);
      return { 
        value: res, 
        equation: `${C} = (x / (${W} + x)) × 100\n⇒ x = ${res.toFixed(1)}g` 
      };
    } else {
      // unknown === "water"
      if (isNaN(S) || isNaN(C) || C <= 0 || C >= 100) return { value: 0, equation: `x = ?` };
      const res = (S * (100 - C)) / C;
      return { 
        value: res, 
        equation: `${C} = (${S} / (x + ${S})) × 100\n⇒ x = ${res.toFixed(1)}g` 
      };
    }
  };

  const isSameUnknown = beakers[0].unknown === beakers[1].unknown;
  const sharedUnknownType = beakers[0].unknown;

  // 두 비이커를 혼합할 때의 일차방정식 세우기 로직
  const getLinearEquationText = () => {
    const b1 = beakers[0];
    const b2 = beakers[1];
    const res1 = calculateResult(b1);
    const res2 = calculateResult(b2);

    if (sharedUnknownType === "water") {
      // 물의 양이 공통 미지수 x인 경우
      const S1 = parseFloat(b1.salt) || 0;
      const C1 = parseFloat(b1.concentration) || 0;
      const S2 = parseFloat(b2.salt) || 0;
      const C2 = parseFloat(b2.concentration) || 0;

      return {
        title: "물(g)을 미지수 x로 둔 일차방정식",
        eq1: `비이커 1 식: ${C1} / 100 = ${S1} / (x + ${S1})`,
        eq2: `비이커 2 식: ${C2} / 100 = ${S2} / (x + ${S2})`,
        solved: `비이커 1 해: x = ${res1.value.toFixed(1)}g | 비이커 2 해: x = ${res2.value.toFixed(1)}g`,
        explanation: `공식을 1차 방정식으로 변형: ${C1}(x + ${S1}) = 100 × ${S1} ⇒ ${C1}x + ${C1 * S1} = ${100 * S1}`
      };
    } else if (sharedUnknownType === "salt") {
      // 소금의 양이 공통 미지수 x인 경우
      const W1 = parseFloat(b1.water) || 0;
      const C1 = parseFloat(b1.concentration) || 0;
      const W2 = parseFloat(b2.water) || 0;
      const C2 = parseFloat(b2.concentration) || 0;

      return {
        title: "소금(g)을 미지수 x로 둔 일차방정식",
        eq1: `비이커 1 식: ${C1} = (x / (${W1} + x)) × 100`,
        eq2: `비이커 2 식: ${C2} = (x / (${W2} + x)) × 100`,
        solved: `비이커 1 해: x = ${res1.value.toFixed(1)}g | 비이커 2 해: x = ${res2.value.toFixed(1)}g`,
        explanation: `1차 방정식 풀이: ${C1}(${W1} + x) = 100x ⇒ ${C1 * W1} + ${C1}x = 100x ⇒ ${100 - C1}x = ${C1 * W1}`
      };
    } else {
      // 농도가 공통 미지수 x인 경우
      const W1 = parseFloat(b1.water) || 0;
      const S1 = parseFloat(b1.salt) || 0;
      const W2 = parseFloat(b2.water) || 0;
      const S2 = parseFloat(b2.salt) || 0;

      return {
        title: "농도(%)를 미지수 x로 둔 일차방정식",
        eq1: `비이커 1 식: x = (${S1} / (${W1} + ${S1})) × 100`,
        eq2: `비이커 2 식: x = (${S2} / (${W2} + ${S2})) × 100`,
        solved: `비이커 1 해: x = ${res1.value.toFixed(1)}% | 비이커 2 해: x = ${res2.value.toFixed(1)}%`,
        explanation: `일차식 계산: x × (${W1 + S1}) = ${S1 * 100}`
      };
    }
  };

  const linearEqInfo = getLinearEquationText();

  return (
    <div className="flex flex-col gap-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
      
      {/* 헤더 설명 영역 */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] mb-2">
          소금물의 농도 & 일차방정식 시뮬레이션
        </h2>
        <p className="text-gray-500">
          비이커의 미지수(x)를 선택하고 일차방정식을 직접 도출해 보세요.
          <br/>
          <span className="text-blue-600 font-medium">농도(%) = 소금 / (물 + 소금) × 100</span>
        </p>
      </div>

      {/* 동일 미지수(x) 설정 컨트롤 바 */}
      <div className="bg-blue-50/70 border border-blue-100 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1d1d1f]">
          <Calculator className="w-5 h-5 text-blue-600" />
          <span>동일 미지수(x) 선택 & 일차방정식 세우기</span>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleSetSharedUnknown("water")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              isSameUnknown && sharedUnknownType === "water"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            공통 미지수: 물(g)
          </button>
          <button
            onClick={() => handleSetSharedUnknown("salt")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              isSameUnknown && sharedUnknownType === "salt"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            공통 미지수: 소금(g)
          </button>
          <button
            onClick={() => handleSetSharedUnknown("concentration")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              isSameUnknown && sharedUnknownType === "concentration"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            공통 미지수: 농도(%)
          </button>
        </div>
      </div>

      {/* 비이커 렌더링 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {beakers.map((beaker, index) => {
          const result = calculateResult(beaker);
          
          const displayW = beaker.unknown === "water" ? result.value : parseFloat(beaker.water) || 0;
          const displayS = beaker.unknown === "salt" ? result.value : parseFloat(beaker.salt) || 0;
          const displayC = beaker.unknown === "concentration" ? result.value : parseFloat(beaker.concentration) || 0;
          
          const totalAmount = displayW + displayS;
          const fillPercentage = Math.min(Math.max((totalAmount / 500) * 100, 10), 100);
          const colorIntensity = Math.min(Math.max(displayC / 30, 0.1), 1);

          return (
            <div key={beaker.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col gap-6 relative overflow-hidden">
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#1d1d1f]">비이커 {index + 1}</h3>
                
                <select 
                  value={beaker.unknown}
                  onChange={(e) => updateBeaker(beaker.id, "unknown", e.target.value as UnknownType)}
                  className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f]"
                >
                  <option value="concentration">미지수: 농도(%)</option>
                  <option value="salt">미지수: 소금(g)</option>
                  <option value="water">미지수: 물(g)</option>
                </select>
              </div>

              <div className="flex gap-6">
                <div className="w-24 h-40 bg-white rounded-b-2xl border-2 border-t-0 border-gray-300 relative flex flex-col justify-end overflow-hidden shadow-inner shrink-0">
                  <div 
                    className="w-full transition-all duration-700 ease-in-out flex flex-col justify-end items-center pb-2"
                    style={{ 
                      height: `${fillPercentage}%`,
                      backgroundColor: `rgba(0, 102, 204, ${colorIntensity})`
                    }}
                  >
                    {displayS > 0 && (
                      <div className="absolute bottom-2 flex flex-wrap justify-center gap-1 w-full px-2 opacity-50">
                        {Array.from({ length: Math.min(Math.floor(displayS / 5), 15) }).map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="absolute left-0 top-1/4 w-2 h-px bg-gray-300"></div>
                  <div className="absolute left-0 top-2/4 w-3 h-px bg-gray-300"></div>
                  <div className="absolute left-0 top-3/4 w-2 h-px bg-gray-300"></div>
                </div>

                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-500 w-12">물(g)</label>
                    {beaker.unknown === "water" ? (
                      <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm font-bold text-blue-700">
                        x (미지수)
                      </div>
                    ) : (
                      <input 
                        type="number" 
                        value={beaker.water}
                        onChange={(e) => updateBeaker(beaker.id, "water", e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-[#1d1d1f]"
                        placeholder="예: 90"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-500 w-12">소금(g)</label>
                    {beaker.unknown === "salt" ? (
                      <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm font-bold text-blue-700">
                        x (미지수)
                      </div>
                    ) : (
                      <input 
                        type="number" 
                        value={beaker.salt}
                        onChange={(e) => updateBeaker(beaker.id, "salt", e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-[#1d1d1f]"
                        placeholder="예: 10"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-500 w-12">농도(%)</label>
                    {beaker.unknown === "concentration" ? (
                      <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm font-bold text-blue-700">
                        x (미지수)
                      </div>
                    ) : (
                      <input 
                        type="number" 
                        value={beaker.concentration}
                        onChange={(e) => updateBeaker(beaker.id, "concentration", e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-[#1d1d1f]"
                        placeholder="예: 10"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-2 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
                  <Info className="w-3.5 h-3.5" />
                  비이커 {index + 1} 수식
                </div>
                <div className="text-[#1d1d1f] font-mono text-sm whitespace-pre-wrap">
                  {result.equation}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* 동일 미지수 일차방정식 해석 카드 */}
      {isSameUnknown && (
        <div className="bg-[#1d1d1f] text-white p-6 rounded-3xl shadow-lg border border-gray-800 flex flex-col gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold tracking-tight">{linearEqInfo.title}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
            <div className="bg-gray-800/80 p-4 rounded-xl font-mono text-sm border border-gray-700">
              <span className="text-gray-400 block text-xs mb-1">비이커 1 일차방정식</span>
              {linearEqInfo.eq1}
            </div>
            <div className="bg-gray-800/80 p-4 rounded-xl font-mono text-sm border border-gray-700">
              <span className="text-gray-400 block text-xs mb-1">비이커 2 일차방정식</span>
              {linearEqInfo.eq2}
            </div>
          </div>

          <div className="bg-blue-950/50 p-4 rounded-xl border border-blue-800/50 font-mono text-sm text-blue-200">
            <span className="text-blue-400 font-bold block text-xs mb-1">방정식 변형 과정</span>
            {linearEqInfo.explanation}
          </div>

          <div className="text-right text-xs text-gray-400 pt-2 border-t border-gray-800">
            {linearEqInfo.solved}
          </div>
        </div>
      )}

    </div>
  );
}
