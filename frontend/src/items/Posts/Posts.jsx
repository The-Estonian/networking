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
        console.log(data);
        // setAllPosts(JSON.parse(data.posts));
        setAllPosts(["post1", "post2", "post3", "post4"])
        modal(false);
      } else {
        navigate('/');
      }
    });
  }, [navigate, modal]);
  return (
    <div className={styles.posts}>
      <NewPost />
      {allPosts.map((eachPost) => {
        <p>{eachPost}</p>;
      })}
    </div>
  );
};

export default Posts;
