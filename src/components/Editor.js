import React, { useEffect } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import CodeMirror from 'codemirror';
// import codemirror from 'codemirror';
// import 'codemirror/mode/n'
// import 'codemirror/mode/';
const Editor = () => {
  // const editorRef = useRef(null);
    useEffect(() => {
        async function init(){
          if (!window.codeMirrorInstance) {
            window.codeMirrorInstance = Codemirror.fromTextArea(document.getElementById('realtime-editor'),{
                mode: {name: 'text/x-java', json: true},
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
                scrollbarStyle: 'native',
                
            });}

        }
        init(); 
    },[]);
  return (
    <textarea id="realtime-editor"></textarea>
    
  )
};

export default Editor   