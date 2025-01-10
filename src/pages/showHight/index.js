import React, { useState, useRef, useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
// import {getHighlightedHtml}  from '../../utils/getHighlightedHtml'; // 引入高亮函数
import { getHighlightedHtml, editCode } from "../../utils/high"; // 引入高亮函数

const ShowHight = () => {
  const [code, setCode] = useState(`2024-12-23 10:30:01 INFO Starting server...
2024-12-23 10:31:02 ERROR Failed to connect to database.
2024-12-23 10:32:03 WARN Cache miss detected.const customHighlight = [
  {
    match: /INFO/g,
    renderFn: (text) => {
      return { content: <a style="background-color:hsl(57, 83.10%, 51.20%);" href="https://zh-hans.react.dev/learn" target="_blank">test}</a> }; // 将 console 渲染为粗体
    }
  }
`);
  const [edit, setEdit] = useState(true);
  const containerRef = useRef(null); // 用于渲染高亮代码的容器
  const codeInpit = useRef(null); // 用于渲染高亮代码的容器
  const themePrefix = "bespin"; // 可根据需要更改主题前缀
  //   const themePrefix = 'cm-s-midnight'; // 可根据需要更改主题前缀

  const [language, setLanguage] = useState("logLang");
  const [theme, setTheme] = useState("night");
  // 自定义高亮规则
  const customHighlight = [
    {
      match: /INFO/g,
      renderFn: (text) => {
        return `<a style="background-color:hsl(57, 83.10%, 51.20%);" href="https://zh-hans.react.dev/learn" target="_blank">${text}</a>`;
        // 将 console 渲染为粗体
      },
    },
    {
      match: /console/g,
      renderFn: (text) => {
        return `<a href="https://zh-hans.react.dev/learn" target="_blank">${text}</a>`; // 将 console 渲染为粗体
      },
    },
  ];
  //自定义样式
  //下拉主题和语言的菜单配置
  const itemsLanguage = [
    {
      label: "javascript",
      key: "javascript",
    },
    {
      label: "Html",
      key: "htmlmixed",
    },
    {
      label: "java",
      key: "text/x-java",
    },
    {
      label: "sql",
      key: "sql",
    },
    {
      label: "python",
      key: "python",
    },
    {
      label: "logLang",
      key: "logLang",
    },
  ];

  const itemsTheme = [
    {
      label: "night",
      key: "night",
    },
    {
      label: "logLang",
      key: "logLang",
    },
  ];
  const handleMenuClick = (e) => {
    console.log(e, "e");
    setLanguage(e.key);
  };
  const menuProps = {
    items: itemsLanguage,
    defaultSelectedKeys: "javascript",
    onClick: handleMenuClick,
  };
  const handleThemeClick = (e) => {
    setTheme(e.key);
  };
  const menuThemeProps = {
    items: itemsTheme,
    defaultSelectedKeys: "night",
    onClick: handleThemeClick,
  };

  // 处理按钮点击，进行高亮
  const handleHighlight = () => {
    const customStyles = {
      info: "color: red; font-style: italic;",
      debug: "color: gray;",
    };
    getHighlightedHtml(
      code,
      language,
      theme,
      customStyles,
      containerRef.current,
      customHighlight,
      false
    );
  };

  // 处理文本框的输入
  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleEdit = () => {
    console.log(containerRef.current, "containerRef.current1");

    containerRef.current.innerHTML = "";
    console.log(containerRef.current, "containerRef.current2");
    // getHighlightedHtml(code, language, theme, {},containerRef.current,customHighlight,true);
    editCode(code, language, containerRef.current);
  };
  const handleEditText = () => {
    getHighlightedHtml(
      code,
      "javascript",
      theme,
      {},
      containerRef.current,
      [],
      true
    )(code, "javascript", containerRef.current, true);
  };
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
      <h3>CodeMirror Syntax 只高亮，可以设置主题：</h3>
      <div id="code-container">
        <textarea
          id="code-input"
          ref={codeInpit}
          rows="10"
          cols="50"
          value={code}
          onChange={handleCodeChange}
        />
        <button id="highlight-btn" onClick={handleHighlight}>
          Highlight Code
        </button>
        <button id="highlight-btn" onClick={handleEdit}>
          编辑
        </button>
        <button id="highlight-btn" onClick={handleEditText}>
          fromTextArea编辑
        </button>
      </div>
      {/* <div id="output" ref={containerRef}></div> */}
      <div id="output" ref={containerRef} />
    </div>
  );
};
export default ShowHight;
