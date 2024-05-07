import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GetStatus } from '../../connections/statusConnection.js';
import { SetLogout } from '../../connections/logoutConnection.js';
import useWebSocket from 'react-use-websocket';
import Authenticate from '../../authentication/Authenticate.jsx';
import NewNotification from '../Notifications/NewNotification.jsx';
import Modal from './Modal.jsx';
import Menu from '../Menu/Menu';

import styles from './Container.module.css';

const backendUrl =
  import.meta.env.VITE_APP_BACKEND_PICTURE_URL || 'localhost:8080';
let websock = `ws://${backendUrl}/websocket`;
if (backendUrl != 'localhost:8080') {
  websock = `wss://${backendUrl.substring(8)}/websocket`;
}

const Container = () => {
  const [activeSession, setActiveSession] = useState('false');
  const [socketUrl, setSocketUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [glow, setGlow] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const startWebSocketConnection = () => {
    setSocketUrl(websock);
  };
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    share: true,
    retryOnError: true,
    shouldReconnect: (closeEvent) => {
      return closeEvent.code !== 1000 && closeEvent.code !== 1005;
    },
  });

  useEffect(() => {
    GetStatus().then((data) => {
      if (data) {
        if (data['login'] == 'fail') {
          setActiveSession('false');
        } else if (data['login'] == 'success') {
          setUserId(data['userid']);
          setUserAvatar(data['useravatar']);
          setActiveSession('true');
          startWebSocketConnection();
        }
      }
    });
  }, []);

  const handleGlowTrigger = () => {
    setGlow(false);
  };

  const handleNotification = (input) => {
    setShowNotification(true);
    setNotificationText(input);
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      if (
        messageData.type != 'onlineStatus' &&
        messageData.type != 'challenge'
      ) {
        handleNotification(`New ${messageData.type}`);
        setGlow(true);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (readyState === 1) {
      sendJsonMessage({
        type: 'onlineStatus',
        message: 'online',
      });
    }
  }, [readyState]);

  const handleActiveSession = () => {
    setActiveSession('true');
    startWebSocketConnection();
  };

  const handleLogout = () => {
    navigate('/');
    sendJsonMessage({
      type: 'onlineStatus',
      message: 'offline',
      fromuserid: userId,
    });
    setSocketUrl(null);
    setActiveSession('false');
    document.cookie = 'socialNetworkAuth=false';
    // send logout ping to backend
    SetLogout();
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      {showNotification ? (
        <NewNotification>{notificationText}</NewNotification>
      ) : (
        ''
      )}
      {showModal ? <Modal /> : ''}
      {activeSession == 'true' ? (
        <Menu
          glow={glow}
          handleGlow={handleGlowTrigger}
          onLogout={handleLogout}
          userAvatar={userAvatar}
        />
      ) : (
        <Authenticate
          modal={setShowModal}
          currSession={handleActiveSession}
          setUserId={setUserId}
          setUserAvatar={setUserAvatar}
        />
      )}
      <Outlet
        context={[
          setShowModal,
          handleLogout,
          sendJsonMessage,
          lastMessage,
          readyState,
          activeSession,
        ]}
      />
    </div>
  );
};

export default Container;
