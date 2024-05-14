import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';
// import CodeMirror from 'codemirror';
// import codemirror from 'codemirror';
// import 'codemirror/mode/n'
// import 'codemirror/mode/';
const Editor = ({socketRef, roomId}) => {
  const editorRef = useRef(null);
    useEffect(() => {
        async function init(){
          if (!window.codeMirrorInstance) {
            let textCode = Codemirror.fromTextArea(document.getElementById('realtime-editor'),{
                mode: {name: 'text/x-java', json: true},
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
                scrollbarStyle: 'native',
                
            }
          );
          window.codeMirrorInstance= textCode; 
          editorRef.current=textCode;
          
          editorRef.current.on('change', (instance, changes) => {
            console.log('change', changes);
            const { origin } = changes;
            const code = instance.getValue();
            if(origin !== 'setValue'){
              console.log('Working');
              socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                roomId,
                code,
              } );
            }
            console.log(code);

          });

          

          // editorRef.current.setValue("Hello World");
        }

        }
        init(); 
    },[roomId, socketRef]);

    useEffect(()=>{
      if(socketRef.current){
        socketRef.current.on(ACTIONS.CODE_CHANGE, ({code})=> {
          console.log('receiving', code);
          if(code!==null){
            editorRef.current.setValue(code);
          }
        });
      }
      // return () => {
      //   socketRef.current.off(ACTIONS.CODE_CHANGE);
      // }
     
    },[socketRef.current])
  return (
    <textarea id="realtime-editor"></textarea>
    
  )
};

export default Editor   