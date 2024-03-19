import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { GetStatus } from '../connections/statusConnection.js';
import { SetLogout } from '../connections/logoutConnection.js';

import Menu from './Menu';
import Authenticate from '../authentication/Authenticate';
import Modal from './Modal';

import styles from './Container.module.css';

const Container = () => {
  const [activeSession, setActiveSession] = useState('false');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    GetStatus().then((data) => {
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
    SetLogout().then((data) => {
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
