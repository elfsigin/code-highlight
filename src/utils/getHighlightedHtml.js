/*
 * @Author: yunlu.lai1@dbappsecurity.com.cn yunlu.lai1@dbappsecurity.com.cn
 * @Date: 2024-12-24 09:38:50
 * @LastEditors: yunlu.lai1@dbappsecurity.com.cn 2714838232@qq.com
 * @LastEditTime: 2024-12-30 16:28:58
 * @FilePath: \code-mirror\mirror-hight\src\utils\getHighlightedHtml.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python'; // Python
import 'codemirror/mode/htmlmixed/htmlmixed'; // HTML
import 'codemirror/mode/sql/sql'; // 导入 JavaScript 模式
import 'codemirror/mode/clike/clike'; // Java 属于 clike 模式
import 'codemirror/mode/shell/shell'; // Java 属于 clike 模式

import CodeMirror from 'codemirror'; // 导入 CodeMirror
import 'codemirror/addon/runmode/runmode.js'; // 引入 runmode.js

import 'codemirror/addon/mode/simple.js';
import {
  stylesDefaultLog,
  stylesDefault
} from '../theme/defaultcss'


//日志自定义高亮关键字
CodeMirror.defineSimpleMode("logLang", {
  start: [
    // 文件路径和代码行号
    {
      regex: /File "([^"]+)", line (\d+), in (\w+)/,
      token: ["file-path", "line-number", "function-name"]
    },

    // 异常类型及描述
    {
      regex: /([a-zA-Z0-9_.]+): \(([^)]+)\) (.+)/,
      token: ["exception-type", "exception-code", "exception-message"]
    },

    // URL
    {
      regex: /(https?:\/\/[^\s]+)/,
      token: "url"
    },

    // 时间戳
    {
      regex: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}/,
      token: "date"
    },

    // 日志级别
    {
      regex: /\b(INFO|DEBUG|WARNING|ERROR|CRITICAL)\b/,
      token: function (match) {
        return {
          INFO: "info",
          DEBUG: "debug",
          WARNING: "warning",
          ERROR: "error",
          CRITICAL: "critical"
        }[match[0]];
      }
    },

    // 文件名与行号
    {
      regex: /(\w+\.py):(\d+)/,
      token: ["file-name", "line-number"]
    },

    // 日志正文
    {
      regex: /-\s(.+)$/,
      token: "message"
    }
  ]
});

export function getHighlightedHtml(
  code,
  mode,
  theme,
  customStyles = {},
  container,
  customHighlight = [] //用户自定义高亮规则

) {
  if (!container) {
    throw new Error("A container element is required to render highlighted code.");
  }

  // 清空容器
  container.innerHTML = '';
  //代码：  代码行pre（CodeMirror-line）->大spna（presentation） ->各小span
  //行号：div（CodeMirror-gutter-wrapper-> div（CodeMirror-linenumber CodeMirror-gutter-elt 数字
  //大盒子 div divline（包括）
  //大盒子  div位gutter（position left：0）+ divline

  //包括一层大容器（槽号和代码行并列）
  const scrollDiv = document.createElement('div');
  scrollDiv.style.display = 'flex';
  // scrollDiv.style.backgroundColor = '#353f58';
  scrollDiv.style.maxHeight = '500px';

  // 创建主容器(放置行号和槽号)
  const divContainer = document.createElement('div')
  divContainer.style.position = 'relative';

  //创建gutter容器,存放行号槽(与lines同级)
  const DivGutter = document.createElement('div')
  DivGutter.style.position = 'absolute';
  DivGutter.style.height = '500px';
  DivGutter.style.boxSizing = 'content-box'
  DivGutter.style.width = '29px';
  DivGutter.style.background = '#3f4b69';
  DivGutter.style.left = '0px';
  // 创建lines容器(放置行code和槽号数字)
  const divContainerLines = document.createElement('div');
  divContainerLines.style.position = 'relative';
  divContainerLines.style.marginLeft = '29px';
  divContainerLines.style.backgroundColor = '#353f58';
  divContainerLines.style.maxHeight = '500px'

  // 创建 <pre> 标签
  const pre = document.createElement('pre');
  pre.style.backgroundColor = '#353f58';
  pre.style.color = '#dcdcdc';
  pre.style.height = '500px';
  pre.style.overflowX = 'auto';
  pre.style.lineHeight = '1.5em';
  pre.style.fontFamily = 'monospace';
  //将DivGutter与codemirror-line并列
  divContainer.appendChild(DivGutter)
  // 创建 <style> 标签
  const styleTag = document.createElement('style');
  divContainer.appendChild(styleTag);
  // 合并样式
  let newStyles = mode === 'logLang' ? stylesDefaultLog : stylesDefault;
  if (customStyles) {
    newStyles = mergeStyles(newStyles, customStyles);
  }
  styleTag.textContent = newStyles;

  // 处理代码内容t
  if (CodeMirror && CodeMirror.runMode) {
    const lines = typeof code === 'string' ? code.split('\n') : code; // 将字符串按行分割    

    // console.log(code.split('\n'),"code.split('\n')");

    lines.forEach((line, index) => {
      if (line.trim() === '') return;

      // 创建行号
      const lineDiv = document.createElement('div');
      lineDiv.style.position = "relative";

      const lineNumberDiv = document.createElement('div');
      lineNumberDiv.style.position = 'absolute';
      lineNumberDiv.style.left = '-29px';
      lineNumberDiv.style.color = '#fff';
      lineNumberDiv.style.display = 'inline-block';
      lineNumberDiv.style.width = '29px'; // 行号宽度，适配多位数行号
      lineNumberDiv.style.textAlign = 'center';
      lineNumberDiv.style.zIndex = '4';
      lineNumberDiv.style.fontSize = '14px';

      lineNumberDiv.textContent = String(index + 1);
      lineDiv.appendChild(lineNumberDiv)

      // 渲染代码行
      const codeDiv = document.createElement('div');
      const codeSpan = document.createElement('span');
      codeSpan.style.paddingLeft='4px';
      CodeMirror.runMode(line, mode, (text, style) => {
        const span = document.createElement('span');
        if (style) {
          span.className = `cm-${style}`;
        }
        span.textContent = text;
        codeSpan.appendChild(span);
        codeDiv.appendChild(codeSpan);
      });
      // 创建行容器
      const lineContainer = document.createElement('div');
      lineContainer.appendChild(lineNumberDiv);
      lineContainer.appendChild(codeDiv);
      pre.appendChild(lineContainer);
    });
  } else {
  }
  // 将 <pre> 添加到容器中
  divContainerLines.appendChild(pre);
  divContainer.appendChild(divContainerLines)
  container.appendChild(divContainer);
}



// 样式合并函数
function mergeStyles(defaultStyles, customStyles) {
  const styleMap = {};
  defaultStyles.split('}').forEach(rule => {
    const [selector, styles] = rule.split('{');
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
    .join('\n');
}


//去掉样式style的格式
function cleanStyles(styles) {
  return styles.replace(/\s+/g, ' ').trim(); // 去除多余空白
}

function renderLineWithCustomRules({
  line,
  lineNumber,
  language,
  customHighlight
}) {
  let renderedLine = line;

  // 应用自定义规则
  customHighlight.forEach(({
    match,
    render
  }) => {
    const matches = [...line.matchAll(match)];
    matches.forEach((matchedItem) => {
      const renderedContent = render(matchedItem[0], {
        lineNumber,
        match: matchedItem,
        regex: match,
      });
      if (renderedContent) {
        renderedLine = renderedLine.replace(matchedItem[0], renderedContent);
      }
    });
  });

  // 如果有语言高亮模式，使用 CodeMirror
  if (CodeMirror && CodeMirror.runMode) {
    const codeSpan = document.createElement("span");
    CodeMirror.runMode(line, language, (text, style) => {
      const span = document.createElement("span");
      if (style) {
        span.className = `cm-${style}`;
      }
      span.textContent = text;
      codeSpan.appendChild(span);
    });
    return codeSpan.innerHTML;
  }
  return renderedLine; // 返回最终渲染结果
}