/*
 * @Author: yunlu.lai1@dbappsecurity.com.cn yunlu.lai1@dbappsecurity.com.cn
 * @Date: 2024-12-24 09:38:50
 * @LastEditors: yunlu.lai1@dbappsecurity.com.cn 2714838232@qq.com
 * @LastEditTime: 2025-02-13 15:06:03
 * @FilePath: \code-mirror\mirror-hight\src\utils\getHighlightedHtml.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 *   //代码：  代码行pre（CodeMirror-line）->大spna（presentation） ->各小span
  //行号：div（CodeMirror-gutter-wrapper-> div（CodeMirror-linenumber CodeMirror-gutter-elt 数字
  //大盒子 div divline（包括）
  //大盒子  div位gutter（position left：0）+ divline
  //包括一层大容器（槽号和代码行并列）
 */
import CodeMirror from "codemirror"; // 导入 CodeMirror
import "codemirror/addon/runmode/runmode.js"; // 引入 runmode.js
import "codemirror/addon/mode/simple.js";

import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python"; // Python
import "codemirror/mode/htmlmixed/htmlmixed"; // HTML
import "codemirror/mode/sql/sql"; // 导入 JavaScript 模式
import "codemirror/mode/clike/clike"; // Java 属于 clike 模式
import "codemirror/mode/shell/shell"; // Java 属于 clike 模式
import VirtualScroller from "virtual-scroller/dom";
// import VirtualScroller from "virtual-scroller";
import { stylesDefaultLog, stylesDefault } from "../theme/defaultcss";
import "../theme/theme.css";
import parseLogs from "parse-logs";
// 日志自定义高亮
CodeMirror.defineSimpleMode("logLang", {
  start: [
    // 时间匹配：日期
    {
      regex:
        /(\d{4}[-\/]\d{2}[-\/]\d{2})(?:[ T](\d{2}:\d{2}(:\d{2})?(\.\d{3}|\,\d{3})?))?/,
      token: "date",
    },
    // 级别匹配
    {
      regex: /\b(DEBUG|INFO|INFORMATION|WARN|WARNING|ERROR|FAIL|FAILURE)\b/,
      token: function (match) {
        switch (match[0]) {
          case "DEBUG":
            return "log-level debug";
          case "INFO":
            return "log-level info";
          case "INFORMATION":
            return "log-level info";
          case "WARN":
            return "log-level warning";
          case "WARNING":
            return "log-level warning";
          case "ERROR":
            return "log-level error";
          case "FAIL":
            return "log-level fail";
          case "FAILURE":
            return "log-level fail";
          default:
            return "log-level";
        }
      },
    },
    // 匹配字符串常量（确保匹配在日期和日志级别之后）
    {
      regex: /(['"]).*?\1/,
      token: "string-constant",
    },
    // 匹配布尔值常量 (true / false)
    {
      regex: /\b(true|false)\b/,
      token: "boolean-constant",
    },
    // 匹配空值常量 (null)
    {
      regex: /\bnull\b/,
      token: "null-constant",
    },
    // 匹配整数常量
    {
      regex: /\b\d+\b(?!\.\d)/, // 匹配整数，不允许后面跟着小数点
      token: "integer-constant",
    },
    // 匹配浮点数常量
    {
      regex: /\b\d+\.\d+\b/,
      token: "float-constant",
    },

    // mac地址
    {
      regex: /\b([0-9a-fA-F]{2}[-:]){5}[0-9a-fA-F]{2}\b/,
      token: "mac",
    },

    // 网址
    {
      regex: /(https?:\/\/[^\s]+)/,
      token: "url",
    },

    // IP 地址（IPv4 和 IPv6）
    {
      regex:
        /(\b(?:\d{1,3}\.){3}\d{1,3}\b|\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b)/,
      token: "ip-address",
    },

    // GUID
    {
      regex:
        /\b([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\b/,
      token: "guid",
    },

    // 匹配 .NET 异常类型名称
    {
      regex: /\b([A-Z][a-zA-Z]*Exception)\b/,
      token: "exception-type",
    },

    // 匹配 .NET 异常堆栈跟踪
    {
      regex:
        /at\s([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*)\.(\w+)\(\)\s*in\s([a-zA-Z0-9_\\\/\.]+):line\s(\d+)/,
      token: [
        "exception-stack",
        "class-name",
        "method-name",
        "file-path",
        "line-number",
      ],
    },

    // 匹配错误代码 (SQLAlchemy 错误码、HTTP 错误码等)
    {
      regex: /\b(?:\d{3})\b/,
      token: "error-code",
    },

    // 捕获 "user" 信息，例如 "user: admin"
    {
      regex: /user:\s*(\w+)/,
      token: "user-info",
    },

    // 匹配异常堆栈信息 (at functionName (path/to/file.py:123))
    {
      regex:
        /^\s*at\s([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*)\.(\w+)\(\)\s*in\s([a-zA-Z0-9_\\\/.]+):line\s(\d+)/,
      token: [
        "exception-stack",
        "class-name",
        "method-name",
        "file-path",
        "line-number",
      ],
    },
    // 匹配文件路径和行号
    {
      regex: /([a-zA-Z0-9_\/\\\.\-]+\.py):(\d+)/,
      token: ["file-path", "integer-constant"],
    },
    // 匹配日志消息
    {
      regex: /- (.+)/,
      token: "message",
    },
  ],
});

function highlightRunMode(code, mode, codeContainerLine) {
  CodeMirror.runMode(code, mode, (text, style) => {
    const span = document.createElement("span");
    if (style) {
      span.className = `cm-${style}`;
    }
    span.textContent = text;
    codeContainerLine.appendChild(span);
  });
}

export function getHighlightedHtml(
  code,
  mode,
  theme,
  customStyles = {},
  container,
  customHighlight = [],
  isEdit
) {
  if (!container) {
    throw new Error(
      "A container element is required to render highlighted code."
    );
  }
  // 清空容器
  container.innerHTML = "";

  const scrollDiv = document.createElement("div");
  scrollDiv.style.display = "flex";
  // scrollDiv.style.overflowY = "auto";
  // scrollDiv.style.backgroundColor = '#353f58';
  // scrollDiv.style.maxHeight = "500px";

  // 创建主容器(放置行号和槽号)
  const divContainer = document.createElement("div");
  divContainer.style.position = "relative";
  divContainer.style.height = "320px";
  divContainer.style.overflowY = "auto"; // 启用垂直滚动
  divContainer.style.width = "1240px";
  divContainer.style.backgroundColor = "#353f58";

  //创建gutter容器,存放行号槽(与lines同级)
  const DivGutter = document.createElement("div");
  DivGutter.style.position = "absolute";
  DivGutter.style.height = "1500px";
  DivGutter.style.boxSizing = "content-box";
  DivGutter.style.minWidth = "31px";
  DivGutter.style.background = "#3f4b69";
  DivGutter.style.left = "0px";
  // 创建lines容器(放置行code和槽号数字)
  const divContainerLines = document.createElement("div");
  divContainerLines.style.position = "relative";
  divContainerLines.style.backgroundColor = "#353f58";
  // divContainerLines.style.maxHeight = "500px"; //设置滚动区高度

  const totalLines = code.split("\n").length;
  const lineHeight = 16;

  DivGutter.style.height = `${totalLines * lineHeight}px`;

  divContainerLines.style.color = "#dcdcdc";
  divContainerLines.style.height = "310px";
  divContainerLines.style.overflowY = "auto";

  divContainerLines.style.margin = "0";
  divContainerLines.style.fotSize = "14px";
  divContainerLines.style.fontFamily = "monospace";
  divContainerLines.style.marginLeft = "30px";
  divContainerLines.style.backgroundColor = "yellow";

  //将DivGutter与codemirror-line并列
  divContainer.appendChild(DivGutter);

  // 创建 <style> 标签
  const styleTag = document.createElement("style");
  divContainer.appendChild(styleTag);
  let newStyles = mode === "logLang" ? stylesDefaultLog : stylesDefault;
  if (customStyles) {
    newStyles = mergeStyles(newStyles, customStyles);
  }
  styleTag.textContent = newStyles;

  // 处理代码内容
  if (CodeMirror && CodeMirror.runMode && !isEdit) {
    // 创建行号
    // const lineDiv = document.createElement("div");
    // lineDiv.style.position = "relative";

    //行容器
    const lineContainer = document.createElement("div");
    lineContainer.style.backgroundColor = "yellow";

    // 将 DivGutter 与 divContainerLines 放置到一起
    divContainer.appendChild(DivGutter);
    // divContainer.appendChild(divContainerLines);

    // 最终将整个 divContainer 放入容器
    container.appendChild(divContainer);
  }
  requestAnimationFrame(() => {
    const containerHeight = container.clientHeight;
    if (containerHeight === 0) {
      console.error(
        "Container height is 0. Ensure the container is visible and properly rendered."
      );
      return;
    }

    renderCodeWithLineNumbers(
      divContainer, // 容器，用于存放代码行和行号
      code, // 代码内容
      mode, // 高亮模式
      16, // 每行的高度 (可以调整)
      customHighlight, // 自定义高亮行数组
      styleTag // 用于动态插入样式的 <style> 标签
    );

    // 最终将整个 divContainer 放入容器
    container.appendChild(divContainer);
  });
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
// 修改 renderFn 以支持自定义渲染操作，并返回一个带有标识的对象
function preprocessCustomContent(code, customHighlight) {
  let processedCode = code;
  // 用于存储所有自定义的class和style

  let allCustomStyles = "";
  const addedStyles = new Set(); // 用于缓存已经添加的样式，避免重复
  // 遍历所有自定义高亮规则并进行处理
  customHighlight.forEach(({ match, renderFn, style, className }) => {
    if (typeof renderFn !== "function") {
      // console.error("renderFn should be a function, but got", typeof renderFn);
      return;
    }
    // 获取匹配的内容
    const matches = [...processedCode.matchAll(match)];
    // 遍历所有匹配项并进行替换
    matches.forEach((matchItem) => {
      const matchedText = matchItem[0]; // 被匹配的文本

      // 处理 className，确保是有效的类名字符串
      let classStr = "";
      if (Array.isArray(className)) {
        // 如果 className 是一个数组，遍历每个对象
        className.forEach((classObj) => {
          for (let classKey in classObj) {
            // 获取类名
            classStr += `${classKey} `;
            const classStyles = classObj[classKey];

            // 只添加未添加的样式
            if (!addedStyles.has(classKey)) {
              addedStyles.add(classKey);
              // 生成 CSS 样式
              allCustomStyles += `
                   .${classKey} {
                     ${Object.entries(classStyles)
                       .map(([key, value]) => `${key}: ${value};`)
                       .join(" ")}
                   }
                 `;
            }
          }
        });
      } else if (typeof className === "string") {
        classStr = className;
      }
      // 在传递给 renderFn 时，确保传递了有效的参数
      const renderedContent = renderFn(matchedText, {
        match: matchItem,
        style: style || "",
        className: classStr.trim(), // 确保 className 是有效的
      });
      //自定义代码内容
      processedCode = processedCode.replace(
        matchedText,
        `<span data-html="true">${renderedContent}</span>`
      );
    });
  });
  return {
    processedCode,
    allCustomStyles,
  };
}

function customHighlighted(
  code,
  mode,
  codeContainerLine,
  customHighlight,
  styleTag
) {
  let { processedCode, allCustomStyles } = preprocessCustomContent(
    code,
    customHighlight
  );
  // 获取处理过的代码
  styleTag.textContent += allCustomStyles;
  const customBlocks = [
    ...processedCode.matchAll(
      /<span data-html="true">([\s\S]*?)<\/span>|([^<]+)/g
    ),
  ];

  customBlocks.forEach((block) => {
    const [fullMatch, htmlContent, textContent] = block;
    if (htmlContent) {
      const htmlElement = document.createElement("div");
      htmlElement.style.display = "inline-block";
      htmlElement.innerHTML = htmlContent; // 直接渲染 HTML
      // console.log(htmlElement,'htmlElement');
      codeContainerLine.appendChild(htmlElement);
    }
    if (textContent) {
      highlightRunMode(textContent, mode, codeContainerLine);
    }
  });
}
export function editCode(code, mode, container) {
  container.innerHTML = "";
  const editor = CodeMirror(container, {
    value: code,
    mode,
    lineNumbers: true,
    theme: "custom-theme",
    readOnly: false,
  });
}

// export function renderCodeWithLineNumbers(
//   divContainer,
//   container,
//   code,
//   mode,
//   lineHeight = 16,
//   customHighlight = [],
//   styleTag
// ) {
//   const lines = code.split("\n"); // 将代码按行分割
//   const totalLines = lines.length; // 代码的总行数
//   const containerHeight = container.clientHeight; // 获取容器的高度 B

//   // 创建容器和占位符
//   // const virtualWrapper = document.createElement("div");
//   // virtualWrapper.style.position = "relative";
//   // virtualWrapper.style.height = `${totalLines * lineHeight}px`; // 设定总高度
//   // container.appendChild(virtualWrapper);
//   // 创建行号和代码容器
//   const divContainerLines = document.createElement("div");
//   divContainerLines.style.position = "relative";
//   divContainerLines.style.backgroundColor = "#353f58";
//   divContainerLines.style.color = "#dcdcdc";
//   divContainerLines.style.fontSize = "14px";
//   divContainerLines.style.fontFamily = "monospace";
//   container.appendChild(divContainerLines);

//   const codeDiv = document.createElement("div");
//   codeDiv.style.paddingTop = "4px";
//   divContainerLines.appendChild(codeDiv);

//   const lineDiv = document.createElement("div");
//   lineDiv.style.position = "relative";
//   divContainerLines.appendChild(lineDiv);

//   // 计算每行的实际高度（考虑换行的情况）

//   async function calculateLineHeight(codeLine) {
//     return new Promise((resolve) => {
//       const tempDiv = document.createElement("div");
//       tempDiv.style.whiteSpace = "pre-wrap";
//       tempDiv.style.margin = "0";
//       tempDiv.style.paddingLeft = "4px";
//       tempDiv.style.lineHeight = `${lineHeight}px`;
//       tempDiv.style.minHeight = `${lineHeight}px`;
//       tempDiv.style.fontFamily = "monospace";

//       // 如果有 codeLine 内容，进行自定义高亮
//       if (codeLine.length > 0) {
//         customHighlighted(codeLine, mode, tempDiv, customHighlight, styleTag);
//       } else {
//         highlightRunMode(codeLine, mode, tempDiv);
//       }

//       tempDiv.style.width = "1159px";
//       document.body.appendChild(tempDiv);

//       // 获取行数的计算
//       function getLineCount() {
//         return new Promise((resolve) => {
//           requestAnimationFrame(function () {
//             const height = tempDiv.clientHeight; // 获取高度
//             const lineCount = Math.ceil(height / lineHeight);
//             resolve(lineCount); // 通过 Promise 返回行数
//           });
//         });
//       }

//       // 调用获取行数的函数并返回结果
//       getLineCount().then((lineCount) => {
//         // 移除临时的 div 元素
//         document.body.removeChild(tempDiv);
//         // 返回计算的行数
//         resolve(lineCount);
//       });
//     });
//   }

//   let linesNum = 0;
//   // 渲染每一行的函数
//   async function renderLine(lineNum, codeLine) {
//     const lineHeightInPixels = await calculateLineHeight(codeLine);

//     if (lineHeightInPixels > 1) {
//       linesNum += lineHeightInPixels;
//       console.log(linesNum, "linesNum11");
//     }

//     const codeContainerLine = document.createElement("pre");
//     codeContainerLine.style.whiteSpace = "pre-wrap";
//     codeContainerLine.style.margin = "0";
//     codeContainerLine.style.paddingLeft = "4px";
//     codeContainerLine.style.lineHeight = `${lineHeight}px`;
//     codeContainerLine.style.minHeight = `${lineHeight}px`;

//     if (codeLine.length > 0) {
//       customHighlighted(
//         codeLine,
//         mode,
//         codeContainerLine,
//         customHighlight,
//         styleTag
//       );
//     } else {
//       highlightRunMode(codeLine, mode, codeContainerLine);
//     }

//     const numberDiv = document.createElement("div");
//     numberDiv.style.position = "relative";

//     const numberDivs = document.createElement("div");

//     const lineNumberDiv = document.createElement("div");
//     // lineNumberDiv.innerText = `${lineNum}`;
//     lineNumberDiv.style.textAlign = "center";
//     lineNumberDiv.style.position = "absolute";
//     lineNumberDiv.style.left = "-31px";
//     lineNumberDiv.style.color = "#fff";
//     lineNumberDiv.style.width = "31px"; // 行号宽度
//     lineNumberDiv.style.lineHeight = `${lineHeight}px`;
//     lineNumberDiv.style.minHeight = `${lineHeight}px`;
//     lineNumberDiv.style.zIndex = "4";
//     lineNumberDiv.style.fontSize = "14px";
//     lineNumberDiv.style.fontFamily = "monospace";

//     if (lineHeightInPixels > 1) {
//       // 循环创建多行行号 div
//       for (let i = 1; i <= lineHeightInPixels; i++) {
//         numberDivs.style.display = "flex";
//         numberDivs.style.flexDirection = "column"; // 垂直排列
//         numberDivs.style.position = "relative";

//         const lineNumberDiv = document.createElement("div");
//         // lineNumberDiv.innerText = `${lineNum}`;
//         lineNumberDiv.style.textAlign = "center";
//         lineNumberDiv.style.position = "absolute";
//         lineNumberDiv.style.left = "-31px";
//         lineNumberDiv.style.top = `${lineHeight * (i - 1)}px`;
//         lineNumberDiv.style.color = "#fff";
//         lineNumberDiv.style.width = "31px"; // 行号宽度
//         lineNumberDiv.style.lineHeight = `${lineHeight}px`;
//         lineNumberDiv.style.minHeight = `${lineHeight}px`;
//         lineNumberDiv.style.zIndex = "4";
//         lineNumberDiv.style.fontSize = "14px";
//         lineNumberDiv.style.fontFamily = "monospace";
//         lineNumberDiv.innerText = `${lineNum + i - 1}`;

//         // 将行号 div 添加到 numberDiv 中
//         numberDivs.appendChild(lineNumberDiv);
//       }
//       numberDiv.appendChild(numberDivs);
//     } else {
//       lineNum += linesNum;
//       console.log(lineNum, "lineNum");

//       // 如果行高等于 1，仅显示一行行号
//       lineNumberDiv.innerText = `${lineNum}`;
//       numberDiv.appendChild(lineNumberDiv);
//     }

//     // numberDiv.appendChild(lineNumberDiv);
//     lineDiv.appendChild(numberDiv);
//     lineDiv.appendChild(codeContainerLine);
//     codeDiv.appendChild(lineDiv);
//   }

//   // 渲染可见行
//   async function renderVisibleLines(scrollTop) {
//     let startLine = 0;
//     let endLine = 0;
//     let currentHeight = 0;

//     // 计算开始行和结束行
//     console.log(scrollTop, "scrollTop");

//     for (let i = 0; i < totalLines; i++) {
//       // 调用方式示例
//       const lineHeightInPixels = await calculateLineHeight(lines[i]);
//       if (currentHeight >= scrollTop && startLine === 0) {
//         startLine = i;
//       }
//       if (currentHeight > scrollTop + containerHeight) {
//         endLine = i;
//         break;
//       }
//       currentHeight += lineHeightInPixels * lineHeight; // 累加行高
//     }

//     endLine = endLine || totalLines;
//     // 清空已渲染的行
//     lineDiv.innerHTML = "";
//     codeDiv.innerHTML = "";
//     console.log(startLine, "startLine");
//     console.log(endLine, "startLine");

//     // 渲染当前可见行
//     for (let i = startLine; i < endLine; i++) {
//       renderLine(i, lines[i]); // 渲染每一行，i + 1 是行号
//     }
//   }

//   // 监听滚动事件
//   divContainer.addEventListener("scroll", () => {
//     const scrollTop = divContainer.scrollTop;
//     renderVisibleLines(scrollTop); // 根据滚动位置渲染可见行
//   });
//   // 初始化渲染，渲染首次可见区域
//   renderVisibleLines(0);
// }

// export function renderCodeWithLineNumbers(
//   divContainer,
//   container,
//   code,
//   mode,
//   lineHeight = 16,
//   customHighlight = [],
//   styleTag
// ) {
//   if (!code) {
//     console.error("Code content is undefined!");
//     return;
//   }

//   const lines = code.split("\n");

//   // **创建滚动占位容器**
//   divContainer.style.overflowY = "auto"; // 让 `divContainer` 变成滚动容器

//   const scrollerContainer = document.createElement("div");
//   scrollerContainer.style.position = "relative"; // 作为 `VirtualScroller` 的内容容器
//   scrollerContainer.style.width = "100%";
//   divContainer.appendChild(scrollerContainer); // **直接挂载到滚动容器**

//   // **计算每行的实际高度（高亮后）**
//   async function calculateLineHeight(text, mode) {
//     return new Promise((resolve) => {
//       const tempDiv = document.createElement("div");
//       tempDiv.style.whiteSpace = "pre-wrap";
//       tempDiv.style.fontFamily = "monospace";
//       tempDiv.style.visibility = "hidden";
//       tempDiv.style.position = "absolute";
//       tempDiv.style.width = "fit-content";
//       tempDiv.style.lineHeight = `${lineHeight}px`;
//       document.body.appendChild(tempDiv);

//       customHighlighted(text, mode, tempDiv, customHighlight, styleTag);

//       requestAnimationFrame(() => {
//         const height = tempDiv.offsetHeight;
//         document.body.removeChild(tempDiv);
//         resolve(height || lineHeight);
//       });
//     });
//   }

//   // **初始化行数据**
//   async function initializeItems() {
//     let offset = 0;
//     const itemPromises = lines.map(async (line, index) => {
//       const height = await calculateLineHeight(line, mode);
//       const item = { index, text: line, height, offset };
//       offset += height;
//       return item;
//     });

//     return Promise.all(itemPromises);
//   }

//   initializeItems().then((items) => {
//     // **设置 `scrollerContainer` 总高度**
//     scrollerContainer.style.height = `${
//       items[items.length - 1].offset + items[items.length - 1].height
//     }px`;

//     // **渲染单行代码**
//     function renderItem(item) {
//       if (!item) return document.createElement("div");

//       const lineContainer = document.createElement("div");
//       lineContainer.style.position = "absolute";
//       lineContainer.style.top = `${item.offset}px`;
//       lineContainer.style.width = "100%";
//       lineContainer.style.height = `${item.height}px`;
//       lineContainer.style.display = "flex";
//       lineContainer.style.alignItems = "center";

//       // **行号**
//       const lineNumberDiv = document.createElement("div");
//       lineNumberDiv.style.width = "40px";
//       lineNumberDiv.style.textAlign = "center";
//       lineNumberDiv.style.color = "#fff";
//       lineNumberDiv.style.paddingRight = "10px";
//       lineNumberDiv.textContent = `${item.index + 1}`;
//       lineNumberDiv.style.fontFamily = "monospace";

//       // **代码行**
//       const codeContainer = document.createElement("pre");
//       codeContainer.style.margin = "0";
//       codeContainer.style.whiteSpace = "pre-wrap";
//       codeContainer.style.fontFamily = "monospace";

//       requestAnimationFrame(() => {
//         customHighlighted(item.text, mode, codeContainer, customHighlight, styleTag);
//       });

//       lineContainer.appendChild(lineNumberDiv);
//       lineContainer.appendChild(codeContainer);

//       return lineContainer;
//     }

//     // **初始化 `VirtualScroller`**
//     const virtualScroller = new VirtualScroller(
//       scrollerContainer,
//       items.slice(0, 20), // **✅ 只加载前 20 行**
//       renderItem,
//       {
//         itemHeight: (index) => items[index]?.height || lineHeight, // 动态获取行高
//         scrollContainer: divContainer,
//         onItemHeightDidChange: (index) => {
//           console.log(`行高发生变化：${index}`);
//         },
//       }
//     );

//     // **监听高度变化**
//     const observer = new ResizeObserver((entries) => {
//       for (const entry of entries) {
//         const index = Number(entry.target.dataset.index);
//         if (index >= 0 && index < items.length) {
//           const newHeight = entry.target.offsetHeight;
//           if (newHeight !== items[index].height) {
//             items[index].height = newHeight;
//             items[index].offset =
//               index === 0 ? 0 : items[index - 1].offset + items[index - 1].height;
//             virtualScroller.setItems([...items]);
//           }
//         }
//       }
//     });

//     let currentItems = items.slice(0, 20);
//     divContainer.addEventListener("scroll", () => {
//       const scrollTop = divContainer.scrollTop;
//       const visibleCount = Math.ceil(divContainer.clientHeight / lineHeight);
//       const startIndex = Math.max(0, Math.floor(scrollTop / lineHeight-3) );
//       const endIndex = Math.min(items.length, startIndex + visibleCount +3);

//       const newItems = items.slice(startIndex, endIndex);
//       console.log(newItems,'newItems');

//       currentItems = [...newItems];
//       console.log("当前 VirtualScroller items 数组:", items.slice(50, 60));
//       virtualScroller.setItems(currentItems);

//       // **监听新渲染的元素**
//       document.querySelectorAll(".virtual-item").forEach((el) => observer.observe(el));
//     });

//     document.addEventListener("DOMContentLoaded", () => {
//       virtualScroller.setItems(items.slice(0, 20));
//     });
//   });
// }
// export function renderCodeWithLineNumbers(
//   divContainer,
//   container,
//   code,
//   mode,
//   lineHeight = 16,
//   customHighlight = [],
//   styleTag
// ) {
//   const lines = code.split("\n");
//   let items = lines.map((text, index) => ({
//     index,
//     text,
//     height: lineHeight,
//     offset: index * lineHeight
//   }));

//   const scrollerContainer = document.createElement("div");
//   scrollerContainer.style.position = "relative";
//   scrollerContainer.style.height = `${items[items.length - 1].offset + items[items.length - 1].height}px`;
//   divContainer.appendChild(scrollerContainer);

//   // 渲染单行
//   const renderItem = (item) => {
//     const lineContainer = document.createElement("div");
//     lineContainer.style.position = "absolute";
//     lineContainer.style.top = `${item.offset}px`;
//     lineContainer.style.width = "100%";
//     lineContainer.style.height = `${item.height}px`;

//     // 行号
//     const lineNumber = document.createElement("div");
//     lineNumber.textContent = item.index + 1;
//     lineNumber.style.width = "40px";

//     // 代码内容
//     const codeContent = document.createElement("pre");
//     customHighlighted(item.text, mode, codeContent, customHighlight, styleTag);

//     // 动态计算高度
//     const updateHeight = () => {
//       const newHeight = codeContent.offsetHeight;
//       if (newHeight === item.height) return;

//       item.height = newHeight;
//       let offset = item.offset + item.height;
//       for (let i = item.index + 1; i < items.length; i++) {
//         items[i].offset = offset;
//         offset += items[i].height;
//       }
//       scrollerContainer.style.height = `${offset}px`;
//       virtualScroller.updateItem(item.index);
//     };

//     requestAnimationFrame(updateHeight);
//     const observer = new ResizeObserver(updateHeight);
//     observer.observe(codeContent);
//     lineContainer._observer = observer;

//     lineContainer.append(lineNumber, codeContent);
//     return lineContainer;
//   };

//   // 初始化 VirtualScroller
//   const virtualScroller = new VirtualScroller({
//     container: scrollerContainer,
//     items,
//     renderItem,
//     itemHeight: (index) => items[index].height,
//     scrollContainer: divContainer,
//     renderBuffer: 20,
//     onUnrenderItem: (el) => el._observer?.disconnect()
//   });

//   virtualScroller.init();
// }
//尝试使用使用库
// export function renderCodeWithLineNumbers(
//   divContainer,
//   container,
//   code,
//   mode,
//   lineHeight = 16,
//   customHighlight = [],
//   styleTag
// ) {
//   if (!code) {
//     console.error("Code content is undefined!");
//     return;
//   }

//   const lines = code.split("\n");

//   // **创建滚动占位容器**
//   divContainer.style.overflowY = "auto"; // 让 `divContainer` 变成滚动容器

//   const scrollerContainer = document.createElement("div");
//   scrollerContainer.style.position = "relative"; // 作为 `VirtualScroller` 的内容容器
//   scrollerContainer.style.width = "100%";

//   divContainer.appendChild(scrollerContainer); // **直接挂载到滚动容器**

//   // **计算每行的实际高度（高亮后）**
//   async function calculateLineHeight(text, mode) {
//     return new Promise((resolve) => {
//       const tempDiv = document.createElement("div");
//       tempDiv.style.whiteSpace = "pre-wrap";
//       tempDiv.style.fontFamily = "monospace";
//       tempDiv.style.visibility = "hidden";
//       tempDiv.style.position = "absolute";
//       tempDiv.style.width = "fit-content";
//       tempDiv.style.lineHeight = `${lineHeight}px`;
//       document.body.appendChild(tempDiv);

//       customHighlighted(text, mode, tempDiv, customHighlight, styleTag);

//       requestAnimationFrame(() => {
//         const height = tempDiv.offsetHeight;
//         document.body.removeChild(tempDiv);
//         resolve(height || lineHeight);
//       });
//     });
//   }

//   // **初始化行数据**
//   async function initializeItems() {
//     let offset = 0;
//     const itemPromises = lines.map(async (line, index) => {
//       const height = await calculateLineHeight(line, mode);
//       const item = { index, text: line, height, offset };
//       offset += height;
//       return item;
//     });

//     return Promise.all(itemPromises);
//   }

//   initializeItems().then((items) => {
//     // **设置 `scrollerContainer` 总高度**
//     scrollerContainer.style.height = `${
//       items[items.length - 1].offset + items[items.length - 1].height
//     }px`;
//     // scrollerContainer.style.height=`100%`;

//     // **渲染单行代码**
//     function renderItem(item) {
//       console.log(item,'2222');

//       if (!item) return document.createElement("div");

//       const lineContainer = document.createElement("div");
//       // lineContainer.style.position = "absolute";
//       // lineContainer.style.top = `${item.offset}px`;
//       lineContainer.style.width = "100%";
//       lineContainer.style.height = `${item.height}px`;
//       lineContainer.style.display = "flex";
//       lineContainer.style.alignItems = "center";

//       // **行号**
//       const lineNumberDiv = document.createElement("div");
//       lineNumberDiv.style.width = "40px";
//       lineNumberDiv.style.textAlign = "center";
//       lineNumberDiv.style.color = "#fff";
//       lineNumberDiv.style.paddingRight = "10px";
//       lineNumberDiv.textContent = `${item.index + 1}`;
//       lineNumberDiv.style.fontFamily = "monospace";

//       // **代码行**
//       const codeContainer = document.createElement("pre");
//       codeContainer.style.margin = "0";
//       codeContainer.style.whiteSpace = "pre-wrap";
//       codeContainer.style.fontFamily = "monospace";

//       requestAnimationFrame(() => {
//         customHighlighted(item.text, mode, codeContainer, customHighlight, styleTag);
//       });

//       lineContainer.appendChild(lineNumberDiv);
//       lineContainer.appendChild(codeContainer);

//       return lineContainer;
//     }

//     console.log(items,'11111');

//     // **初始化 `VirtualScroller`**
//     const virtualScroller = new VirtualScroller(
//       scrollerContainer,
//       items, // **✅ 只加载前 20 行**
//       renderItem,
//       {
//         scrollableContainer:container
//       }
//     );

//     // **监听高度变化**
//     const observer = new ResizeObserver((entries) => {
//       for (const entry of entries) {
//         const index = Number(entry.target.dataset.index);
//         if (index >= 0 && index < items.length) {
//           const newHeight = entry.target.offsetHeight;
//           if (newHeight !== items[index].height) {
//             items[index].height = newHeight;
//             items[index].offset =
//               index === 0 ? 0 : items[index - 1].offset + items[index - 1].height;
//             virtualScroller.setItems([...items]);
//           }
//         }
//       }
//     });

//     let currentItems = items.slice(0, 20);
//     divContainer.addEventListener("scroll", () => {
//       const scrollTop = divContainer.scrollTop;
//       const visibleCount = Math.ceil(divContainer.clientHeight / lineHeight);
//       const startIndex = Math.max(0, Math.floor(scrollTop / lineHeight - 3));
//       const endIndex = Math.min(items.length, startIndex + visibleCount );

//       const newItems = items.slice(startIndex, endIndex);
//       console.log(newItems, "newItems");

//       currentItems = [...newItems];
//       console.log("当前 VirtualScroller items 数组:", items.slice(50, 60));
//       virtualScroller.setItems(currentItems);

//       // **监听新渲染的元素**
//       document.querySelectorAll(".virtual-item").forEach((el) => observer.observe(el));
//     });

//     document.addEventListener("DOMContentLoaded", () => {
//       virtualScroller.setItems(items.slice(0, 20));
//     });
//   });
// }
// export function renderCodeWithLineNumbers(
//   divContainer,
//   container,
//   code,
//   mode,
//   lineHeight = 16,
//   customHighlight = [],
//   styleTag
// ) {
//   if (!code) {
//     console.error("Code content is undefined!");
//     return;
//   }

//   const lines = code.split("\n");

//   // **创建滚动占位容器**
//   divContainer.style.overflowY = "auto"; // 让 `divContainer` 变成滚动容器

//   const scrollerContainer = document.createElement("div");
//   scrollerContainer.style.position = "relative"; // 作为 `VirtualScroller` 的内容容器
//   scrollerContainer.style.width = "100%";

//   divContainer.appendChild(scrollerContainer); // **直接挂载到滚动容器**

//   // **计算每行的实际高度（高亮后）**
//   async function calculateLineHeight(text, mode) {
//     return new Promise((resolve) => {
//       const tempDiv = document.createElement("div");
//       tempDiv.style.whiteSpace = "pre-wrap";
//       tempDiv.style.fontFamily = "monospace";
//       tempDiv.style.visibility = "hidden";
//       tempDiv.style.position = "absolute";
//       tempDiv.style.width = "fit-content";
//       tempDiv.style.lineHeight = `${lineHeight}px`;
//       document.body.appendChild(tempDiv);

//       customHighlighted(text, mode, tempDiv, customHighlight, styleTag);

//       requestAnimationFrame(() => {
//         const height = tempDiv.offsetHeight;
//         document.body.removeChild(tempDiv);
//         resolve(height || lineHeight);
//       });
//     });
//   }

//   // **初始化行数据**
//   async function initializeItems() {
//     let offset = 0;
//     const itemPromises = lines.map(async (line, index) => {
//       const height = await calculateLineHeight(line, mode);
//       const item = { index, text: line, height, offset };
//       offset += height;
//       return item;
//     });

//     return Promise.all(itemPromises);
//   }

//   initializeItems().then((items) => {
//     // **设置 `scrollerContainer` 总高度**
//     // scrollerContainer.style.height = `${
//     //   items[items.length - 1].offset + items[items.length - 1].height
//     // }px`;
//     // scrollerContainer.style.height='100%';

//     // **渲染单行代码**
//     function renderItem(item) {
//       console.log(item,'2222');

//       if (!item) return document.createElement("div");

//       const lineContainer = document.createElement("div");
//       // lineContainer.style.position = "absolute";
//       // lineContainer.style.top = `${item.offset}px`;
//       lineContainer.style.width = "100%";
//       lineContainer.style.height = `${item.height}px`;
//       lineContainer.style.display = "flex";
//       lineContainer.style.alignItems = "center";

//       // **行号**
//       const lineNumberDiv = document.createElement("div");
//       lineNumberDiv.style.width = "40px";
//       lineNumberDiv.style.textAlign = "center";
//       lineNumberDiv.style.color = "#fff";
//       lineNumberDiv.style.paddingRight = "10px";
//       lineNumberDiv.textContent = `${item.index + 1}`;
//       lineNumberDiv.style.fontFamily = "monospace";

//       // **代码行**
//       const codeContainer = document.createElement("pre");
//       codeContainer.style.margin = "0";
//       codeContainer.style.whiteSpace = "pre-wrap";
//       codeContainer.style.fontFamily = "monospace";

//       requestAnimationFrame(() => {
//         customHighlighted(item.text, mode, codeContainer, customHighlight, styleTag);
//       });

//       lineContainer.appendChild(lineNumberDiv);
//       lineContainer.appendChild(codeContainer);

//       return lineContainer;
//     }

//     // **初始化 `VirtualScroller`**
//     const virtualScroller = new VirtualScroller(
//       scrollerContainer,
//       items,
//       renderItem,
//       {

//         itemHeight: (index) => items[index]?.height || lineHeight, // ✅ 让 VirtualScroller 计算每行高度
//         scrollerContainer:divContainer ,
//         renderBuffer: 5, // ✅ 预加载 5 行，避免滚动时白屏
//       }
//     );

//     // // **监听高度变化**
//     // const observer = new ResizeObserver((entries) => {
//     //   for (const entry of entries) {
//     //     const index = Number(entry.target.dataset.index);
//     //     if (index >= 0 && index < items.length) {
//     //       const newHeight = entry.target.offsetHeight;
//     //       if (newHeight !== items[index].height) {
//     //         items[index].height = newHeight;
//     //         items[index].offset =
//     //           index === 0 ? 0 : items[index - 1].offset + items[index - 1].height;
//     //         virtualScroller.setItems([...items]);
//     //       }
//     //     }
//     //   }
//     // });

//     divContainer.addEventListener("scroll", () => {
//       // const scrollTop = divContainer.scrollTop;
//       // const visibleCount = Math.ceil(divContainer.clientHeight / lineHeight);
//       // const startIndex = Math.max(0, Math.floor(scrollTop / lineHeight - 3));
//       // const endIndex = Math.min(items.length, startIndex + visibleCount );

//       // const newItems = items.slice(startIndex, endIndex);
//       // console.log(newItems, "newItems");

//       // currentItems = [...newItems];
//       // console.log("当前 VirtualScroller items 数组:", items.slice(50, 60));
//       // virtualScroller.setItems(currentItems);

//       // // **监听新渲染的元素**
//       // document.querySelectorAll(".virtual-item").forEach((el) => observer.observe(el));
//     });

//     document.addEventListener("DOMContentLoaded", () => {
//       virtualScroller.setItems(items);
//     });
//   });
// }
// export function renderCodeWithLineNumbers(
//   divContainer,
//   code,
//   mode,
//   lineHeight = 16,
//   customHighlight = [],
//   styleTag
// ) {
//   if (!code) {
//     console.error("Code content is undefined!");
//     return;
//   }

//   const lines = code.split("\n");

//   // ✅ 创建 VirtualScroller 容器
//   const scrollerContainer = document.createElement("div");
//   // scrollerContainer.style.position = "relative";
//   // scrollerContainer.style.width = "100%";
//   divContainer.appendChild(scrollerContainer);

//   // ✅ 计算每行的高度
//   async function calculateLineHeight(text, mode) {
//     return new Promise((resolve) => {
//       const tempDiv = document.createElement("div");
//       tempDiv.style.whiteSpace = "pre-wrap";
//       tempDiv.style.fontFamily = "monospace";
//       tempDiv.style.visibility = "hidden";
//       tempDiv.style.position = "absolute";
//       tempDiv.style.width = "fit-content";
//       tempDiv.style.lineHeight = `${lineHeight}px`;
//       document.body.appendChild(tempDiv);

//       customHighlighted(text, mode, tempDiv, customHighlight, styleTag);

//       requestAnimationFrame(() => {
//         const height = tempDiv.offsetHeight;
//         document.body.removeChild(tempDiv);
//         resolve(height || lineHeight);
//       });
//     });
//   }

//   // ✅ 初始化数据
//   async function initializeItems() {
//     let offset = 0;
//     const itemPromises = lines.map(async (line, index) => {
//       const height = await calculateLineHeight(line, mode);
//       const item = { index, text: line, height, offset };
//       offset += height;
//       return item;
//     });

//     return Promise.all(itemPromises);
//   }

//   initializeItems().then((items) => {
//     // ✅ 设置 `scrollerContainer` 总高度（撑开滚动区域）
//     // scrollerContainer.style.height = `${
//     //   items[items.length - 1].offset + items[items.length - 1].height
//     // }px`;

//     function renderItem(item) {
//       console.log(item,'1111');
//       if (!item) return document.createElement("div");

//       const lineContainer = document.createElement("div");
//       lineContainer.style.position = "absolute";
//       lineContainer.style.top = `${item.offset}px`;
//       lineContainer.style.width = "100%";
//       lineContainer.style.height = `${item.height}px`;
//       lineContainer.style.display = "flex";
//       lineContainer.style.alignItems = "center";

//       const lineNumberDiv = document.createElement("div");
//       lineNumberDiv.style.width = "40px";
//       lineNumberDiv.style.textAlign = "center";
//       lineNumberDiv.style.color = "#fff";
//       lineNumberDiv.style.paddingRight = "10px";
//       lineNumberDiv.textContent = `${item.index + 1}`;
//       lineNumberDiv.style.fontFamily = "monospace";

//       const codeContainer = document.createElement("pre");
//       codeContainer.style.margin = "0";
//       codeContainer.style.whiteSpace = "pre-wrap";
//       codeContainer.style.fontFamily = "monospace";

//       requestAnimationFrame(() => {
//         customHighlighted(item.text, mode, codeContainer, customHighlight, styleTag);
//       });

//       lineContainer.appendChild(lineNumberDiv);
//       lineContainer.appendChild(codeContainer);

//       return lineContainer;
//     }

//     // console.log("Scroller Height:", scrollerContainer.clientHeight);

//     // ✅ **正确初始化 VirtualScroller**
//     const virtualScroller = new VirtualScroller(scrollerContainer, items, renderItem, {
//       // itemHeight: (index) => items[index]?.height || lineHeight,
//       scrollableContainer: divContainer,
//     });

//   });
// }


// 更新行号，使其与代码内容同步
function updateLineNumbers(scrollY, lineHeight, divContainer, lineNumbers) {
  console.log(lineNumbers, '行号容器');

  // ✅ **使用 divContainer.clientHeight 获取可见区域高度**
  const startLine = Math.floor(scrollY / lineHeight); // 计算起始行号
  const visibleLines = Math.ceil(divContainer.clientHeight / lineHeight) + 1; // 计算可见行数
  console.log(startLine,visibleLines);
  

  // ✅ **仅渲染可见的行号**
  lineNumbers.innerHTML = Array.from({ length: visibleLines }, (_, i) =>
    `<div style="line-height:${lineHeight}px;">${startLine + i + 1}</div>`
  ).join("");
  console.log(lineNumbers);
  

  // ✅ **同步行号滚动**
  // const offset = scrollY % lineHeight;
  lineNumbers.style.transform = `translateY(${scrollY}px)`;
}


export function renderCodeWithLineNumbers(
  divContainer,
  code,
  mode,
  lineHeight = 16,
  customHighlight = [],
  styleTag
) {
  const items = code.split("\n"); // 拆分代码为行
  const totalLines = items.length;

  // **创建整体布局**
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
      display: flex;
      height: ${divContainer.clientHeight}px;
      font-family: monospace;
    `;

  // **行号容器**
  const lineNumbers = document.createElement("div");
  lineNumbers.style.cssText = `
      width: 40px;
      text-align: right;
      color: #fff;
      overflow: hidden;
      user-select: none;
      position: relative;
      background: #3f4b69;
      text-align: center;
    `;

  // **代码内容容器**
  const codeContainer = document.createElement("div");
  codeContainer.style.cssText = `
      flex: 1;
      color: #fff;
      background: rgb(53, 63, 88);
    `;

  wrapper.appendChild(lineNumbers);
  wrapper.appendChild(codeContainer);
  divContainer.appendChild(wrapper);

  // **初始化 VirtualScroller**
  const virtualScroller = new VirtualScroller(
    codeContainer,
    items,
    (item) => {
      const codeContent = document.createElement("pre");
      codeContent.style.cssText = `
          margin: 0;
          white-space: pre-wrap;
          line-height: ${lineHeight}px;
          flex: 1;
        `;

      requestAnimationFrame(() => {
        customHighlighted(item, mode, codeContent, customHighlight, styleTag);
      });

      return codeContent;
    },
    {
      onScrollPositionChange: (scrollY) => {
        updateLineNumbers(scrollY, lineHeight, divContainer, lineNumbers);
      },
      scrollableContainer: divContainer, // 监听外部 divContainer 滚动
    }
  );

  return virtualScroller;
}



