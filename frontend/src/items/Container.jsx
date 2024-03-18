import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { Status } from '../connections/statusConnection.js';
import { Logout } from '../connections/logoutConnection.js';

import Menu from './Menu';
import Authenticate from '../authentication/Authenticate';
import Modal from './Modal';

import styles from './Container.module.css';

const Container = () => {
  const [activeSession, setActiveSession] = useState('false');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    Status().then((data) => {
      if (data['login'] == 'fail') {
        setActiveSession('false');
      } else if (data['login'] == 'success') {
        setActiveSession('true');
      }
      console.log('Status => ', data.login);
    });
  }, []);

  const handleLogout = () => {
    setActiveSession('false');
    document.cookie = 'socialNetworkAuth=false';
    Logout().then((data) => {
      console.log('Logout => ', data);
    });
  };
  return (
    <div className={styles.container}>
      {showModal ? <Modal /> : ''}
      {activeSession == 'true' ? (
        <Menu token={activeSession} onLogout={handleLogout} />
      ) : (
        <Authenticate modal={setShowModal} currSession={setActiveSession} />
      )}
      <Outlet />
    </div>
  );
};

export default Container;
