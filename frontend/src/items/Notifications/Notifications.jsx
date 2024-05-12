import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { GetNotifications } from '../../connections/notificationsConnection';
import { SendNotificationResponse } from '../../connections/notificationResponseConnection';

import styles from './NewNotification.module.css';

const Notifications = () => {
  const [modal, logout, , lastMessage, ,] = useOutletContext();
  const [groupInvNotify, setGroupInvNotify] = useState([]);
  const [groupReqNotify, setGroupReqNotify] = useState([]);
  const [eventNotify, setEventNotify] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    modal(true);
    GetNotifications().then((data) => {
      data.groupInvNotifications == null
        ? setGroupInvNotify([])
        : setGroupInvNotify(data.groupInvNotifications);
      data.eventNotifications == null
        ? setEventNotify([])
        : setEventNotify(data.eventNotifications);
      data.groupRequests == null
        ? setGroupReqNotify([])
        : setGroupReqNotify(data.groupRequests);
      if (data) {
        if (data.login === 'success') {
          modal(false);
        } else {
          logout();
        }
      }
    });
  }, [navigate, modal]);

  // Update new live notfication with websocket
  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.type === 'groupInvatation') {
        setGroupInvNotify((prevNotifications) => [
          ...prevNotifications,
          messageData,
        ]);
      }
      if (messageData.type === 'groupRequest') {
        setGroupReqNotify((prevNotifications) => [
          ...prevNotifications,
          messageData,
        ]);
      }
      if (messageData.type === 'event') {
        setEventNotify((prevNotifications) => [
          ...prevNotifications,
          messageData,
        ]);
      }
    }
  }, [lastMessage]);

  // Update databases after user accepts/declines notification
  const invatationResponse = (notification, index, e, type) => {
    type == 'groupInvatation' &&
      setGroupInvNotify((prevNotifications) =>
        prevNotifications.filter((_, i) => i !== index)
      );
    type == 'event' &&
      setEventNotify((prevNotifications) =>
        prevNotifications.filter((_, i) => i !== index)
      );
    type == 'groupRequest' &&
      setGroupReqNotify((prevNotifications) =>
        prevNotifications.filter((_, i) => i !== index)
      );

    const formData = {
      decision: e.target.value,
      type: type,
      GroupId: notification.GroupId,
      EventId: notification.EventId,
      NotificationId: notification.NotificationId,
      fromuserid: notification.fromuserid,
    };
    SendNotificationResponse(formData);
  };

  return (
    <div className={styles.groupContainer}>
      <div className={styles.dropdown}>
        <div id='grInv' className={styles.listButton}>
          Group invatations
        </div>
        <div id='grInv' className={styles.groupInvList}>
          {groupInvNotify.map((notification, index) => (
            <div className={styles.notifyBox} key={index}>
              <p>Group name: {notification.message}</p>
              <p>Sender: {notification.SenderEmail}</p>

              <button
                className={styles.accept}
                value={'accept'}
                onClick={(e) => {
                  invatationResponse(notification, index, e, 'groupInvatation');
                }}
              >
                Accept
              </button>
              <button
                className={styles.decline}
                value={'decline'}
                onClick={(e) => {
                  invatationResponse(notification, index, e, 'groupInvatation');
                }}
              >
                Decline
              </button>
            </div>
          ))}
        </div>
      </div>
      <div id='event' className={styles.listButton}>
        Group events
      </div>
      <div id='event' className={styles.groupInvList}>
        {eventNotify.map((notification, index) => {
          const messageDate = new Date(notification.EventTime.slice(0, -1));
          const messageDateString = `${messageDate.getDate()}/${
            messageDate.getMonth() + 1
          }/${messageDate.getFullYear()} ${messageDate.getHours()}:${messageDate.getMinutes()}`;

          return (
            <div className={styles.notifyBox} key={index}>
              <p>Sender email: {notification.SenderEmail}</p>
              <p>E title: {notification.EventTitle}</p>
              <p>E Descr: {notification.EventDescription}</p>
              <p>E Time: {messageDateString}</p>
              <p>Gr Title: {notification.GroupTitle}</p>
              <p>Notf ID: {notification.NotificationId}</p>
              <p>Event ID: {notification.EventId}</p>

              <button
                className={styles.accept}
                value={'accept'}
                onClick={(e) => {
                  invatationResponse(notification, index, e, 'event');
                }}
              >
                Going
              </button>
              <button
                className={styles.decline}
                value={'decline'}
                onClick={(e) => {
                  invatationResponse(notification, index, e, 'event');
                }}
              >
                Not going
              </button>
            </div>
          );
        })}
      </div>
      <div id='grReq' className={styles.listButton}>
        Group requests
      </div>
      <div id='grReq' className={styles.groupInvList}>
        {groupReqNotify.map((notification, index) => (
          <div className={styles.notifyBox} key={index}>
            <p>Group name: {notification.message}</p>
            <p>Request Sender: {notification.SenderEmail}</p>

            <button
              className={styles.accept}
              value={'accept'}
              onClick={(e) => {
                invatationResponse(notification, index, e, 'groupRequest');
              }}
            >
              Accept
            </button>
            <button
              className={styles.decline}
              value={'decline'}
              onClick={(e) => {
                invatationResponse(notification, index, e, 'groupRequest');
              }}
            >
              Decline
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
