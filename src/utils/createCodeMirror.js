/*
 * @Author: yunlu.lai1@dbappsecurity.com.cn yunlu.lai1@dbappsecurity.com.cn
 * @Date: 2024-12-24 09:23:23
 * @LastEditors: yunlu.lai1@dbappsecurity.com.cn yunlu.lai1@dbappsecurity.com.cn
 * @LastEditTime: 2024-12-24 09:23:32
 * @FilePath: \code-mirror\mirror-hight\src\utils\createCodeMirror.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

export function createCodeMirror(element, options) {
  if (!element) {
    throw new Error("Element is required to initialize CodeMirror.");
  }

  const editor = CodeMirror(element, {
    value: options.value || '',
    mode: options.mode || 'javascript',
    theme: options.theme || 'default',
    lineNumbers: options.lineNumbers || true,
    readOnly: options.readOnly || false,
    ...options,
  });
  console.log("Hello, CodeMirror!"); 

  return editor;
}
