import React, { useState, useRef, useEffect } from 'react';
import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { getHighlightedHtml } from '../../utils/getHighlightedHtml'; // 引入高亮函数

const ParamsHight = () => {
  const [stringCode, setStringCode] = useState(`const mergedStyles = mergeStyles(defaultStyles, customStyles);
      console.log("Merged Styles:\\n", mergedStyles); `);
  const [arrrayCode, setArrayCode] = useState([(`2024-12-13 10:00:07,185 | INFO | system.py:2609 - migrate asset password export result: password_export: true\n`),(`2024-12-134 10:00:07,185 | INFO | system.py:2609 - migrate asset password export result: password_export: true\n`)]);
  const containerRef1 = useRef(null); // 用于渲染高亮代码的容器
  const containerRef2 = useRef(null); // 用于渲染高亮代码的容器
  const [language, setLanguage] = useState('javascript');
  const [customStyles, setCustomStyles] = useState({
    info: "color: red; font-style: italic;",
    debug: "color: gray;",
  });
  const [theme, setTheme] = useState('night');

  // 下拉主题和语言的菜单配置
  const itemsLanguage = [
    { label: 'javascript', key: 'javascript' },
    { label: 'Html', key: 'htmlmixed' },
    { label: 'java', key: 'text/x-java' },
    { label: 'sql', key: 'sql' },
    { label: 'python', key: 'python' },
    { label: 'logLang', key: 'logLang' },
  ];

  const handleMenuClick = (e) => {
    setLanguage(e.key);
  };

  const menuProps = {
    items: itemsLanguage,
    defaultSelectedKeys: 'javascript',
    onClick: handleMenuClick
  };

  const itemsTheme = [
    { label: 'night', key: 'night' },
    { label: 'logLang', key: 'logLang' },
  ];

  const handleThemeClick = (e) => {
    setTheme(e.key);
  };

  const menuThemeProps = {
    items: itemsTheme,
    defaultSelectedKeys: 'night',
    onClick: handleThemeClick
  };

  // 更新 stringCode 的函数
//   const handleUpdateCode = () => {
//     setStringCode(`const mergedStyles = mergeStyles(defaultStyles, customStyles);
//       console.log("Merged Styles:\\n", mergedStyles);
//     `);
//   };

useEffect(() => {
    // 在语言、主题或代码更新时重新高亮显示代码
    if (containerRef1.current) {
      getHighlightedHtml(stringCode, language, theme, customStyles, containerRef1.current);
    }

    if (containerRef2.current) {
      getHighlightedHtml(arrrayCode, language, theme, customStyles, containerRef2.current);
    }
  }, [stringCode, arrrayCode, language, theme, customStyles]); // 当这些状态变化时执行高亮函数

  return (
    <div>
      <Dropdown.Button
        icon={<DownOutlined />}
        menu={menuProps}
        onClick={handleMenuClick}
      >
        {language}
      </Dropdown.Button>

      <Dropdown.Button
        icon={<DownOutlined />}
        menu={menuThemeProps}
        onClick={handleThemeClick}
      >
        {theme}
      </Dropdown.Button>

      {/* 字符串 */}
      <h3>CodeMirror Syntax 传入参数是string字符串：</h3>
      <div id="output1" ref={containerRef1}></div>

      {/* 数组 */}
      <h3>CodeMirror Syntax 传入数据参数是array数组类型：</h3>
      <div id="output2" ref={containerRef2}></div>
    </div>
  );
};

export default ParamsHight;
