import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const backendUrl =
  import.meta.env.VITE_APP_BACKEND_PICTURE_URL || 'http://localhost:8080';

import { GetPosts } from '../../connections/postsConnection.js';
import NewPost from './NewPost.jsx';
import styles from './Posts.module.css';

const Posts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const navigate = useNavigate();
  const [modal] = useOutletContext();
  useEffect(() => {
    modal(true);
    GetPosts().then((data) => {
      console.log('postid', data);
      if (data.login === 'success') {
        data.posts == null ? setAllPosts([]) : setAllPosts(data.posts);
        modal(false);
      } else {
        navigate('/');
        modal(false);
      }
    });
  }, [navigate, modal]);
  return (
    <div className={styles.postsContainer}>
      <NewPost setAllPosts={setAllPosts} />

      {allPosts.map((eachPost, index) => (
        <div className={styles.post} key={index}>
          <h3>{eachPost.Title}</h3>
          <p>{eachPost.Content}</p>
          <p>{eachPost.Username}</p>
          <p>{eachPost.Privacy}</p>
          <p>{eachPost.Date}</p>
          {eachPost.Avatar ? (
            <img
              className={styles.avatarImg}
              src={`${backendUrl}/avatar/${eachPost.Avatar}`}
              alt='Avatar'
            ></img>
          ) : (
            ''
          )}
          {eachPost.Picture ? (
            <img
              className={styles.avatarImg}
              src={`${backendUrl}/avatar/${eachPost.Picture}`}
              alt='Avatar'
            ></img>
          ) : (
            ''
          )}
        </div>
      ))}
    </div>
  );
};

export default Posts;
