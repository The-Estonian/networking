import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Menu from './Menu';

import styles from './Container.module.css';

const Container = () => {
  const [token, setToken] = useState('');
  useEffect(() => {
    const storedToken = sessionStorage.getItem('jwtToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    setToken('');
    sessionStorage.removeItem('jwtToken');
  };
  return (
    <div className={styles.container}>
      <Menu onLogout={handleLogout} />
      <Outlet />
    </div>
  );
};

export default Container;
