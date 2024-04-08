import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { SendNewPost } from '../../connections/newPostConnection';
import { GetStatus } from '../../connections/statusConnection.js';

import styles from './NewPost.module.css';

const NewPost = () => {
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostPrivacy, setNewPostPrivacy] = useState('');
  const newPostPicRef = useRef(null);

  let [inputError, setInputError] = useState(false);
  let [inputErrorText, setInputErrorText] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    GetStatus().then((data) => {
      if (data.login !== 'success') {
        navigate('/');
      }
    });
  }, [navigate]);

  const validateNewPostTitleInput = (e) => {
    setNewPostTitle(e.target.value);
    if (e.target.value.length < 1) {
      setInputError(true);
      setInputErrorText('Title can not be empty!');
    } else {
      setInputError(false);
    }
  };

  const validateNewPostContentInput = (e) => {
    setNewPostContent(e.target.value);
    if (e.target.value.length < 1) {
      setInputError(true);
      setInputErrorText('Content can not be empty!');
    } else {
      setInputError(false);
    }
  };

  const validateNewPostPrivacyInput = (e) => {
    setNewPostPrivacy(e.target.value);
    if (e.target.value.length < 1) {
      setInputError(true);
      setInputErrorText('You need to select Privacy');
    } else {
      setInputError(false);
    }
  };

  const switchNewPostOpen = () => {
    setNewPostOpen(!newPostOpen);
  };

  const submitNewPost = () => {
    console.log('Sending new post');
    console.log(newPostTitle, newPostContent, newPostPrivacy);
    SendNewPost({
      title: newPostTitle,
      content: newPostContent,
      privacy: '1',
    });
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostPrivacy('');
    switchNewPostOpen();
  };

  return (
    <div className={styles.newPost}>
      {newPostOpen ? (
        <div className={styles.openNewPost}>
          <span>Title</span>
          <input type='text' id='title' onChange={validateNewPostTitleInput} />
          <span>Content</span>
          <input
            type='text'
            id='content'
            onChange={validateNewPostContentInput}
          />
          <div className={styles.privacySelection}>
            <div>
              <input
                type='radio'
                id='public'
                name='privacy'
                value='public'
                checked={newPostPrivacy === 'public' || newPostPrivacy === ''}
                onChange={validateNewPostPrivacyInput}
              />
              <span>Public</span>
            </div>
            <div>
              <input
                type='radio'
                id='private'
                name='privacy'
                value='private'
                checked={newPostPrivacy === 'private'}
                onChange={validateNewPostPrivacyInput}
              />
              <span>Private</span>
            </div>
            <div>
              <input
                type='radio'
                id='almost_private'
                name='privacy'
                value='almost private'
                checked={newPostPrivacy === 'almost private'}
                onChange={validateNewPostPrivacyInput}
              />
              <span>Almost Private</span>
            </div>
          </div>
          <span>Add Img/Gif</span>
          <input
            type='file'
            name='postPic'
            accept='.jpg, .jpeg, .gif'
            id='file'
            ref={newPostPicRef}
          />
          <div className={styles.openNewPostOptions}>
            <span className={styles.openNewPostSubmit} onClick={submitNewPost}>
              Submit
            </span>
            <span
              className={styles.openNewPostCancel}
              onClick={switchNewPostOpen}
            >
              Cancel
            </span>
          </div>
          {inputError ? <span>{inputErrorText}</span> : ''}
        </div>
      ) : (
        <span className={styles.closedNewPost} onClick={switchNewPostOpen}>
          New Post
        </span>
      )}
    </div>
  );
};

export default NewPost;