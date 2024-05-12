import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

import { GetGroupMessages } from '../../connections/getGroupMessagesConnection';

import styles from './GroupChat.module.css';

const GroupChat = (props) => {
  const [groupChat, setGroupChat] = useState([]);
  const [groupChatInput, setGroupChatInput] = useState('');
  const [textMessageError, setTextMessageError] = useState('');
  const chatContainerRef = useRef(null);

  const [, , sendJsonMessage, lastMessage, ,] = useOutletContext();

  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      console.log(messageData);
      if (messageData.type == 'groupMessage') {
        if (props.selectedGroup.Id === messageData.GroupId) {
          if (groupChat?.length > 0) {
            let messageObject = {
              Date: new Date() + 'Z',
              GroupChatMessage: messageData.message,
              GroupId: messageData.touser,
              GroupChatMessageSender: messageData.fromuserid,
            };
            setGroupChat([...groupChat, messageObject]);
            setTimeout(() => {
              chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
            }, 100);
          } else {
            setGroupChat([messageData]);
          }
        }
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    const formData = new FormData();
    formData.append('groupId', props.selectedGroup.Id);
    GetGroupMessages(formData).then((data) => {
      setGroupChat(data.groupMessages);
    });
    // fetch old group chat and set it
    // setGroupChat();
  }, [props.selectedGroup]);

  const handleChatInput = (e) => {
    setGroupChatInput(e.target.value);
    if (e.target.value < 1) {
      setTextMessageError('Please enter some text!');
    } else {
      setTextMessageError('');
    }
  };

  const sendGroupMessage = () => {
    sendJsonMessage({
      type: 'groupMessage',
      GroupId: props.selectedGroup.Id,
      fromuserid: props.currentUser,
      message: groupChatInput,
    });
    let messageObject = {
      Date: new Date() + 'Z',
      GroupId: props.selectedGroup.Id,
      GroupChatMessageSender: props.currentUser,
      GroupChatMessage: groupChatInput,
    };

    if (groupChat?.length > 0) {
      setGroupChat([...groupChat, messageObject]);
      setTimeout(() => {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }, 100);
    } else {
      setGroupChat([messageObject]);
    }
    setTimeout(() => {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }, 100);

    setGroupChatInput('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (groupChatInput.length < 1) {
        setTextMessageError("Can't send empty messages!");
      } else {
        sendGroupMessage();
        setTextMessageError('');
      }
    }
  };

  return (
    <div className={styles.groupChat}>
      <div ref={chatContainerRef} className={styles.groupChatBox}>
        {groupChat?.map((item, i) => (
          <div key={i} className={styles.groupChatRow}>
            <p className={styles.groupChatRowUser}>
              {item.GroupChatMessageSender}
            </p>
            <p>{item.GroupChatMessage}</p>
          </div>
        ))}
      </div>
      <div className={styles.groupChatInputContainer}>
        <input
          type='text'
          value={groupChatInput}
          onChange={handleChatInput}
          className={styles.groupChatInput}
          name='textMessage'
          placeholder={textMessageError}
          id=''
          onKeyDown={handleKeyPress}
        />
        <button
          className={styles.chatInputSubmit}
          type='submit'
          onClick={sendGroupMessage}
          disabled={groupChatInput.length < 1 ? true : false}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
