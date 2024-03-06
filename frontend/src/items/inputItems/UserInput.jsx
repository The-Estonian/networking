import { forwardRef } from 'react';

import styles from './UserInput.module.css';

const UserInput = forwardRef((props, ref) => {
  return (
    <div className={styles.userInputContainer}>
      <span>{props.title}</span>
      <input
        className={styles.userInput}
        type={props.type}
        name={props.name}
        id={props.name}
        ref={ref}
      />
    </div>
  );
});

UserInput.displayName = 'UserInput';

export default UserInput;
