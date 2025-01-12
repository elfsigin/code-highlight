/*
 * @Author: yunlu.lai1@dbappsecurity.com.cn yunlu.lai1@dbappsecurity.com.cn
 * @Date: 2024-12-24 09:38:50
 * @LastEditors: yunlu.lai1@dbappsecurity.com.cn 2714838232@qq.com
 * @LastEditTime: 2025-01-08 16:19:44
 * @FilePath: \code-mirror\mirror-hight\src\utils\getHighlightedHtml.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python"; // Python
import "codemirror/mode/htmlmixed/htmlmixed"; // HTML
import "codemirror/mode/sql/sql"; // 导入 JavaScript 模式
import "codemirror/mode/clike/clike"; // Java 属于 clike 模式
import "codemirror/mode/shell/shell"; // Java 属于 clike 模式

import CodeMirror from "codemirror"; // 导入 CodeMirror
import "codemirror/addon/runmode/runmode.js"; // 引入 runmode.js

import "codemirror/addon/mode/simple.js";
import { stylesDefaultLog, stylesDefault } from "../theme/defaultcss";

//日志自定义高亮关键字
CodeMirror.defineSimpleMode("logLang", {
  start: [
    // ISO格式的日期和时间
    {
      regex: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}$/,
      token: "date",
    },
    {
      regex: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
      token: "date",
    },

    // 日志级别
    {
      regex: /\b(DEBUG|INFO|INFORMATION|WARN|WARNING|ERROR|FAIL|FAILURE)\b/,
      token: function (match) {
        return {
          DEBUG: "debug",
          INFO: "info",
          INFORMATION: "info",
          WARN: "warning",
          WARNING: "warning",
          ERROR: "error",
          FAIL: "error",
          FAILURE: "error",
        }[match[0]];
      },
    },

    // 标准 .Net 常量
    {
      regex: /\b(null|true|false)\b/,
      token: "constant",
    },

    // 数字常量
    {
      regex: /\b\d+\b/,
      token: "number",
    },

    // 字符串常量
    {
      regex: /['"][^'"]*['"]/,
      token: "string",
    },

    // GUID
    {
      regex: /\b[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}\b/,
      token: "guid",
    },

    // MAC地址
    {
      regex: /\b([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/,
      token: "mac",
    },

    // .Net 异常类型名称
    {
      regex: /\b[A-Z][a-zA-Z]+Exception\b/,
      token: "exception-type",
    },

    // .Net 异常堆栈跟踪
    {
      regex: /^\s+at\s+([a-zA-Z0-9_.]+)\s+\(([^:]+):(\d+):(\d+)\)/,
      token: ["function-name", "file-path", "line-number", "column-number"],
    },

    // 网址
    {
      regex: /\bhttps?:\/\/[^\s]+\b/,
      token: "url",
    },

    // 命名空间
    {
      regex: /\b[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*\b/,
      token: "namespace",
    },
  ],
});


export function getHighlightedHtml(
  code,
  mode,
  theme,
  customStyles = {},
  container,
  customHighlight = []
) {
  if (!container) {
    throw new Error(
      "A container element is required to render highlighted code."
    );
  }

  // 清空容器
  container.innerHTML = "";
  //代码：  代码行pre（CodeMirror-line）->大spna（presentation） ->各小span
  //行号：div（CodeMirror-gutter-wrapper-> div（CodeMirror-linenumber CodeMirror-gutter-elt 数字
  //大盒子 div divline（包括）
  //大盒子  div位gutter（position left：0）+ divline

  
  //包括一层大容器（槽号和代码行并列）
  const scrollDiv = document.createElement("div");
  scrollDiv.style.display = "flex";
  // scrollDiv.style.backgroundColor = '#353f58';
  scrollDiv.style.maxHeight = "500px";

  // 创建主容器(放置行号和槽号)
  const divContainer = document.createElement("div");
  divContainer.style.position = "relative";

  //创建gutter容器,存放行号槽(与lines同级)
  const DivGutter = document.createElement("div");
  DivGutter.style.position = "absolute";
  DivGutter.style.height = "500px";
  DivGutter.style.boxSizing = "content-box";
  DivGutter.style.width = "29px";
  DivGutter.style.background = "#3f4b69";
  DivGutter.style.left = "0px";
  // 创建lines容器(放置行code和槽号数字)
  const divContainerLines = document.createElement("div");
  divContainerLines.style.position = "relative";
  divContainerLines.style.marginLeft = "29px";
  divContainerLines.style.backgroundColor = "#353f58";
  divContainerLines.style.maxHeight = "500px";

  // 创建 <pre> 标签
  const pre = document.createElement("pre");
  pre.style.backgroundColor = "#353f58";
  pre.style.color = "#dcdcdc";
  pre.style.height = "500px";
  pre.style.overflowX = "auto";
  pre.style.lineHeight = "1.5em";
  pre.style.fontFamily = "monospace";
  //将DivGutter与codemirror-line并列
  divContainer.appendChild(DivGutter);
  // 创建 <style> 标签
  const styleTag = document.createElement("style");
  divContainer.appendChild(styleTag);
  // 合并样式
  let newStyles = mode === "logLang" ? stylesDefaultLog : stylesDefault;
  if (customStyles) {
    newStyles = mergeStyles(newStyles, customStyles);
  }
  styleTag.textContent = newStyles;

  // 处理代码内容
  if (CodeMirror && CodeMirror.runMode) {
    const lines = typeof code === "string" ? code.split("\n") : code; // 将字符串按行分割

    // console.log(code.split('\n'),"code.split('\n')");

    lines.forEach((line, index) => {
      if (line.trim() === "") return;
      
      // 创建行号
      const lineDiv = document.createElement("div");
      lineDiv.style.position = "relative";

      const lineNumberDiv = document.createElement("div");
      lineNumberDiv.style.position = "absolute";
      // lineNumberDiv.style.backgroundColor = "red";
      // lineNumberDiv.style.top = `${index*15}px`;
      // lineNumberDiv.style.height = "15px";
      lineNumberDiv.style.width = "29px"; // 行号宽度，适配多位数行号
      lineNumberDiv.style.color = "#fff";
      lineNumberDiv.style.display = "inline-block";
      lineNumberDiv.style.textAlign = "center";
      lineNumberDiv.style.zIndex = "4";
      lineNumberDiv.style.fontSize = "14px";
      lineNumberDiv.textContent = String(index + 1);
      lineDiv.appendChild(lineNumberDiv);

      const codeDiv = document.createElement("div");
      const codeContainerLine = document.createElement("span");
      codeContainerLine.style.paddingLeft = "4px";


      //先进行默认高亮处理
      let renderedLine = line;
    //   // 执行自定义渲染函数
    // if (customHighlight && customHighlight.length > 0) {
    //   renderedLine = applyCustomRender(line, index + 1, customHighlight);
    // }

      CodeMirror.runMode(renderedLine, mode, (text, style) => {
        const span = document.createElement("span");
        if (style) {
          span.className = `cm-${style}`;
        }
        span.textContent = text;
        codeContainerLine.appendChild(span);
        codeDiv.appendChild(codeContainerLine);
      });
      // 如果有自定义高亮规则，进行替换
      // if (customHighlight && customHighlight.length > 0) {
      //   renderedLine = applyCustomRender(codeContainerLine,renderedLine, index + 1, customHighlight);
      // }
      // 将渲染后的内容应用到 codeContainerLine 中
      //  codeContainerLine.innerHTML = renderedLine;
       console.log(codeContainerLine,'codeContainerLine');
       
       codeDiv.appendChild(codeContainerLine);

      // 创建行容器
      const lineContainer = document.createElement("div");
      lineContainer.appendChild(lineNumberDiv);
      lineContainer.appendChild(codeDiv);
      pre.appendChild(lineContainer);
    });
  } else {
  }
  // 将 <pre> 添加到容器中
  divContainerLines.appendChild(pre);
  divContainer.appendChild(divContainerLines);
  container.appendChild(divContainer);
}

// 样式合并函数
function mergeStyles(defaultStyles, customStyles) {
  const styleMap = {};
  defaultStyles.split("}").forEach((rule) => {
    const [selector, styles] = rule.split("{");
    if (selector && styles) {
      styleMap[selector.trim()] = styles.trim();
    }
  });
  for (const [key, value] of Object.entries(customStyles)) {
    const selector = `.cm-${key}`;
    styleMap[selector] = value;
  }
  return Object.entries(styleMap)
    .map(([selector, styles]) => `${selector} { ${styles} }`)
    .join("\n");
}

//去掉样式style的格式
function cleanStyles(styles) {
  return styles.replace(/\s+/g, " ").trim(); // 去除多余空白
}

// // 逐行处理已渲染的span标签
// function applyCustomRender(codeContainerLine, line, lineNumber, customHighlight) {
//   // 遍历所有span，应用自定义高亮
//   const spans = codeContainerLine.querySelectorAll("span");
//   spans.forEach(span => {
//     let spanText = span.textContent;

//     customHighlight.forEach(({ match, renderFn }) => {
//       if (typeof renderFn !== "function") {
//         console.error(`renderFn should be a function, but got ${typeof renderFn}`);
//         return;
//       }

//       // 使用 match 匹配字符串
//       const matches = [...spanText.matchAll(match)];

//       // 遍历所有匹配项
//       matches.forEach((matchItem) => {
//         // 调用 renderFn 获取自定义渲染的内容
//         const renderedContent = renderFn(matchItem[0], {
//           lineNumber,
//           match: matchItem,
//         });

//         if (renderedContent) {
//           // 如果 renderFn 返回了HTML，替换原始文本
//           span.innerHTML = span.innerHTML.replace(matchItem[0], renderedContent);
//         }
//       });
//     });
//   });
// }

// 修改 renderFn 以支持自定义渲染操作，并返回一个带有标识的对象
function preprocessCustomContent(code, customHighlight) {
  let processedCode = code;

  // 遍历所有自定义高亮规则并进行处理
  customHighlight.forEach(({ match, renderFn }) => {
    if (typeof renderFn !== "function") {
      console.error("renderFn should be a function, but got", typeof renderFn);
      return;
    }

    // 获取匹配的内容
    const matches = [...processedCode.matchAll(match)];

    // 遍历所有匹配项并进行替换
    matches.forEach((matchItem) => {
      const matchedText = matchItem[0]; // 被匹配的文本
      // 在传递给 renderFn 时，确保传递了有效的参数
      const renderedContent = renderFn(matchedText, { match: matchItem });

      if (renderedContent) {
        // 检查渲染的内容是 HTML 还是普通文本操作
        if (renderedContent.type === "html") {
          // 用自定义渲染的内容替换原始内容，并添加 data-custom-html 标识
          processedCode = processedCode.replace(matchedText, `<div data-custom-html="true">${renderedContent.content}</div>`);
        } else if (renderedContent.type === "function") {
          // 用函数渲染的内容替换原始内容，并添加 data-custom-function 标识
          processedCode = processedCode.replace(matchedText, `<div data-custom-function="true">${renderedContent.content}</div>`);
        }
      }
    });
  });

  return processedCode;
}
