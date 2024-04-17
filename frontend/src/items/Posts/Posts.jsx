import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

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
      if (data.login === 'success') {
        console.log(data.posts);
        data.posts == null ? setAllPosts([]) : setAllPosts(data.posts)
        modal(false);
      } else {
        navigate('/');
      }
    });
  }, [navigate, modal]);
  return (
    <div className={styles.posts}>
      <NewPost />
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
            src={`http://localhost:8080/avatar/${eachPost.Avatar}`}
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
