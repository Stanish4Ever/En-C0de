import React, { useEffect, useRef, useState } from 'react';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {
    const socketRef = useRef(null); // Component won't re-render
    const location = useLocation();
    const { roomId } = useParams();
    const [clients, setClients] = useState([]);
    const reactNavigator = useNavigate();

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);

            function handleErrors(e) {
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
            const handleJoined = ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
                    console.log(`${username} joined`);
                }
                setClients(clients);
            };
            socketRef.current.on(ACTIONS.JOINED, handleJoined);

            // Listening for disconnected
            const handleDisconnected = ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => {
                    return prev.filter(client => client.socketId !== socketId);
                });
            };
            socketRef.current.on(ACTIONS.DISCONNECTED, handleDisconnected);

            // Cleanup function to remove event listeners
            return () => {
                if (socketRef.current) {
                    socketRef.current.off(ACTIONS.JOINED, handleJoined);
                    socketRef.current.off(ACTIONS.DISCONNECTED, handleDisconnected);
                    socketRef.current.disconnect();
                }
            };
        };
        init();
    }, [roomId, location.state?.username, reactNavigator]);

    async function copyRoomId(){
        try{
            await navigator.clipboard.writeText(roomId);
            toast.success("Room ID has been copied");
        }catch(e){
            toast.error("Could not copy the room id");
            console.log(e);
        }
    }

    function leaveRoom(){
        reactNavigator("/");
    }

    if (!location.state) {
        return <Navigate to="/" />;
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
                        {clients.map((client) => (
                            <Client key={client.socketId} username={client.username} />
                        ))}
                    </div>
                </div>
                <button className='btn copyBtn' onClick={copyRoomId}>Copy ROOM ID</button>
                <button className='btn leaveBtn' onClick={leaveRoom}>Leave ROOM</button>
            </div>
            <div className='editorWrap'>
                <Editor socketRef={socketRef} roomId={roomId}/>
            </div>
        </div>
    );
};

export default EditorPage;
