import React, { useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
const EditorPage = () => {
    const [clients, setClinets] = useState([{ socketId: 1, username: "Stanish4Ever"}, {socketId: 2, username: "Aayush Dutta"}]);
  return (
    <div className='mainWrap'>
        <div className='aside'>
            <div className='asideInner'>
                <div className='logo'>
                    <img src='/logoencodewhite.png' className="logoImage" alt='ISTE En-C0DE'></img>
                </div>
                <h3>Connected</h3>
                <div className='clientsList'>
                {
                    clients.map((client) => (<Client key={client.socketId} username= {client.username}/>))
                }
                </div>
            </div>
            <button className='btn copyBtn'>Copy ROOM ID</button>
            <button className='btn leaveBtn'>Leave ROOM</button>
        </div>
        <div className='editorWrap'>
            <Editor/>
        </div>
    </div>
  )
}

export default EditorPage