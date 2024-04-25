
import styles from './Message.module.css';

const Message = (props) => {
    const messageDate = new Date(props.messageData.Date);
    const messageDateString = `${messageDate.getHours()}:${messageDate.getMinutes()}:${messageDate.getSeconds()} ${messageDate.getDate()}-${
      messageDate.getMonth() + 1
    }-${messageDate.getFullYear()}`;
  return (
    <div className={styles.messageContainer}>
      <p>{props.messageData.Message}</p>
      <p>{props.messageData.MessageSender}</p>
      <p>{messageDateString}</p>
    </div>
  );
}

export default Message