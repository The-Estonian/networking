import { Link } from 'react-router-dom';

import styles from './Menu.module.css';

const Menu = (props) => {
  return (
    <div className={styles.menu}>
      <Link to={`/dashboard`}>Dashboard</Link>
      <Link to={`/profile`}>Profile</Link>
      <a onClick={props.onLogout}>Logout</a>
    </div>
  );
};

export default Menu;
