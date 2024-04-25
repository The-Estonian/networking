import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const Notifications = () => {
  const [notificationList, setNotificationList] = useState([]);
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
    // check if user logged in or kick out
    // else add notifications to list setNotificationList()
  });

  useEffect(() => {
    // get notification from websocket and add to list
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      // if messageData.type === "notification"{ setNotificationList(add notification here)}
    }
  });
  return (
    <div>
      <p>Notifications</p>
      <p>
        {notificationList.map((each) => {
          <p>{each}</p>;
        })}
      </p>
    </div>
  );
};

export default Notifications;
