import styles from './ChatInput.module.css';

const ChatInput = (props) => {
  return (
    <div className={styles.inputContainer}>
      <input
        type='text'
        value={props.textMessage}
        onChange={props.handleText}
        className={styles.chatInput}
        name='textMessage'
        id=''
        onKeyDown={props.handleKeyPress}
      />
      <button type='submit' onClick={props.sendMessage}>
        Send
      </button>
    </div>
  );
};

export default ChatInput;
