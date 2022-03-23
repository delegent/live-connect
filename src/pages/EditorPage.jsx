import React, { useState, useRef , useEffect} from "react";
import toast from 'react-hot-toast';

import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from '../socket';
import ACTIONS from "../Actions";
import { useLocation , useNavigate, Navigate, useParams} from 'react-router-dom'; 
export default function EditorPage() {
  const socketRef = useRef(null); 
  const codeRef = useRef(null);
  const location = useLocation();  
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);

  useEffect(()=>{
    console.log(roomId);
    const init = async ()=>{
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error',(err)=>handleErrors(err));
      socketRef.current.on('connect_failed',(err)=>handleErrors(err));

      function handleErrors(err) {
        console.log('socket error',err);
        toast.error('Socket Connection Failed , try again');  
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN,{

        roomId,
        username: location.state?.username
      });
      // Listening for joined event 
      socketRef.current.on(ACTIONS.JOINED,function({ clients, username, socketId}){ 
          if(username !== location.state?.username){
            toast.success(`${username} joined the room.`)
            console.log(`${username} joined`);
          }
          setClients(clients); 
          socketRef.current.emit(ACTIONS.SYNC_CODE,{
            code:codeRef.current,
            socketId
          
          });
      })


      // listening for disconnected 
      socketRef.current.on(ACTIONS.DISCONNECTED,({ socketId, username})=>{
        toast.success(`${username} left the room`);  
        setClients((prev)=>{
          return prev.filter(client => client.socketId !== socketId)
        });
      })
    }
    init();   
    return ()=>{
      socketRef.current.disconnect();  
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    }

  },[]);


 function copyRoomId(){
        navigator.clipboard.writeText(roomId)
        toast.success('Copied Successfully')
    }
    

function leaveRoom(){
  reactNavigator('/');
}
  
  
  if(!location.state){
    return <Navigate  to = "/" /> 
  }

  
  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logo-img" src="/images/logo.png" alt="logo" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>

        <button className="btn copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
        <button className="btn leaveBtn" onClick = {leaveRoom}>Leave</button>
      </div>
      <div className="editorWrap">
        <Editor socketRef = {socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current = code}} />
      </div>
    </div>
  );
}
