import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { GetUserList } from '../../connections/userListConnection';
import { SendNotificationResponse } from '../../connections/notificationConnection';

import styles from './NewNotification.module.css';


const Notifications = () => {
  const [notificationList, setNotificationList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [notGroupMembers, setNotGroupMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [groupInvNotify, setGroupInvNotify] = useState([]);
  const navigate = useNavigate();

  const [
    modal,
    logout,
    sendJsonMessage,
    lastMessage,
    readyState,
    activeSession,
  ] = useOutletContext();

  useEffect(() => {
    GetUserList().then((data) => {
      if (data) {
        if (data.login === 'success') {
          setUserList(data.userList || [])
          setCurrentUser(data.activeUser)
          modal(false);

        } else {
          logout()
        }
      }  
    })
  }, [navigate, modal])

  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.type === 'groupInvatation') {
        setGroupInvNotify(prevNotifications => [...prevNotifications, messageData]);
      }
    }
  }, [lastMessage]);

  const invatationResponse = (notification, index, e) => {
    setGroupInvNotify(prevNotifications => prevNotifications.filter((_, i) => i !== index))
    const formData = {
      decision: e.target.value,
      notificationResponse : notification,
    }
    SendNotificationResponse(formData)
  }

  return (
    <div className={styles.groupContainer}>

      <div className={styles.dropdown}>
        <div className={styles.listButton}>Group invatations</div>
          <div className={styles.groupInvList}>

            {groupInvNotify.map((notification, index) => (
              <div className={styles.notifyBox} key={index}>
              <p>{notification.message}</p>
              <button className={styles.accept} value={'accept'} onClick={(e) => {invatationResponse(notification, index, e)}}>Accept</button>
              <button className={styles.decline} value={'decline'} onClick={(e) => {invatationResponse(notification, index, e)}}>Decline</button>    
              </div>  
            ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
