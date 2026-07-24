"use client";

import { useState } from "react";
import { useConfig } from "../app/context/ConfigContext";
import { X } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { config, updateConfig } = useConfig();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 폼 상태
  const [formData, setFormData] = useState(config);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      setError("");
      setFormData(config); // 로그인 성공 시 최신 config로 폼 데이터 초기화
    } else {
      setError("비밀번호가 일치하지 않습니다.");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    onClose();
    // 모달을 닫은 후 보안을 위해 인증 상태를 초기화합니다.
    setTimeout(() => {
      setIsAuthenticated(false);
      setPassword("");
    }, 300);
  };

  const handleCancel = () => {
    onClose();
    setTimeout(() => {
      setIsAuthenticated(false);
      setPassword("");
      setError("");
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#1d1d1f]">홈페이지 설정</h2>
          <button onClick={handleCancel} className="p-2 text-gray-400 hover:text-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 바디 */}
        <div className="p-6 overflow-y-auto">
          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4 py-8">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">관리자 인증</h3>
                <p className="text-sm text-gray-500">설정을 변경하려면 비밀번호를 입력하세요.</p>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 (초기값: admin123)"
                className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-[#1d1d1f]"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button type="submit" className="bg-[#1d1d1f] text-white rounded-xl py-3 font-semibold hover:bg-gray-800 transition-colors mt-2">
                확인
              </button>
            </form>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1d1d1f]">메인 타이틀</label>
                <input
                  type="text"
                  value={formData.mainTitle}
                  onChange={(e) => setFormData({ ...formData, mainTitle: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1d1d1f]">서브 설명(소개글)</label>
                <textarea
                  value={formData.subDescription}
                  onChange={(e) => setFormData({ ...formData, subDescription: e.target.value })}
                  rows={3}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] resize-none"
                />
              </div>

              <div className="border-t border-gray-100 my-2 pt-4">
                <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">프로그램 탭 이름 설정</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-600">탭 1</label>
                    <input
                      type="text"
                      value={formData.tab1Name}
                      onChange={(e) => setFormData({ ...formData, tab1Name: e.target.value })}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-[#1d1d1f]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-600">탭 2</label>
                    <input
                      type="text"
                      value={formData.tab2Name}
                      onChange={(e) => setFormData({ ...formData, tab2Name: e.target.value })}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-[#1d1d1f]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-600">탭 3 (예정)</label>
                    <input
                      type="text"
                      value={formData.tab3Name}
                      onChange={(e) => setFormData({ ...formData, tab3Name: e.target.value })}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-[#1d1d1f]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-600">탭 4 (예정)</label>
                    <input
                      type="text"
                      value={formData.tab4Name}
                      onChange={(e) => setFormData({ ...formData, tab4Name: e.target.value })}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-[#1d1d1f]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={handleCancel} className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-3 font-semibold hover:bg-gray-200 transition-colors">
                  취소
                </button>
                <button type="submit" className="flex-1 bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                  저장하기
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
