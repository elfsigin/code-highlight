/*
 * @Author: yunlu.lai1@dbappsecurity.com.cn yunlu.lai1@dbappsecurity.com.cn
 * @Date: 2024-12-24 17:00:18
 * @LastEditors: yunlu.lai1@dbappsecurity.com.cn yunlu.lai1@dbappsecurity.com.cn
 * @LastEditTime: 2024-12-24 17:54:56
 * @FilePath: \code-mirror\mirror-hight\src\pages\show\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useRef, useEffect } from "react";
import getHighlighted from "../../utils/getHighlighted"; // 引入高亮函数
import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";

const Show = () => {
  const containerRef = useRef(null);
  const themePrefix = "cm-s-bespin"; // 可根据需要更改主题前缀

  const [language,setLanguage]=useState('javascript')
  const [theme,setTheme]=useState('monokai')
  useEffect(() => {
    const code = `
    function greet() {
      console.log("Hello, CodeMirror!");
    }
    `;
    // getHighlighted(code, "javascript", themePrefix, containerRef.current); // 调用高亮函数
    getHighlighted(code, language, theme, containerRef.current); // 调用高亮函数
  }, [language,theme]);
 
  const itemsLanguage=[
    {
        label:'javascript',
        key:'javascript'
    },
    {
        label:'Html',
        key:'html'
    },
    {
        label:'java',
        key:'java'
    },
    {
        label:'sql',
        key:'sql'
    },
    {
        label:'python',
        key:'python'
    },

  ]
  const handleMenuClick=(e)=>{
    console.log(e,'e');
    setLanguage(e.key)

  }
  const menuProps={
    items:itemsLanguage,
    defaultSelectedKeys:'javascript',
    onClick:handleMenuClick
  }

  const itemsTheme=[
    {
        label:'cobalt',
        key:'cobalt'
    },
    {
        label:'dracula',
        key:'dracula'
    },
    {
        label:'mbo',
        key:'mbo'
    },
    {
        label:'monokai',
        key:'monokai'
    },
    {
        label:'night',
        key:'night'
    },

  ]
  const handleThemeClick=(e)=>{
    console.log(e,'e');
    setTheme(e.key)

  }
  const menuThemeProps={
    items:itemsTheme,
    defaultSelectedKeys:'monokai',
    onClick:handleThemeClick
  }
  


  return (
    <div>
       <Dropdown.Button 
       icon={< DownOutlined />}
       menu={menuProps} onClick={handleMenuClick}
       
       >
      {language}
    </Dropdown.Button>
       <Dropdown.Button 
       icon={< DownOutlined />}
       menu={menuThemeProps} onClick={handleThemeClick}
       
       >
      {theme}
    </Dropdown.Button>
      {/* <CodeMirrorHighlightComponent />, */}
      <div>
        <h1>Code Highlighter 只高亮代码：</h1>
        <div id="highlight-container" ref={containerRef}></div>{" "}
        {/* 代码高亮显示的容器 */}
      </div>
    </div>
  );
};

export default Show;
