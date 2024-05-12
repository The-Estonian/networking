import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';

const backendUrl =
  import.meta.env.VITE_APP_BACKEND_PICTURE_URL || 'http://localhost:8080';

import { GetPosts } from '../../connections/postsConnection.js';
import NewPost from './NewPost.jsx';
import { GetAllComments } from '../../connections/commentsConnection.js';
import NewComment from '../Comments/NewComment.jsx';

import styles from './Posts.module.css';

const Posts = () => {
  const [displayComments, setDisplayComments] = useState(false);
  const [displayTitle, setDisplayTitle] = useState('');
  const navigate = useNavigate();
  const [modal, logout, , lastMessage] = useOutletContext();
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    showPosts();
  }, [navigate, modal]);

  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.type == 'newPost') {
        showPosts();
      }
    }
  }, [lastMessage]);

  const showPosts = () => {
    modal(true);
    GetPosts().then((data) => {
      if (data.login === 'success') {
        setAllPosts(data.posts || []);
        modal(false);
      } else {
        logout();
      }
    });
    setDisplayComments(false);
    setDisplayTitle('');
  };

  const ShowComments = (
    post,
    setAllPosts,
    setDisplayComments,
    setDisplayTitle
  ) => {
    const formData = new FormData();
    formData.append('postID', post.PostID);

    GetAllComments(formData).then((data) =>
      data.comments == null ? setAllPosts([]) : setAllPosts(data.comments)
    );
    setDisplayTitle(post.Title);
    setDisplayComments(true);
  };
  console.log("eachpost is: ", allPosts);
  return (
    <div className={styles.postsOverlay}>
      {displayComments ? (
        <NewComment setAllPosts={setAllPosts} />
      ) : (
        <NewPost setAllPosts={setAllPosts} />
      )}

      <h1>{displayTitle}</h1>

      {allPosts &&
      allPosts.map((eachPost, index) => (
        <div 
          className={styles.postContainer} 
          key={index}
        >

          <div className={styles.post}>
            <div className={styles.topPart}>
              {eachPost.Avatar ? (
                <Link to={`/profile/${eachPost.UserId}`}>
                  <img
                    className={styles.avatarImg}
                    src={`${backendUrl}/avatar/${eachPost.Avatar}`}
                    alt='Avatar'
                  />
                </Link>
                ) : (
                  ''
              )}
              <div>
                <p>Published by <Link style={{ color: 'inherit', textDecoration: 'none' }} to={`/profile/${eachPost.UserId}`}>{eachPost.Username !== "" ? eachPost.Username : eachPost.Email}</Link></p>
                <p>at {new Date(eachPost.Date).toLocaleTimeString()} on {new Intl.DateTimeFormat('en-GB').format(new Date(eachPost.Date))}</p>
              </div>
            </div>

            <div className={styles.mainContent}>
              <div className={styles.leftSide}></div>
              <div className={styles.rightSide}>
                <p className={styles.title}>{eachPost.Title}</p>
                {eachPost.Picture ? (
                  <img
                    className={styles.postsImg}
                    src={`${backendUrl}/avatar/${eachPost.Picture}`}
                    alt='PostPicure'
                  ></img>
                ) : (
                  ''
                )}
                <p className={styles.content}>{eachPost.Content}</p>
                <div
                  className={styles.commentsButton}
                  onClick={() =>
                    ShowComments(
                      eachPost,
                      setAllPosts,
                      setDisplayComments,
                      setDisplayTitle
                    )
                  }
                >
                  Comments
                </div>
              </div>
            </div>

          </div>
        </div>
      ))}
      {displayComments ? (
        <button onClick={showPosts}>RETURN TO POSTS</button>
      ) : (
        ''
      )}
    </div>
  );
};

export default Posts;
