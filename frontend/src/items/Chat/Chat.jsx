import styles from './Chat.module.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { GetUserList } from '../../connections/userListConnection';
import { GetMessages } from '../../connections/messagesConnection';

// const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'localhost:8080';

const Chat = () => {
  const [textMessage, setTextMessage] = useState('');
  const [allUserMessages, setAllUserMessages] = useState([]);
  const [activeChatPartner, setActiveChatPartner] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const [modal, sendJsonMessage, lastMessage] = useOutletContext();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    GetUserList().then((data) => {
      if (data) {
        if (data.login === 'success') {
          // set messages
          setUserList(data.userList || []);
          if (data.userList && data.userList.length > 0) {
            setActiveChatPartner(data.userList[0].Id);
          }
          // set current user
          setCurrentUser(data.activeUser);
          modal(false);
        } else {
          navigate('/');
        }
      }
    });
  }, [navigate, modal]);

  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      if (allUserMessages.length > 0) {
        setAllUserMessages([...allUserMessages, messageData]);
      } else {
        setAllUserMessages([messageData]);
      }
    }
  }, [lastMessage]);

  const handleText = (e) => {
    if (e.target.value.length > 0) {
      setTextMessage(e.target.value);
    }
  };

  const sendMessage = () => {
    // send to socket
    sendJsonMessage({
      type: 'message',
      message: textMessage,
      touser: activeChatPartner,
    });
    // append to messagelist
    // const currentDateTime = new Date();
    // const dateTime = `${currentDateTime.getHours()}:${currentDateTime.getMinutes()}:${currentDateTime.getSeconds()} ${currentDateTime.getDate()}-${
    //   currentDateTime.getMonth() + 1
    // }-${currentDateTime.getFullYear()}`;

    let messageObject = {
      Date: new Date(),
      Message: textMessage,
      MessageReceiver: activeChatPartner,
      MessageSender: currentUser,
    };
    console.log(messageObject);
    setAllUserMessages([...allUserMessages, messageObject]);
    // clear message box
    setTextMessage('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  const setPartnerGetMessages = (id) => {
    setActiveChatPartner(id);
    // fetch messages and set
    const formData = new FormData();
    formData.append('partner', id);
    GetMessages(formData).then((data) => {
      console.log(data.messages);
      setAllUserMessages(data.messages);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.users}>
        {userList.map((each, key) => (
          <p
            key={key}
            className={
              each.Id === activeChatPartner
                ? styles.activePartner
                : styles.chatuser
            }
            onClick={() => setPartnerGetMessages(each.Id)}
          >
            {each.Email}
          </p>
        ))}
      </div>
      <div className={styles.chatContainer}>
        <div ref={chatContainerRef} className={styles.chat}>
          {allUserMessages?.map((eachMessage, key) => {
            const messageDate = new Date(eachMessage.Date);
            const messageDateString = `${messageDate.getHours()}:${messageDate.getMinutes()}:${messageDate.getSeconds()} ${messageDate.getDate()}-${
              messageDate.getMonth() + 1
            }-${messageDate.getFullYear()}`;
            return (
              <div key={key} className={styles.messageContainer}>
                <p>{eachMessage.Message}</p>
                <p>{eachMessage.MessageSender}</p>
                <p>{messageDateString}</p>
              </div>
            );
          })}
        </div>
        <div className={styles.inputContainer}>
          <input
            type='text'
            value={textMessage}
            onChange={handleText}
            className={styles.chatInput}
            name='textMessage'
            id=''
            onKeyDown={handleKeyPress}
          />
          <button type='submit' onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
