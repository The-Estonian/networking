import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SendNewGroup } from '../../connections/newGroupConnection.js';
import { GetStatus } from '../../connections/statusConnection.js';

import styles from './NewGroup.module.css';

const NewEvent = () => {
  const [events, setEvents] = useState([]);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [attendEvent, setAttendEvent] = useState('1');

  const [inputError, setInputError] = useState(true);
  const [inputErrorText, setInputErrorText] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    GetStatus().then((data) => {
      if (data.login !== 'success') {
        navigate('/');
      }
    });
  }, [navigate]);

  const validateEventTitleInput = (e) => setEventTitle(e.target.value)
  const validateEventInputDescrInput = (e) => setEventDescription(e.target.value)
  const validateEventDateInput = (e) => setEventTime(e.target.value)
  const validateAttendEventInput = (e) => setAttendEvent(e.target.value)

  const switchNewPostOpen = () => {
    setNewPostOpen(!newPostOpen);
    setInputErrorText('');
  };

  const createNewEvent = () => {
    if (eventTitle.length < 1 || eventDescription.length < 1) {
      setInputError(true);
      setInputErrorText('Title or description can not be empty!');
      return;
    }

    const formData = new FormData()
    formData.append('title', eventTitle)
    formData.append('description', eventDescription)
    formData.append('eventtime', eventTime)
    formData.append('attendEvent', eventDescription)

    SendNewEvent(formData).then((data) => {
      setEvents(prevEvent => [data.SendNewEvent, ...prevEvent])
    })
   
    switchNewPostOpen();
  }

return (
    <div className={styles.newPost}>
      {newPostOpen ? (
        <div className={styles.openNewPost}>
          <span>Title</span>
          <input type='text' id='title' onChange={validateNewGroupTitleInput} />
          <span>Description</span>
          <input
            type='text'                                                                   
            id='content'                          
            onChange={validateNewGroupDescriptionInput}
          />
          {inputError ? <span className={styles.errorMsg}>{inputErrorText}</span> : ''}
         
          <div className={styles.openNewPostOptions}>
            <span className={styles.openNewPostSubmit} onClick={createNewGroup}>
              Submit
            </span>
            <span
              className={styles.openNewPostCancel}
              onClick={switchNewPostOpen}
            >
              Cancel
            </span>
          </div>
        </div>
      ) : (
        <span className={styles.closedNewPost} onClick={switchNewPostOpen}>
          Create Group
        </span>
      )}
    </div>
  );
}
export default NewGroup;