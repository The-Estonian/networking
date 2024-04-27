import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { GetNotifications } from '../../connections/notificationsConnection';
import { SendNotificationResponse } from '../../connections/notificationResponseConnection';

import styles from './NewNotification.module.css';


const Notifications = () => {
  const [modal,logout, ,lastMessage, ,] = useOutletContext();
  const [groupInvNotify, setGroupInvNotify] = useState([]);
  const navigate = useNavigate();
    
  useEffect(() => {
    modal(true);
    GetNotifications().then((data) => {
      console.log("allnotifData: ", data.sendNotifications);
      data.sendNotifications == null ? setGroupInvNotify([]) : setGroupInvNotify(data.sendNotifications);
      if (data) {
        if (data.login === 'success') {
          modal(false);
        } else {
          logout()
        }
      }  
    })
  }, [navigate, modal])

  // Update new live notfication with websocket
  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.type === 'groupInvatation') {
        setGroupInvNotify(prevNotifications => [...prevNotifications, messageData]);
      }
    }
  }, [lastMessage]);

  // Update databases after user accepts/declines notification
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
