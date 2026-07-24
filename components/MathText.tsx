"use client";

import React from "react";
import katex from "katex";

interface MathTextProps {
  content: string;
  className?: string;
}

export default function MathText({ content, className = "" }: MathTextProps) {
  if (!content) return null;

  // $$...$$ 또는 \[...\] (블록 수식) 과 $...$ 또는 \(...\) (인라인 수식) 추출 정규식
  const regex = /(\$\$.*?\$\$|\\\[.*?\\\]|\$.*?\$|\\\([^)]*?\\\))/gs;
  const parts = content.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (!part) return null;

        // 블록 수식 ($$...$$ 또는 \[...\])
        if (
          (part.startsWith("$$") && part.endsWith("$$")) ||
          (part.startsWith("\\[") && part.endsWith("\\]"))
        ) {
          const math = part
            .replace(/^\$\$/, "")
            .replace(/\$\$$/, "")
            .replace(/^\\\[/, "")
            .replace(/\\\]$/, "")
            .trim();
          try {
            const html = katex.renderToString(math, {
              displayMode: true,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                className="block my-2 overflow-x-auto text-center"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            return <code key={index}>{part}</code>;
          }
        }

        // 인라인 수식 ($...$ 또는 \(...\))
        if (
          (part.startsWith("$") && part.endsWith("$") && part.length > 2) ||
          (part.startsWith("\\(") && part.endsWith("\\)"))
        ) {
          const math = part
            .replace(/^\$/, "")
            .replace(/\$$/, "")
            .replace(/^\\\(/, "")
            .replace(/\\\)$/, "")
            .trim();
          try {
            const html = katex.renderToString(math, {
              displayMode: false,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                className="inline-block px-1"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            return <code key={index}>{part}</code>;
          }
        }

        // 일반 텍스트
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
