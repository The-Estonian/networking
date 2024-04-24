import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GetStatus } from '../../connections/statusConnection.js';
import { SetLogout } from '../../connections/logoutConnection.js';
import useWebSocket from 'react-use-websocket';

const backendUrl =
  import.meta.env.VITE_APP_BACKEND_PICTURE_URL || 'localhost:8080';
let websock = `ws://${backendUrl}/websocket`;
if (backendUrl != 'localhost:8080') {
  websock = `ws://${backendUrl.substring(8)}/websocket`;
}

import Menu from '../Menu/Menu';
import Authenticate from '../../authentication/Authenticate.jsx';
import Modal from './Modal.jsx';

import styles from './Container.module.css';

const Container = () => {
  const [activeSession, setActiveSession] = useState('false');
  const [socketUrl, setSocketUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
      if (data['login'] == 'fail') {
        setActiveSession('false');
      } else if (data['login'] == 'success') {
        setActiveSession('true');
        startWebSocketConnection();
      }
    });
  }, []);

  const handleActiveSession = () => {
    setActiveSession('true');
    startWebSocketConnection();
  };

  const handleLogout = () => {
    navigate('/');
    sendJsonMessage({
      type: 'onlineStatus',
      message: 'offline',
    });
    setSocketUrl(null);
    setActiveSession('false');
    document.cookie = 'socialNetworkAuth=false';
    SetLogout();
  };
  return (
    <div className={styles.container}>
      {showModal ? <Modal /> : ''}
      {activeSession == 'true' ? (
        <Menu token={activeSession} onLogout={handleLogout} />
      ) : (
        <Authenticate modal={setShowModal} currSession={handleActiveSession} />
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
