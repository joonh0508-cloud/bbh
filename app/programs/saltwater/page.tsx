"use client";

import { useState } from "react";
import { Droplet, Info } from "lucide-react";

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
    { id: 1, unknown: "concentration", water: "90", salt: "10", concentration: "" },
    { id: 2, unknown: "salt", water: "190", salt: "", concentration: "5" },
  ]);

  const updateBeaker = (id: number, field: keyof BeakerState, value: string) => {
    setBeakers((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        
        const updated = { ...b, [field]: value };
        
        // 미지수 변경 시 입력 필드 초기화 (선택적)
        if (field === 'unknown') {
          if (value === 'concentration') {
            updated.concentration = '';
            if(!updated.water) updated.water = '90';
            if(!updated.salt) updated.salt = '10';
          } else if (value === 'salt') {
            updated.salt = '';
            if(!updated.water) updated.water = '190';
            if(!updated.concentration) updated.concentration = '5';
          } else if (value === 'water') {
            updated.water = '';
            if(!updated.salt) updated.salt = '10';
            if(!updated.concentration) updated.concentration = '10';
          }
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
      // C = x / (W + x) * 100
      // C(W + x) = 100x => CW + Cx = 100x => CW = x(100 - C) => x = CW / (100 - C)
      const res = (C * W) / (100 - C);
      return { 
        value: res, 
        equation: `${C} = (x / (${W} + x)) × 100\n⇒ x = ${res.toFixed(1)}g` 
      };
    } else {
      // unknown === "water"
      if (isNaN(S) || isNaN(C) || C <= 0 || C > 100) return { value: 0, equation: `x = ?` };
      // C = S / (x + S) * 100
      // C(x + S) = 100S => Cx + CS = 100S => Cx = S(100 - C) => x = S(100 - C) / C
      const res = (S * (100 - C)) / C;
      return { 
        value: res, 
        equation: `${C} = (${S} / (x + ${S})) × 100\n⇒ x = ${res.toFixed(1)}g` 
      };
    }
  };

  return (
    <div className="flex flex-col gap-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
      
      {/* 헤더 설명 영역 */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] mb-2">
          소금물의 농도 시뮬레이션
        </h2>
        <p className="text-gray-500">
          두 개의 비이커를 통해 미지수(x)를 설정하고 농도 공식을 직관적으로 이해해 보세요.
          <br/>
          <span className="text-blue-600 font-medium">농도(%) = 소금 / (물 + 소금) × 100</span>
        </p>
      </div>

      {/* 비이커 렌더링 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {beakers.map((beaker, index) => {
          const result = calculateResult(beaker);
          
          // 시각화를 위한 값 계산
          const displayW = beaker.unknown === 'water' ? result.value : parseFloat(beaker.water) || 0;
          const displayS = beaker.unknown === 'salt' ? result.value : parseFloat(beaker.salt) || 0;
          const displayC = beaker.unknown === 'concentration' ? result.value : parseFloat(beaker.concentration) || 0;
          
          const totalAmount = displayW + displayS;
          const fillPercentage = Math.min(Math.max((totalAmount / 500) * 100, 10), 100); // 500g을 100% 기준으로 시각화
          const colorIntensity = Math.min(Math.max(displayC / 30, 0.1), 1); // 30%를 가장 진한 색으로

          return (
            <div key={beaker.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col gap-6 relative overflow-hidden">
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#1d1d1f]">비이커 {index + 1}</h3>
                
                {/* 미지수 선택 드롭다운 */}
                <select 
                  value={beaker.unknown}
                  onChange={(e) => updateBeaker(beaker.id, 'unknown', e.target.value)}
                  className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f]"
                >
                  <option value="concentration">미지수: 농도(%)</option>
                  <option value="salt">미지수: 소금(g)</option>
                  <option value="water">미지수: 물(g)</option>
                </select>
              </div>

              <div className="flex gap-6">
                {/* 비이커 시각화 (CSS) */}
                <div className="w-24 h-40 bg-white rounded-b-2xl border-2 border-t-0 border-gray-300 relative flex flex-col justify-end overflow-hidden shadow-inner shrink-0">
                  <div 
                    className="w-full transition-all duration-700 ease-in-out flex flex-col justify-end items-center pb-2"
                    style={{ 
                      height: `${fillPercentage}%`,
                      backgroundColor: `rgba(0, 102, 204, ${colorIntensity})`
                    }}
                  >
                    {/* 소금 파티클 효과 (농도에 비례) */}
                    {displayS > 0 && (
                      <div className="absolute bottom-2 flex flex-wrap justify-center gap-1 w-full px-2 opacity-50">
                        {Array.from({ length: Math.min(Math.floor(displayS / 5), 15) }).map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* 눈금선 */}
                  <div className="absolute left-0 top-1/4 w-2 h-px bg-gray-300"></div>
                  <div className="absolute left-0 top-2/4 w-3 h-px bg-gray-300"></div>
                  <div className="absolute left-0 top-3/4 w-2 h-px bg-gray-300"></div>
                </div>

                {/* 입력 폼 및 결과 */}
                <div className="flex-1 flex flex-col gap-3">
                  
                  {/* 물 입력 */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-500 w-12">물(g)</label>
                    {beaker.unknown === 'water' ? (
                      <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm font-bold text-blue-700">
                        x (미지수)
                      </div>
                    ) : (
                      <input 
                        type="number" 
                        value={beaker.water}
                        onChange={(e) => updateBeaker(beaker.id, 'water', e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-[#1d1d1f]"
                        placeholder="예: 90"
                      />
                    )}
                  </div>

                  {/* 소금 입력 */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-500 w-12">소금(g)</label>
                    {beaker.unknown === 'salt' ? (
                      <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm font-bold text-blue-700">
                        x (미지수)
                      </div>
                    ) : (
                      <input 
                        type="number" 
                        value={beaker.salt}
                        onChange={(e) => updateBeaker(beaker.id, 'salt', e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-[#1d1d1f]"
                        placeholder="예: 10"
                      />
                    )}
                  </div>

                  {/* 농도 입력 */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-500 w-12">농도(%)</label>
                    {beaker.unknown === 'concentration' ? (
                      <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm font-bold text-blue-700">
                        x (미지수)
                      </div>
                    ) : (
                      <input 
                        type="number" 
                        value={beaker.concentration}
                        onChange={(e) => updateBeaker(beaker.id, 'concentration', e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-[#1d1d1f]"
                        placeholder="예: 10"
                      />
                    )}
                  </div>

                </div>
              </div>

              {/* 결과 수식 영역 */}
              <div className="mt-2 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
                  <Info className="w-3.5 h-3.5" />
                  계산 과정
                </div>
                <div className="text-[#1d1d1f] font-mono text-sm whitespace-pre-wrap">
                  {result.equation}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
