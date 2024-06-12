import React, { useState } from "react";
import { useEffect } from "react";
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import EmojiPicker from "emoji-picker-react";

import icon from "../images/emoji.png";
import styles from "../styles/Chat.module.css";
import { use } from "../../../server/route";

const socket = io.connect('http://localhost:5000')

const Chat = () => {
   const { search } = useLocation();
   const [params, setParams] = useState({room: "", user: "" });
   const [state, setState] = useState([]);
   const [message, setMessage] = useState();
   const [isOpen, setOpen] = useState(false);

   useEffect(() => {
      const searchParams = Object.fromEntries(new URLSearchParams(search));
      setParams(searchParams);
      socket.emit("join", searchParams);
   }, [search]);

   useEffect(() => {
      socket.on("message", ({ data }) =>{
         setState((_state) => [..._state, data]);
      });
   }, []);

   const leftRoom = () => {};

   const handleChange = ({target: {value}}) => setMessage(value); 

   const onEmojiClick = ({emoji}) => setMessage(`${message} ${emoji}`)

   const handleSubmit = (е) => {
      e.preventDefault();

      if(!message) return;

      socket.emit('send message', {message, params})

      setMessage("");
   };


   return(
      <div className={styles.wrap}>
      <div className={styles.header}>
         <div className={styles.title}>
            {params.room}
         </div>
         <div className={styles.users}>
            0 users в комнате
         </div>
         <button className={styles.left} onClick={leftRoom}>
            Выйти из комнаты
         </button>
         </div>

         <div className={styles.messages}>
            <Messages messages={state} name={params.name} />
         </div>

         <form className={styles.form} onSubmit={handleSubmit}>
           <div className={styles.input}>
                     <input 
                     type="text" 
                     name="message" 
                     placeholder="Писька Генриха"
                     value={message} 
                     onChange={handleChange}
                     autoComplete="off"
                     required/>
                  </div>
                  <div className={styles.emoji}>
                     <img src={icon} alt="" onClick={() => setOpen(!isOpen)}/>
                     
                     {isOpen && (
                        <div className={styles.emojies}>
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                     </div>
                     )}
                  </div>

                  <div className={styles.button}>
                     <input type="submit" onSubmit={handleSubmit} value="Отправить сообщение" />
                  </div>
         </form>
      </div>
   );
};

export default Chat;