import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GetStatus } from '../../connections/statusConnection.js';
import { SetLogout } from '../../connections/logoutConnection.js';
import useWebSocket from 'react-use-websocket';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'localhost:8080';
let websock = `ws://${backendUrl}/websocket`;
if (backendUrl != 'localhost:8080') {
  websock = `wss://${backendUrl}/websocket`;
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
  const { sendJsonMessage, lastMessage } = useWebSocket(socketUrl, {
    share: true,
    shouldReconnect: true,
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
    setActiveSession('false');
    document.cookie = 'socialNetworkAuth=false';
    SetLogout().then((data) => {
      console.log('Logout => ', data);
    });
    navigate('/');
    setShowModal(false);
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
        context={[setShowModal, handleLogout, sendJsonMessage, lastMessage]}
      />
    </div>
  );
};

export default Container;
