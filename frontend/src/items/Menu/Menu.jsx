import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GetProfile } from '../../connections/profileConnection.js';


import styles from './Menu.module.css';

const activeClassName = ({ isActive, isPending }) =>
  [isPending ? styles.transition : '', isActive ? styles.active : ''].join(
    ' '
  ) +
  ' ' +
  styles.linkButton;

const Menu = (props) => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    GetProfile("").then((data) => {
      if (data.login === 'success') {
        setUserEmail(data.profile.Email);
      } else {
        console.log('Menu Profile error')
      }
    });
  }, []);
  return (
    <div className={styles.menu}>
      <NavLink to={`/notifications`} className={activeClassName}>
        Notifications
      </NavLink>
      <NavLink to={`/posts`} className={activeClassName}>
        Posts
      </NavLink>
      <NavLink to={`/groups`} className={activeClassName}>
        Groups
      </NavLink>
      <NavLink to={`/chat`} className={activeClassName}>
        Chat
      </NavLink>
      <NavLink to={`/followers`} className={activeClassName}>
        Followers
      </NavLink>
      <NavLink to={`/profile/${userEmail}`} className={activeClassName}>
        Profile
      </NavLink>
      {/* {props.token ? ( */}
        <a onClick={props.onLogout} className={styles.linkButton}>
          Logout
        </a>
      {/* // ) : (
      //   <Login />
      // )} */}
    </div>
  );
};

export default Menu;
