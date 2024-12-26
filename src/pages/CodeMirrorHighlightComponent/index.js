import React, { useState, useRef } from 'react';
// import 'codemirror/lib/codemirror.css';  // 导入基本样式
// import 'codemirror/theme/monokai.css';   // 导入主题样式
import 'codemirror/mode/javascript/javascript'; // 导入 JavaScript 模式
import CodeMirror from 'codemirror'; // 导入 CodeMirror

const CodeMirrorHighlighter = () => {
  const [code, setCode] = useState(`function greet() {\n  console.log("Hello, CodeMirror!");\n}`);
  const containerRef = useRef(null); // 用于渲染高亮代码的容器
  const themePrefix = 'cm-s-midnight'; 

  // 高亮函数
  const getHighlightedHtml = (code, mode, theme,container) => {
    if (!container) {
      throw new Error("A container element is required to render highlighted code.");
    }

    const pre = document.createElement('pre');
    pre.style.backgroundColor = '#efefef';  // 设置背景色
    pre.style.color = '##d0d0d0';  // 设置文字颜色
    pre.style.padding = '10px';
    pre.style.borderRadius = '15px';

    pre.className=theme
    // 使用 runMode 高亮代码
    CodeMirror.runMode(code, mode, (text, style) => {
      
      const span = document.createElement('span');
      if (style) {
        // span.className = `${themePrefix} cm-${style}`; 
        console.log(`Token text: ${text}, Style: ${style} codemirror`); // 打印 token 文本和其对应的样式

        span.className = `cm-${style}`;  // 添加高亮样式类
      }
      span.textContent = text;
      pre.appendChild(span);
      console.log(span);
      
    });

    container.innerHTML = '';  // 清空容器内容
    container.appendChild(pre);  // 将高亮的代码添加到容器中
  };
  

  // 处理按钮点击，进行高亮
  const handleHighlight = () => {
    getHighlightedHtml(code, 'javascript', themePrefix,containerRef.current);
  };

  // 处理文本框的输入
  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  return (
    <div>
      <h3>CodeMirror Syntax Highlighter</h3>
      <div id="code-container">
        <textarea
          id="code-input"
          rows="10"
          cols="50"
          value={code}
          onChange={handleCodeChange}
        />
        <button id="highlight-btn" onClick={handleHighlight}>Highlight Code</button>
      </div>
      <div id="output" ref={containerRef}></div>
    </div>
  );
};

export default CodeMirrorHighlighter;
