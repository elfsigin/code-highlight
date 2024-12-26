import React, { useEffect, useRef } from 'react';
import { createCodeMirror } from '../../utils/createCodeMirror'; // 引入 createCodeMirror
import 'codemirror/theme/monokai.css'; // 引入主题样式

export default function CodeEditor({
  value = '',
  mode = 'javascript',
  theme = 'monokai',
  lineNumbers = true,
  readOnly = false,
  onChange,
}) {
  const editorRef = useRef(null); // 用于保存 CodeMirror 实例
  const containerRef = useRef(null); // 用于绑定 CodeMirror 容器

  useEffect(() => {
    // 初始化 CodeMirror 实例
    editorRef.current = createCodeMirror(containerRef.current, {
      value,
      mode,
      theme,
      lineNumbers,
      readOnly,
    });

    // 监听 CodeMirror 的 change 事件，触发 onChange
    editorRef.current.on('change', () => {
      onChange && onChange(editorRef.current.getValue());
    });

    // 清理工作：卸载时销毁 CodeMirror 实例
    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea(); // 将 CodeMirror 编辑器还原为普通 textarea
      }
    };
  }, [value, mode, theme, lineNumbers, readOnly, onChange]);

  return <div ref={containerRef} style={{ height: '100%' }} />; // 将 editor 渲染到该容器中
}
