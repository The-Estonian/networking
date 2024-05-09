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
        placeholder={props.textMessageError}
        id=''
        onKeyDown={props.handleKeyPress}
      />
      <button
        type='submit'
        onClick={props.sendMessage}
        disabled={props.textMessage.length < 1 ? true : false}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
