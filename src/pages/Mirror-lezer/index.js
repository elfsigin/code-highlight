import React, { useEffect, useState } from "react";
import { javascriptLanguage } from "@codemirror/lang-javascript";  // CodeMirror JavaScript 语言解析器
import { HighlightStyle, tags as t ,highlightTree} from "@codemirror/highlight";  // CodeMirror 高亮模块

// 定义样式映射
const highlightStyle = HighlightStyle.define([
  { tag: t.keyword, class: "cm-keyword" },
  { tag: t.variableName, class: "cm-variableName" },
  { tag: t.string, class: "cm-string" },
  { tag: t.comment, class: "cm-comment" },
  { tag: t.number, class: "cm-number" },
  { tag: t.operator, class: "cm-operator" },
  { tag: t.function(t.variableName), class: "cm-function" },
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

function MirrorHight({ code }) {
  const [highlightedHTML, setHighlightedHTML] = useState("");  // 存储高亮后的 HTML

  useEffect(() => {
    // 解析代码生成语法树
    const parseTree = javascriptLanguage.parser.parse(code);

    let highlighted = "";  // 用来存放高亮后的 HTML

    // 使用 highlightTree 高亮代码
    highlightTree(parseTree, highlightStyle.match, (from, to, style) => {
      const snippet = code.slice(from, to);
      highlighted += `<span class="${style}">${snippet}</span>`;
    });

    setHighlightedHTML(highlighted);  // 更新高亮后的代码
  }, [code]);

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

export default MirrorHight;
