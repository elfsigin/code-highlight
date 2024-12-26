import React, { useState, useRef ,useEffect} from 'react';
import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import {getHighlightedHtml}  from '../../utils/getHighlightedHtml'; // 引入高亮函数

const ShowHight = () => {
  const [code, setCode] = useState(`function greet() {\n  console.log("Hello, CodeMirror!");\n}`);
  const containerRef = useRef(null); // 用于渲染高亮代码的容器
  const themePrefix = 'bespin'; // 可根据需要更改主题前缀
//   const themePrefix = 'cm-s-midnight'; // 可根据需要更改主题前缀
 
  const [language,setLanguage]=useState('javascript')
  const [theme,setTheme]=useState('night')
  //自定义样式



//下拉主题和语言的菜单配置
const itemsLanguage=[
  {
      label:'javascript',
      key:'javascript'
  },
  {
      label:'Html',
      key:'htmlmixed'
  },
  {
      label:'java',
      key:'text/x-java'
  },
  {
      label:'sql',
      key:'sql'
  },
  {
      label:'python',
      key:'python'
  },
  {
      label:'logLang',
      key:'logLang'
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
  // {
  //     label:'cobalt',
  //     key:'cobalt'
  // },
  // {
  //     label:'dracula',
  //     key:'dracula'
  // },
  // {
  //     label:'mbo',
  //     key:'mbo'
  // },
  // {
  //     label:'monokai',
  //     key:'monokai'
  // },
  {
      label:'night',
      key:'night'
  },
  {
      label:'logLang',
      key:'logLang'
  },

]
const handleThemeClick=(e)=>{
  console.log(e,'e');
  setTheme(e.key)

}
const menuThemeProps={
  items:itemsTheme,
  defaultSelectedKeys:'night',
  onClick:handleThemeClick
}
// useEffect(() => {
//   const code = `
//   function greet() {
//     console.log("Hello, CodeMirror!");
//   }
//   `;
//   // getHighlighted(code, "javascript", themePrefix, containerRef.current); // 调用高亮函数
//   getHighlighted(code, language, theme, containerRef.current); // 调用高亮函数
// }, [language,theme]);






  // 处理按钮点击，进行高亮
  const handleHighlight = () => {
    console.log(language,'language');

    const customStyles = {
      info: "color: red; font-style: italic;",
      debug: "color: gray;"
    };

    getHighlightedHtml(code, language, theme, customStyles,containerRef.current);
  };

  // 处理文本框的输入
  const handleCodeChange = (event) => {
    
    setCode(event.target.value);
  };

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

      <h3>CodeMirror Syntax 只高亮，可以设置主题：</h3>
      <div id="code-container">
        <textarea
          id="code-input"
          rows="10"
          cols="50"
          value={code}
          onChange={handleCodeChange}
        />
        <button id="highlight-btn" onClick={handleHighlight}>
          Highlight Code
        </button>
      </div>
      <div id="output" ref={containerRef}></div>
    </div>
  );
};

export default ShowHight;
