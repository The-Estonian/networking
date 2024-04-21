import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { SendNewComment } from '../../connections/newCommentConnection';
import { GetStatus } from '../../connections/statusConnection.js';

import styles from './NewComment.module.css';

const NewComment = ({ setAllPosts }) => {
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const newPostPicRef = useRef(null);
  
  const [authError, setAuthError] = useState('');
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

  const validateNewPostContentInput = (e) => {
    setNewPostContent(e.target.value);
  };

  const switchNewPostOpen = () => {
    setNewPostOpen(!newPostOpen);
    setInputErrorText('');
  };

  const submitNewComment = () => {
    if (newPostContent.length < 1) {
      setInputError(true);
      setInputErrorText('Content can not be empty!');
      return;
    }

    const fileInput = newPostPicRef.current;
    const file = fileInput?.files[0];
    if (file) {
      if (!(file.type.startsWith('image/') || file.type.endsWith('gif'))) {
        setAuthError('Picture file must be a jpg or gif');
        console.error('Invalid file type. Please select an image or GIF.');
        return;
      }
    }
    const formData = new FormData();
    formData.append('content', newPostContent)
    formData.append('picture', file)

    SendNewComment(formData).then(data => setAllPosts(prevPosts => [data.sendNewComment, ...prevPosts]))
   
    setNewPostContent('');
    switchNewPostOpen();
  };

  return (
    <div className={styles.newPost}>
      {newPostOpen ? (
        <div className={styles.openNewPost}>
          <span>Content</span>
          <input
            type='text'
            id='content'
            onChange={validateNewPostContentInput}
          />
          {inputError ? <span className={styles.errorMsg}>{inputErrorText}</span> : ''}
         
          <span>Add Img/Gif</span>
          <input
            type='file'
            name='postPic'
            accept='.jpg, .jpeg, .gif'
            id='file'
            ref={newPostPicRef}
          />
          {authError}
          <div className={styles.openNewPostOptions}>
            <span className={styles.openNewPostSubmit} onClick={submitNewComment}>
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
          New Comment
        </span>
      )}
    </div>
  );
};

export default NewComment;
