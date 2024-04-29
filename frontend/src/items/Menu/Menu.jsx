import { NavLink } from 'react-router-dom';

import styles from './Menu.module.css';

const Menu = (props) => {
  const activeClassName = ({ isActive, isPending }) =>
    [isPending ? styles.transition : '', isActive ? styles.active : ''].join(
      ' '
    ) +
    ' ' +
    styles.linkButton;

  const activeNotificationClassName = ({ isActive, isPending }) =>
    [
      isPending ? styles.transition : '',
      isActive ? styles.active : '',
      props.glow ? styles.glowing : '',
    ].join(' ') +
    ' ' +
    styles.linkButton;
  return (
    <div className={styles.menu}>
      <NavLink
        to={`/notifications`}
        onClick={props.handleGlow}
        className={activeNotificationClassName}
      >
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
      <NavLink to={`/profile`} className={activeClassName}>
        Profile
      </NavLink>
      <a onClick={props.onLogout} className={styles.linkButton}>
        Logout
      </a>
    </div>
  );
};

export default Menu;
