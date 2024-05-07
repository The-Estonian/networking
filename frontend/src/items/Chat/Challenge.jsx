import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

import styles from './Challenge.module.css';

const Challenge = (props) => {
  const [playerOne, setPlayerOne] = useState(0);
  const [playerTwo, setPlayerTwo] = useState(0);
  const gameWindowRef = useRef(null);

  const [, , sendJsonMessage, lastMessage, ,] = useOutletContext();

  const handleKeyDown = (event) => {
    if (event.key == 'ArrowUp') {
      console.log('Move up', playerOne);
      if (playerOne > 0) {
        setPlayerOne((prevPlayerOne) => prevPlayerOne - 10);
        sendJsonMessage({
          type: 'challenge',
          fromuserid: props.currentUser,
          coords: (playerOne - 10).toString(),
          touser: props.activeChatPartner,
        });
      }
    } else if (event.key == 'ArrowDown') {
      if (playerOne < 570) {
        setPlayerOne((prevPlayerOne) => prevPlayerOne + 10);
        sendJsonMessage({
          type: 'challenge',
          fromuserid: props.currentUser,
          coords: (playerOne + 10).toString(),
          touser: props.activeChatPartner,
        });
      }
    }
  };

  useEffect(() => {
    if (gameWindowRef.current) {
      gameWindowRef.current.focus();
    }
  }, [gameWindowRef]);

  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      console.log(messageData);
      if (messageData.type == 'challenge') {
        setPlayerTwo(parseInt(messageData.coords));
      }
    }
  }, [lastMessage]);

  return (
    <div
      ref={gameWindowRef}
      onKeyDown={handleKeyDown}
      className={styles.challengeContainer}
      tabIndex={-1}
    >
      <div className={styles.challengeGame}>
        <div
          style={{ top: `${playerOne}px` }}
          className={styles.playerOne}
        ></div>
        <div
          style={{ top: `${playerTwo}px` }}
          className={styles.playerTwo}
        ></div>
      </div>
      <button
        className={styles.challengeCancel}
        onClick={props.handleChallenge}
      >
        Cancel Challenge
      </button>
    </div>
  );
};

export default Challenge;
