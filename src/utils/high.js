/*
 * @Author: yunlu.lai1@dbappsecurity.com.cn yunlu.lai1@dbappsecurity.com.cn
 * @Date: 2024-12-24 09:38:50
 * @LastEditors: yunlu.lai1@dbappsecurity.com.cn 2714838232@qq.com
 * @LastEditTime: 2025-01-14 14:11:23
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
  // scrollDiv.style.backgroundColor = '#353f58';
  scrollDiv.style.maxHeight = "500px";

  // 创建主容器(放置行号和槽号)
  const divContainer = document.createElement("div");
  divContainer.style.position = "relative";
  divContainer.style.height = "300px";
  divContainer.style.overflowY = "auto"; // 启用垂直滚动
  divContainer.style.width = "1240px";

  //创建gutter容器,存放行号槽(与lines同级)
  const DivGutter = document.createElement("div");
  DivGutter.style.position = "absolute";
  DivGutter.style.height = "500px";
  DivGutter.style.boxSizing = "content-box";
  DivGutter.style.width = "31px";
  DivGutter.style.background = "#3f4b69";
  DivGutter.style.left = "0px";
  // 创建lines容器(放置行code和槽号数字)
  const divContainerLines = document.createElement("div");
  divContainerLines.style.position = "relative";
  divContainerLines.style.marginLeft = "31px";
  divContainerLines.style.paddingLeft = "4px";
  divContainerLines.style.paddingRight = "4px";
  divContainerLines.style.backgroundColor = "#353f58";
  // divContainerLines.style.maxHeight = "500px"; //设置滚动区高度

  // 创建 <pre> 标签
  const pre = document.createElement("pre");
  pre.style.backgroundColor = "#353f58";
  pre.style.color = "#dcdcdc";
  pre.style.height = "500px";
  pre.style.overflowX = "auto";
  pre.style.margin = "0";
  // pre.style.whiteSpace = "pre-wrap"; // 保持空格，但会自动换行
  // pre.style.lineHeight = "1.2em";
  pre.style.fotSize = "14px";
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
  // console.log(styleTag,'styleTag');

  // 处理代码内容
  if (CodeMirror && CodeMirror.runMode && !isEdit) {
    // 创建行号
    const lineDiv = document.createElement("div");
    lineDiv.style.position = "relative";

    let lines = code.split("\n");

    //行容器
    const lineContainer = document.createElement("div");
    // lineContainer.style.backgroundColor = "yellow";

    const codeDiv = document.createElement("div");
    codeDiv.style.paddingTop = "4px";

    // 计算每行的高度
    const lineHeight = 15.2; // 每行的高度，根据实际情况调整
    // 计算容器可见区域的行数

    //     const updateSoftLineNumbers = (container) => {
    //       console.log(container,'container');

    //       container.childNodes.forEach((item) => {
    //         const lineDiv = document.createElement("div");
    //         lineDiv.innerHTML = "";
    //         const height = window.getComputedStyle(item).getPropertyValue('height');
    //         // const height = window.getComputedStyle(item).getPropertyValue('height');
    //         // const height = parseFloat(computedStyle.height); // 高度（px）
    //         // const lineHeight = parseFloat(computedStyle.lineHeight); // 行高（px）

    //         // 计算总行数
    //         const numberOfLines = Math.floor(height / 15.2);
    //         // 获取当前行的高度（如果没有指定则使用默认行高）
    //         console.log(height,'height');

    //         let lineHeightInPixels =
    //           item.offsetHeight
    //         // let lineHeightInPixels = parseFloat(
    //         //   // window.getComputedStyle(item).lineHeight
    //         //   item.getBoundingClientRect().height
    //         // );
    //         console.log(
    //           lineHeightInPixels,
    //           "lineHeight"
    //         );

    //         if (isNaN(lineHeightInPixels)) {
    //           lineHeightInPixels = lineHeight; // 使用默认的行高
    //         }

    //         const visibleLines = Math.ceil(item.scrollHeight / lineHeightInPixels);
    //         console.log(visibleLines, "visibleLines");

    //         for (let i = 0; i < visibleLines; i++) {
    //           const lineNumberDiv = document.createElement("div");
    //           lineNumberDiv.innerText = `${i + 1}`;
    //           lineNumberDiv.style.height = `${lineHeight}px`;
    //           lineNumberDiv.style.top = `${lineHeight * i}px`;
    //           // lineNumberDiv.style.backgroundColor = "red";
    //           lineNumberDiv.style.textAlign = "center";
    //           lineNumberDiv.style.position = "absolute";
    //           lineNumberDiv.style.left = "-31px";
    //           lineNumberDiv.style.color = "#fff";
    //           lineNumberDiv.style.display = "inline-block";
    //           lineNumberDiv.style.width = "31px"; // 行号宽度，适配多位数行号
    //           lineNumberDiv.style.paddingTop = "4px";
    //           lineNumberDiv.style.zIndex = "4";
    //           lineNumberDiv.style.fontSize = "14px";

    //           lineDiv.appendChild(lineNumberDiv);

    //         }
    //         divContainerLines.appendChild(lineDiv);
    //       });
    //     };
    //     code.split("\n").forEach((line) => {
    //       const divContainerLines = document.createElement("div");

    //       const codeContainerLine = document.createElement("pre");
    //       codeContainerLine.style.whiteSpace = "pre-wrap";
    //       codeContainerLine.style.margin = "0";
    //       codeContainerLine.style.paddingLeft = "4px";
    //       codeContainerLine.style.lineHeight = "15.2px";
    //       codeContainerLine.style.minHeight = "15.2px";  // 或者移除height属性

    //       if (customHighlight.length > 0) {
    //         customHighlighted(line, mode, codeContainerLine, customHighlight);
    //       } else {
    //         highlightRunMode(line, mode, codeContainerLine);
    //       }

    //       divContainerLines.appendChild(codeContainerLine);
    //       codeDiv.appendChild(divContainerLines);
    //       updateSoftLineNumbers(codeDiv);
    //     });

    lines.forEach((line, index) => {
      console.log(line, "line");
      const divContainerLines = document.createElement("div");
      const lineNumberDiv = document.createElement("div");
      lineNumberDiv.style.position = "absolute";
      lineNumberDiv.style.top = `${index * 15.2}px`; // 根据行号的顺序垂直排列
      // lineNumberDiv.style.backgroundColor = "red";
      lineNumberDiv.style.height = "15.2px";
      lineNumberDiv.style.left = "-31px";
      lineNumberDiv.style.color = "#fff";
      lineNumberDiv.style.display = "inline-block";
      lineNumberDiv.style.width = "31px"; // 行号宽度，适配多位数行号
      lineNumberDiv.style.textAlign = "center";
      lineNumberDiv.style.paddingTop = "4px";
      lineNumberDiv.style.zIndex = "4";
      lineNumberDiv.style.fontSize = "14px";
      lineNumberDiv.innerText = index + 1;
      divContainerLines.appendChild(lineNumberDiv);

      const codeContainerLine = document.createElement("pre");
      codeContainerLine.style.whiteSpace = "pre-wrap";
      codeContainerLine.style.margin = "0";

      // codeContainerLine.style.paddingLeft = "4px";
      if (customHighlight.length > 0) {
        customHighlighted(
          line,
          mode,
          codeContainerLine,
          customHighlight,
          styleTag
        );
      } else {
        highlightRunMode(line, mode, codeContainerLine);
      }
      divContainerLines.appendChild(codeContainerLine);
      codeDiv.appendChild(divContainerLines);
    });

    lineContainer.appendChild(codeDiv);
    pre.appendChild(lineContainer);
    divContainerLines.appendChild(pre);
    divContainer.appendChild(divContainerLines);
    // generateSoftLineNumbers(divContainer, code, mode);
    container.appendChild(divContainer);
  }
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
  console.log(container, "container");
  container.innerHTML = "";
  const editor = CodeMirror(container, {
    value: code,
    mode,
    lineNumbers: true,
    theme: "custom-theme",
    readOnly: false,
  });
}
export function editText(code, mode, container, isEdit) {
  console.log(container, "c");
  const textArea = document.createElement("textarea");
  textArea.value = code;
  container.innerHTML = "";
  container.appendChild(textArea);
  const editor = CodeMirror.fromTextArea(textArea, {
    value: code,
    mode,
    lineNumbers: true,
    theme: "custom-theme",
  });
}
// @param {HTMLElement} codeContainer - 包含代码的容器，行号和代码行将被添加到其中。
export function generateSoftLineNumbers(
  codeContainer,
  code,
  mode,
  customHighlight = [],
  lineHeight = 15.2
) {
  codeContainer.innerHTML = "";

  const outerContainer = document.createElement("div");
  outerContainer.style.display = "flex";
  outerContainer.style.flexDirection = "row";
  // outerContainer.style.backgroundColor = "yellow";

  //创建行号容器
  const lineNumberContainer = document.createElement("div");
  lineNumberContainer.style.width = "30px"; // 固定宽度，容纳行号
  lineNumberContainer.style.paddingTop = "4px";
  lineNumberContainer.style.backgroundColor = "#f4f4f4";
  lineNumberContainer.style.textAlign = "center";

  const codeWrapper = document.createElement("div");
  codeWrapper.style.flex = "1";
  codeWrapper.style.whiteSpace = "pre-wrap";
  codeWrapper.style.overflowY = "auto";
  codeWrapper.style.maxHeight = "500px";
  codeWrapper.style.fontFamily = "monospace";
  codeWrapper.style.lineHeight = `${lineHeight}px`;

  const codeLines = code.split("\n");
  codeLines.forEach((line, index) => {
    const codeLineDiv = document.createElement("div");
    codeLineDiv.textContent = line;
    //自定义高亮
    customHighlighted(line, mode, codeLineDiv, customHighlight);
    codeWrapper.appendChild(codeLineDiv);
  });
  const updateLineNumbers = () => {
    lineNumberContainer.innerHTML = "";
    let currentLineNumber = 1;
    codeWrapper.childNodes.forEach((codeLineDiv) => {
      const wrappedHeight = codeLineDiv.scrollHeight;
      const visibleLines = Math.ceil(wrappedHeight / lineHeight);
      for (let i = 0; i < visibleLines; i++) {
        const lineNumberDiv = document.createElement("div");
        lineNumberDiv.textContent = currentLineNumber;
        lineNumberDiv.style.height = `${lineHeight}px`;
        lineNumberContainer.appendChild(lineNumberDiv);
        currentLineNumber++;
      }
    });
  };
  outerContainer.appendChild(lineNumberContainer);
  outerContainer.appendChild(codeWrapper);
  codeContainer.appendChild(outerContainer);

  // 初始化和绑定滚动事件
  updateLineNumbers();
  codeWrapper.addEventListener("scroll", () => {
    const scrollTop = codeWrapper.scrollTop;
    lineNumberContainer.style.transform = `translateY(-${scrollTop}px)`;
  });

  // 动态调整窗口大小时更新行号
  window.addEventListener("resize", updateLineNumbers);
}
