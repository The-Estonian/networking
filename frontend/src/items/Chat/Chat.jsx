import styles from './Chat.module.css';
import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { GetUserList } from '../../connections/userListConnection';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'localhost:8080';

const Chat = () => {
  const [textMessage, setTextMessage] = useState('');
  const [activeChatPartner, setActiveChatPartner] = useState('');
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const [modal] = useOutletContext();

  useEffect(() => {
    GetUserList().then((data) => {
      if (data) {
        if (data.login === 'success') {
          data.userList == null
            ? setUserList([])
            : setUserList(data.userList) &&
              setActiveChatPartner(data.userList[0].Id);
          modal(false);
        } else {
          navigate('/');
        }
      }
    });

    // get user from server and set them
    // setUserList(['user1', 'user2', 'user3', "user4"]);
  }, [navigate, modal]);
  const { sendJsonMessage } = useWebSocket(`ws://${backendUrl}/websocket`, {
    share: true,
  });

  const handleText = (e) => {
    if (e.target.value.length > 0) {
      setTextMessage(e.target.value);
    }
  };

  const sendMessage = () => {
    sendJsonMessage({ Message: textMessage });
    setTextMessage('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
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
            onClick={() => setActiveChatPartner(each.Id)}
          >
            {each.Email}
          </p>
        ))}
      </div>
      <div className={styles.chatContainer}>
        <div className={styles.chat}>Text goes here</div>
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
