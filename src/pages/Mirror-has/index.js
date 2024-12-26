import React, { useEffect, useState } from "react";
import { javascript } from "@codemirror/lang-javascript"; // 语言支持
import { highlightTree, HighlightStyle, tags } from "@codemirror/highlight"; // 高亮引擎
import { oneDark } from "@codemirror/theme-one-dark"; // 内置主题

// 定义样式映射
const highlightStyle = HighlightStyle.define([
  { tag: tags.keyword, class: "cm-keyword" },
  { tag: tags.variableName, class: "cm-variableName" },
  { tag: tags.string, class: "cm-string" },
  { tag: tags.comment, class: "cm-comment" },
  { tag: tags.number, class: "cm-number" },
  { tag: tags.operator, class: "cm-operator" },
  { tag: tags.function(tags.variableName), class: "cm-function" },
]);

// CSS 样式
const styles = `
.cm-keyword { color: #d73a49; font-weight: bold; }
.cm-variableName { color: #6f42c1; }
.cm-string { color: #032f62; }
.cm-comment { color: #6a737d; font-style: italic; }
.cm-number { color: #005cc5; }
.cm-operator { color: #d73a49; }
.cm-function { color: #005cc5; }
`;

function MirrorHas({ code }) {
  const [highlightedHTML, setHighlightedHTML] = useState("");  // 存储高亮后的 HTML

  useEffect(() => {
    const parseTree = javascript.parser.parse(code);  // 解析代码生成语法树
    let highlighted = "";  // 用来存放高亮 HTML

    // 使用高亮引擎进行高亮
    highlightTree(parseTree, highlightStyle.match, (from, to, style) => {
      const snippet = code.slice(from, to);
      highlighted += `<span class="${style}">${snippet}</span>`;  // 生成高亮 HTML
    });

    setHighlightedHTML(highlighted);  // 更新高亮后的代码
  }, [code]);  // 当代码变化时重新渲染高亮

  return (
    <div>
      {/* 插入样式 */}
      <style>{styles}</style>
      {/* 渲染高亮代码 */}
      <pre
        dangerouslySetInnerHTML={{ __html: highlightedHTML }}
        style={{
          background: "#f6f8fa",
          padding: "10px",
          borderRadius: "5px",
          overflowX: "auto",
        }}
      ></pre>
    </div>
  );
}

export default MirrorHas;
