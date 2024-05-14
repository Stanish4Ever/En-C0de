import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
// import Editor from '../components/Editor';
const EditorPage = () => {
    const socketRef = useRef(null); //Component won't re-render
    const location = useLocation();
    const  {roomId}  = useParams();
    const [clients, setClients] = useState([]);
    console.log(useParams());
    const reactNavigator = useNavigate();
    console.log("This is the room id",roomId);
    useEffect(()=> {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));
            function handleErrors(e){
                console.log('Socket Error', e);
                toast.error('Socket connection failed, try again later');
                reactNavigator('/');
            }
            console.log(`${roomId} is working`);
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });
            // Listening for Joined Event

            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    // socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    //     code: codeRef.current,
                    //     socketId,
                    // });
                }
            );
        };
        init();
    },[roomId]
    )
    
    if(!location.state){<Navigate>
        return <Navigate to="/"/>
    </Navigate>
}
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