"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from "recharts";

export default function DstProgram() {
  const [speed, setSpeed] = useState<number>(50);

  // x축은 0에서 10시간까지로 설정
  const data = Array.from({ length: 11 }, (_, i) => ({
    time: i,
    distance: i * speed,
  }));

  return (
    <div className="flex flex-col gap-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
      
      {/* 헤더 설명 영역 */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] mb-2">
          거리 = 속력 × 시간
        </h2>
        <p className="text-gray-500">
          속력을 조절하면 시간에 따른 이동 거리의 변화(기울기)를 그래프로 확인할 수 있습니다.
        </p>
      </div>

      {/* 조작 및 수식 영역 (글래스모피즘 / 카드 UI) */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* 컨트롤 패널 */}
        <div className="flex-1 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-[#1d1d1f]">속력 설정 (km/h)</span>
            <span className="text-blue-600 font-bold text-lg">{speed} km/h</span>
          </div>
          
          <input
            type="range"
            min="10"
            max="150"
            step="10"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>10</span>
            <span>150</span>
          </div>
        </div>

        {/* 수식 시각화 패널 */}
        <div className="flex-1 bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex flex-col justify-center items-center">
          <span className="text-sm font-medium text-blue-600 mb-2">현재 관계식</span>
          <div className="text-3xl font-bold tracking-tight text-[#1d1d1f]">
            y = {speed}x
          </div>
          <span className="text-xs text-gray-500 mt-1">
            (y: 거리, x: 시간)
          </span>
        </div>
      </div>

      {/* 그래프 영역 */}
      <div className="w-full h-[400px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              type="number" 
              domain={[0, 10]}
              tickCount={11}
              stroke="#a3a3a3"
            >
              <Label value="시간 (h)" offset={-10} position="insideBottom" fill="#a3a3a3" fontSize={14} />
            </XAxis>
            <YAxis 
              domain={[0, 1500]}
              stroke="#a3a3a3"
            >
              <Label value="거리 (km)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="#a3a3a3" fontSize={14} />
            </YAxis>
            <Tooltip 
              formatter={(value: number) => [`${value} km`, '이동 거리']}
              labelFormatter={(label) => `${label}시간 후`}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line
              type="monotone"
              dataKey="distance"
              stroke="#0066cc"
              strokeWidth={3}
              dot={{ r: 4, fill: "#0066cc", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
