/*
 * @Author: yunlu.lai1@dbappsecurity.com.cn yunlu.lai1@dbappsecurity.com.cn
 * @Date: 2024-12-24 09:38:50
 * @LastEditors: yunlu.lai1@dbappsecurity.com.cn yunlu.lai1@dbappsecurity.com.cn
 * @LastEditTime: 2024-12-26 17:40:14
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
export function getHighlightedHtml(code, mode, theme, customStyles = {},container, ) {
  if (!container) {
    throw new Error("A container element is required to render highlighted code.");
  }

  // 创建 <style> 和 <pre> 标签
  const divContainer = document.createElement('div');
  const styleTag = document.createElement('style');
  divContainer.appendChild(styleTag); // 将 style 标签加入 div 中

  const pre = document.createElement('pre'); // 创建 <pre> 标签
  pre.style.backgroundColor = 'rgb(51, 76, 105)'; // 设置背景色
  pre.style.color = 'rgb(12, 12, 12)'; // 设置文字颜色
  pre.style.padding = '10px';
  pre.style.borderRadius = '10px';
  // pre.className=`cm-s-${theme}`

  let newStyles = '';
  if (mode === 'logLang') {
    newStyles = stylesDefaultLog;
  } else {
    newStyles = stylesDefault;
  }
  if (customStyles) {
    newStyles = mergeStyles(newStyles, customStyles);
  }  
  styleTag.textContent = newStyles;
  // styleTag.textContent = cleanStyles(newStyles);
  if (CodeMirror && CodeMirror.runMode) {
    // CodeMirror.runMode(code, mode, (text, style) => {
    //   const span = document.createElement('span');
    //   if (style) {
    //     // console.log(style, 'style');
    //     span.className = ` cm-${style}`; // 添加高亮样式类
    //   }
    //   span.textContent = text;
    //   pre.appendChild(span);
    // });
    console.log(code,'code');

    if(Array.isArray(code)){
      console.log(code,'code');
      
      code.forEach(logEntry => {
      if (logEntry.trim() === '') {
        // 空行处理
        // pre.appendChild(document.createElement('br'));
        return;
      }

      // 直接将换行符 \n 交给 <pre> 标签来处理
      // 将 \n 转换为 <br> 标签来显示换行
      const logWithBreaks = logEntry.replace(/\n/g);  // 替换 \n 为 <br>

      // 对每条日志使用 CodeMirror 高亮处理
      CodeMirror.runMode(logWithBreaks, mode, (text, style) => {
        const span = document.createElement('span');
        if (style) {
          span.className = `cm-${style}`; // 添加高亮样式类
        }
        span.textContent = text; // 保持文本内容的高亮
        pre.appendChild(span); // 添加每条日志
      });

      // 每条日志结束后添加换行
      pre.appendChild(document.createElement('br'));  // 每行日志后添加换行
    })
    }else if(typeof code==='string' ){

      CodeMirror.runMode(code, mode, (text, style) => {
        const span = document.createElement('span');
        if (style) {
          span.className = `cm-${style}`; // 添加高亮样式类
        }
        span.innerHTML = text; // 使用 innerHTML 来允许 <br> 标签的显示
        pre.appendChild(span); // 添加代码
      });
          
      }else {
        console.error('Invalid code format. It should be either a string or an array of strings.');
      }
  } else {
    console.error('CodeMirror runMode is not available.');
  }
  // 将 <pre> 标签添加到 <div> 容器中
  divContainer.appendChild(pre);

  container.innerHTML = ''; // 清空容器内容
  container.appendChild(divContainer); // 将高亮的代码添加到容器中
  console.log(divContainer,'divContainer');
  const logInfo = () => {
    // 确保 CodeMirror 和 runMode 正常加载
    console.log(CodeMirror, 'CodeMirror'); // 输出 CodeMirror，确保它被正确加载
    console.log(CodeMirror.runMode, 'runMode'); // 确保 runMode 是一个函数
  }

}

function mergeStyles(defaultStyles, customStyles) {
  const styleMap = {};

  // 解析默认样式为键值对
  defaultStyles.split('}').forEach(rule => {
    const [selector, styles] = rule.split('{');
    if (selector && styles) {
      styleMap[selector.trim()] = styles.trim();
    }
  });

  // 合并自定义样式
  for (const [key, value] of Object.entries(customStyles)) {
    const selector = `.cm-${key}`;
    styleMap[selector] = value; 
  }

  // 转换为格式化的样式字符串
  return Object.entries(styleMap)
    .map(([selector, styles]) => `${selector} { ${styles} }`)
    .join('\n');
}
//去掉样式style的格式
function cleanStyles(styles) {
  return styles.replace(/\s+/g, ' ').trim(); // 去除多余空白
}