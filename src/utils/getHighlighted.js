/*
 * @Author: yunlu.lai1@dbappsecurity.com.cn yunlu.lai1@dbappsecurity.com.cn
 * @Date: 2024-12-24 16:36:29
 * @LastEditors: yunlu.lai1@dbappsecurity.com.cn yunlu.lai1@dbappsecurity.com.cn
 * @LastEditTime: 2024-12-24 17:44:17
 * @FilePath: \code-mirror\mirror-hight\src\utils\gr.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import 'codemirror/lib/codemirror.css';  // 导入基本样式
// import 'codemirror/theme/monokai.css';   // 导入主题样式
import 'codemirror/theme/cobalt.css';   // 导入主题样式
import 'codemirror/theme/dracula.css';   // 导入主题样式
import 'codemirror/theme/mbo.css';   // 导入主题样式
import 'codemirror/theme/monokai.css';   // 导入主题样式
import 'codemirror/theme/night.css';   // 导入主题样式
import 'codemirror/theme/bespin.css';   // 导入主题样式
import 'codemirror/mode/javascript/javascript'; // 导入 JavaScript 模式
import CodeMirror from 'codemirror'; // 导入 CodeMirror

const getHighlighted = (code, mode, theme,container) => {
    if (!container) {
      throw new Error("A container element is required to render highlighted code.");
    }

    const pre = document.createElement('pre');
    pre.style.backgroundColor = '#efefef';  // 设置背景色
    pre.style.color = '##d0d0d0';  // 设置文字颜色
    pre.style.padding = '10px';
    pre.style.borderRadius = '15px';

    pre.className=`cm-s-${theme}`
    // 使用 runMode 高亮代码
    CodeMirror.runMode(code, mode, (text, style) => {
      
      const span = document.createElement('span');
      console.log(pre.className,'pre.className');
      
      if (style) {
        // span.className = `${themePrefix} cm-${style}`; 
        console.log(`Token text: ${text}, Style: ${style} codemirror`); // 打印 token 文本和其对应的样式

        span.className = `cm-${style}`;  // 添加高亮样式类
      }
      span.textContent = text;
      pre.appendChild(span);
      console.log(span,'span');
      
    });

    container.innerHTML = '';  // 清空容器内容
    container.appendChild(pre);  // 将高亮的代码添加到容器中
  };
  export default getHighlighted;