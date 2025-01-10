/*
 * @Author: yunlu.lai1@dbappsecurity.com.cn yunlu.lai1@dbappsecurity.com.cn
 * @Date: 2024-12-26 11:11:02
 * @LastEditors: yunlu.lai1@dbappsecurity.com.cn 2714838232@qq.com
 * @LastEditTime: 2025-01-09 16:04:41
 * @FilePath: \code-mirror\mirror-hight\src\theme\defaultcss.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export const stylesDefaultLog = `
.cm-date{
  color:#2196f3;
  font-weight: bold;
  // background-color: #f5f5f5;
}

.cm-log-level {
  font-weight: bold;
}

.cm-log-level.debug {
  color: blue;
}

.cm-log-level.info {
  color: green;
}

.cm-log-level.warning {
  color: orange;
}

.cm-log-level.error {
  color: red;
}

.cm-log-level.fail {
  color: purple;
}

.cm-url {
  color:rgb(30, 32, 33); 
  text-decoration: underline;
  background-color: #f5f5f5;

}
  
.cm-boolean-constant {
  color:rgb(71, 41, 23); 
  font-weight: bold;
  background-color: #f5f5f5;
}

.cm-null-constant {
  color:rgb(245, 175, 215); 
  font-weight: bold;
}

.cm-integer-constant {
  color: #42b983; 
  font-weight:bold;
}

.cm-float-constant {
  color: #3eafc2; 
  font-weight:bold;
}

.cm-string-constant {
  color: #ff9800;
  font-style: italic;
}

.cm-guid {
  color: #607d8b; 
}
  .cm-mac {
  color: #00bcd4; 
}
.cm-ip-address {
  color:rgb(240, 204, 193); /* 橙色 */
  font-weight: bold;
  font-decoration: underline;
}

.cm-exception-type {
  color:rgb(54, 57, 51); 
  font-weight: bold;
  background-color:rgb(154, 44, 44);
}
.cm-function-name {
  color: #3f51b5; 
}
/* 异常堆栈跟踪部分 */
.cm-exception-stack {
  color: #607d8b; /* 蓝灰色 */
  font-style: italic;
}
/* 类名部分 */
.cm-class-name {
  color: #2196f3; /* 蓝色 */
  font-weight: bold;
}
/* 方法名部分 */
.cm-method-name {
  color: #4caf50; /* 绿色 */
}

/* 文件路径部分 */
.cm-file-path {
  color: #ff9800; /* 橙色 */
  font-style: italic;
}
  `;
export const stylesDefault=`

.cm-comment { color:rgb(37, 72, 111); }
.cm-atom { color:rgb(88, 81, 100)66, 108); }
.cm-number { color: #D1EDFF; }

.cm-property, 
.cm-attribute { color:rgb(66, 69, 229); }
.cm-keyword { color:rgb(163, 251, 47); }
.cm-string { color:rgb(230, 50, 56); }

.cm-variable { color:rgb(255, 62, 168); }
.cm-variable-2 { color:rgb(255, 62, 168); }
.cm-def { color: #4DD; }
.cm-bracket { color: #D1EDFF; }
.cm-tag { color:rgb(100, 183, 97); }
.cm-link { color: #AE81FF; }
.cm-error { background: #F92672; color: #F8F8F0; }
  `