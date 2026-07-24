"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ConfigState {
  mainTitle: string;
  subDescription: string;
  tab1Name: string;
  tab2Name: string;
  tab3Name: string;
  tab4Name: string;
}

const defaultConfig: ConfigState = {
  mainTitle: "수학이 쉬워지는 시간",
  subDescription: "선생님과 학생 모두를 위한 직관적이고 깔끔한 학습 플랫폼입니다. 필요한 기능을 마음껏 추가해 보세요.",
  tab1Name: "거리·속력·시간",
  tab2Name: "소금물의 농도",
  tab3Name: "도형의 넓이 (예정)",
  tab4Name: "함수 그래프 (예정)",
};

interface ConfigContextType {
  config: ConfigState;
  updateConfig: (newConfig: ConfigState) => void;
  isLoaded: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ConfigState>(defaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 앱 로드 시 로컬 스토리지에서 설정값을 불러옵니다.
    const storedConfig = localStorage.getItem("math-app-config");
    if (storedConfig) {
      try {
        setConfig(JSON.parse(storedConfig));
      } catch (e) {
        console.error("Failed to parse config", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const updateConfig = (newConfig: ConfigState) => {
    setConfig(newConfig);
    localStorage.setItem("math-app-config", JSON.stringify(newConfig));
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, isLoaded }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
