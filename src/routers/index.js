import {
    createBrowserRouter,
} from "react-router-dom";
import LayOut from "../layouts";
import CodeEditor from '../pages/codeEditor';
import CodeMirrorHighlightComponent from '../pages/CodeMirrorHighlightComponent';
import ShowHight from '../pages/showHight';
import Show from '../pages/show';
import ParamsHight from '../pages/params';


const router=createBrowserRouter([
    {
      path:'/',
      element:(
        <div>
          <LayOut />
         
        </div>
      ),
      children:[
        {
          path:"CodeMirrorHighlightComponent",
          element:<CodeMirrorHighlightComponent></CodeMirrorHighlightComponent>
        },
        {
          path:"codeEditor",
          element:<CodeEditor></CodeEditor>
        },
        {
          path:"codeonlyHight",
          element:<ShowHight></ShowHight>
        },
        {
          path:"show",
          element:<Show></Show>
        },
        {
          path:"params",
          element:<ParamsHight></ParamsHight>
        }
      ]
    },
    
  ])

export default router;