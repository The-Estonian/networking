import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GetUserList } from '../../connections/userListConnection';
import styles from './ChatUserlist.module.css';

const ChatUserlist = (props) => {
  const [userList, setUserList] = useState([]);
  const [modal, logout, , , , activeSession] = useOutletContext();

  useEffect(() => {
    if (!activeSession) {
      setUserList([]);
    }
  }, [activeSession]);

  useEffect(() => {
    GetUserList().then((data) => {
      if (data) {
        if (data.login === 'success') {
          // set messages
          setUserList(data.userList || []);
          if (data?.userList?.length > 0) {
            // set defaul chat partner and their messages on load
            props.setPartnerGetMessages(data.userList[0].Id);
          }
          // set current user
          props.setCurrentUser(data.activeUser);
          modal(false);
        } else {
          logout();
        }
      }
    });
  }, [modal]);

  return (
    <div className={styles.users}>
      {userList.map((each, key) => (
        <p
          key={key}
          className={
            each.Id === props.activeChatPartner
              ? styles.activePartner
              : props.activeMessage.includes(each.Id)
              ? styles.newMessage
              : styles.chatuser
          }
          onClick={() => props.handleUserClick(each.Id)}
        >
          {each.Email}
        </p>
      ))}
    </div>
  );
};

export default ChatUserlist;
