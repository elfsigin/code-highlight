/*
 * @Author: yunlu.lai1@dbappsecurity.com.cn yunlu.lai1@dbappsecurity.com.cn
 * @Date: 2024-12-23 14:47:02
 * @LastEditors: yunlu.lai1@dbappsecurity.com.cn yunlu.lai1@dbappsecurity.com.cn
 * @LastEditTime: 2024-12-24 15:59:47
 * @FilePath: \code-mirror\mirror-hight\src\App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import MirrorLezer from './pages/Mirror-lezer'
import CodeEditor from './pages/codeEditor'
import { useState,useEffect } from 'react';
import {getHighlightedHtml} from './utils/getHighlightedHtml'
import CodeMirrorHighlightComponent from './pages/CodeMirrorHighlightComponent' 



function App() {
  const [input, setInput] = useState("let a = 1;"); // 通过状态存储代码
  const handleChange = (e) => {
    setInput(e.target.value); // 更新输入的代码
  };
  const [code, setCode] = useState('console.log("Hello, CodeMirror!");');
  
  useEffect(() => {
    const code = `
    function greet() {
      console.log("Hello, CodeMirror!");
    }
    `;
    const container = document.getElementById('highlight-container');
    getHighlightedHtml(code, 'javascript', container);  // 调用高亮函数
  }, []);


  return (
    <div>
      <textarea 
        value={input} 
        onChange={handleChange} 
        rows={10} 
        cols={30} 
        placeholder="Enter your code here..."
      />
      {/* <MirrorLezer code={input} />  动态渲染高亮的代码 */}
       {/* < MirrorHas code={input} /> */}

       <div style={{ height: '400px' }}>
      <CodeEditor
        value={code}
        mode="javascript"
        theme="monokai"
        onChange={(newCode) => setCode(newCode)}
      />
    </div>
    <CodeMirrorHighlightComponent />,
    <div>
      <h1>Code Highlighter Example</h1>
      <div id="highlight-container"></div>  {/* 代码高亮显示的容器 */}
    </div>



    </div>
  );
}

export default App;
