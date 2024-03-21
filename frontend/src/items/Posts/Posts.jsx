import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GetPosts } from '../../connections/postsConnection.js';

import NewPost from "./NewPost.jsx"

import styles from './Posts.module.css';

const Posts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    GetPosts().then((data) => {
      if (data.login === 'success') {
        console.log(data);
        // setAllPosts(JSON.parse(data.posts));
      } else {
        navigate('/');
      }
    });
  }, [navigate]);
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
