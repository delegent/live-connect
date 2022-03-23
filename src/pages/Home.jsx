import React, {useState} from 'react'
import { v4 as uuidv4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
export default function Home() {
	const navigate = useNavigate();
	const [roomId, setRoomId] = useState("");
	const [username,setUsername] = useState("");
	function createNewRoom(e){
		e.preventDefault();
		const id = uuidv4();
		setRoomId(id);
		try{
		toast.success("New Room Created");
		}catch(err){
			alert(err);
		}

	}

	function handleSubmit(e){
		if(e.code === 'Enter'){
			joinRoom();
		}
	}

	function joinRoom(){
		if(!roomId || !username){
			toast.error('ROOM ID & USERNAME is required');
			return;
		}

		toast.success("Joined Successfully");
		// redirect
		navigate(`/editor/${roomId}`,{
			state:{
				username,
			}
		})

	}
	
	return (
	<div className="homePageWrapper">
		<div className="formWrapper">
			<img src="/images/logo.png" alt="logo-img" className = "home-page-logo" />
			<h4 className = "mainLabel">Paste Invitation ROOM ID</h4>
			<div className="inputGroup">
				<input type="text"  className='inputBox'  placeholder = "ROOM ID" value = {roomId} onChange = {function(e){setRoomId(e.target.value)}} onKeyUp={handleSubmit}/>
				<input type="text" className='inputBox' placeholder = "USERNAME" value = {username} onChange = {function(e){setUsername(e.target.value)}} onKeyUp={handleSubmit}/>
				<button className = "btn joinBtn" onClick={joinRoom}>JOIN</button>
				<span className="createInfo">
					If you don't invite then create &nbsp; 
					<a onClick = {createNewRoom} href="#" className="createNewBtn">NEW ROOM</a>
				</span>
			</div>

		</div>
		<footer>
			<h4>Built with ❤ by &nbsp;   
			<a href="https://delegent.github.io/port-folio">Anubhav Srivastava</a>
			</h4>
		</footer>
	</div>
  )
}
