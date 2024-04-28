import { NavLink } from 'react-router-dom';


import styles from './Menu.module.css';

const activeClassName = ({ isActive, isPending }) =>
  [isPending ? styles.transition : '', isActive ? styles.active : ''].join(
    ' '
  ) +
  ' ' +
  styles.linkButton;

const Menu = (props) => {
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
      <NavLink to={`/profile/`} className={activeClassName}>
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
