import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useLocation, Link } from 'react-router-dom';

const backendUrl =
  import.meta.env.VITE_APP_BACKEND_PICTURE_URL || 'http://localhost:8080';

import { GetProfile } from '../../connections/profileConnection.js';
import { SendNewPrivacy } from '../../connections/newPrivacyConnection.js';
// import { GetAllComments } from '../../connections/commentsConnection.js';
// import NewComment from '../Comments/NewComment.jsx';

import styles from './Profile.module.css';

const Profile = () => {
  const [userProfile, setUserProfile] = useState('');
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [privacy, setPrivacy] = useState('');
  const [privacyButton, setPrivacyButton] = useState('');
  const navigate = useNavigate();
  const [modal, logout, sendJsonMessage] = useOutletContext();
  const location = useLocation()
  const currentUser = location.pathname.substring(9);
  const [ownProfile, setOwnProfile] = useState(false);
  const [alreadyFollowing, setAlreadyFollowing] = useState(false);
  // const [displayComments, setDisplayComments] = useState(false);

  useEffect(() => {
    modal(true);

    const formData = new FormData();
    formData.append('userId', currentUser);

    GetProfile(formData).then((data) => {
      if (data.login === 'success') {
        console.log("data1: ", data);
        // profile info
        setUserProfile(data.profile)
        setFollowing(data.following);
        setFollowers(data.followers);
        setOwnProfile(data.ownProfile)
        setAlreadyFollowing(data.alreadyFollowing)
        // profile related posts
        setPosts(data.posts);
        if (currentUser.length === 0) {
          setPrivacy(data.profile.Privacy);
          setPrivacyButton("1")
        } else {
          setPrivacyButton("2")
        }
          modal(false);
      } else {
        logout();
      }
    });
  }, [navigate, modal, currentUser]);
  // Privacy settings change
  const handlePrivacyChange = () => {
    let newPrivacy = privacy === '1' ? '2' : '1';
    setPrivacy(newPrivacy);
    if (newPrivacy !== '1' && newPrivacy !== '2') {
      return;
    }
    const formData = new FormData();
    formData.append('privacy', newPrivacy);
    SendNewPrivacy(formData).then((data) => setPrivacy(data.SendNewPrivacy));
  };

  const followUser = (followUserId, e) => {
    sendJsonMessage({
      type: 'followUser',
      touser: followUserId,
    });
    const formData = new FormData();
    formData.append('userId', currentUser);
    
    GetProfile(formData).then((data) => {
      if (data.login === 'success') {
        setFollowers(data.followers);
        setFollowing(data.following);
        setAlreadyFollowing(data.alreadyFollowing)
        setUserProfile(data.profile)  
        setPosts(data.posts)
      }
    })
    if (userProfile.Privacy === "-1") {
      e.target.style.opacity = "0.4" // rändom stiil et näha kas toimib
      e.target.style.cursor = "default"
    }
  }

  const unfollowUser = (userId) => {
    const formData = new FormData();
    formData.append('userId', currentUser);
    formData.append('unFollowId', userId);
    
    GetProfile(formData).then((data) => {
      if (data.login === 'success') {
        setFollowers(data.followers);
        setFollowing(data.following);
        setAlreadyFollowing(data.alreadyFollowing)
        setUserProfile(data.profile)
        setPosts(data.posts)
        setPrivacy("-1") // Is this ok??
      }
    })
  }
  // const ShowComments = (
  //   post,
  //   setAllPosts,
  //   setDisplayComments,
  //   setDisplayTitle
  // ) => {
  //   const formData = new FormData();
  //   formData.append('postID', post.PostID);

  //   GetAllComments(formData).then((data) =>
  //     data.comments == null ? setAllPosts([]) : setAllPosts(data.comments)
  //   );
  //   setDisplayTitle(post.Title);
  //   setDisplayComments(true);
  // };
  console.log("user posts: ", posts)
  return (
    <div className={styles.profileContainer}>
      <div className={styles.avatar}>
        {userProfile.Avatar ? (
          <img
            className={styles.avatarImg}
            src={`${backendUrl}/avatar/${userProfile.Avatar}`}
            alt='Avatar'
          ></img>
        ) : (
          ''
        )}
      </div>
      <div className={styles.profile}>
      <span>Email: {userProfile.Email}</span>
        {userProfile && userProfile.Privacy === "-1"  && !alreadyFollowing ? (
          <p>This user is private, please send a follow request</p>
        ) : (
          <>
            <span>Id: {userProfile.Id}</span>
            <span>First Name: {userProfile.FirstName}</span>
            <span>Last Name: {userProfile.LastName}</span>
            <span>Username: {userProfile.Username}</span>
            <span>
              Date of Birth: {new Date(userProfile.DateOfBirth).toDateString()}
            </span>
            {/* Logged in user's followers and following*/}
            <div className={styles.follow}>
              {following ? (
                <div>
                  <h2>Following</h2>
                  <ul>
                    {following.map((user, index) => (
                      <li key={index}>{user.SenderEmail}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No users are being followed.</p>
              )}

              {followers ? (
                <div>
                  <h2>Followers</h2>
                  <ul>
                    {followers.map((user, index) => (
                      <li key={index}>{user.SenderEmail}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No followers found.</p>
              )}
            </div>
          </>
        )}
        {/* Privacy settings */}
        {privacyButton === '1' && (
          <div>
            <span>Privacy mode: </span>
            <div className={styles.toggleSwitch}>
              <input
                type='checkbox'
                id='toggle'
                className={styles.toggleSwitchCheckbox}
                checked={privacy === '2'}
                onChange={handlePrivacyChange}
              />
              <label className={styles.toggleSwitchLabel} htmlFor='toggle'>
                <span className={styles.toggleSwitchInner} />
                <span className={styles.toggleSwitchSwitch} />
                <span
                  className={
                    privacy === '2'
                      ? styles.toggleSwitchTextOn
                      : styles.toggleSwitchTextOff
                  }
                >
                  {privacy === '2' ? 'ON' : 'OFF'}
                </span>
              </label>
            </div>
          </div>
        )}

        {ownProfile ? null : 
          (alreadyFollowing ? 
            <button onClick={(e) => unfollowUser(currentUser, e)}>Unfollow</button> :
            <button onClick={(e) => followUser(currentUser, e)}>Follow</button>
          )
        }

      </div>

      {/* Logged in user's posts */}
      <div className={styles.postsOverlay}>
        {/* {displayComments ? (
          <NewComment setAllPosts={setAllPosts} />
        ) : (
          <NewPost setAllPosts={setAllPosts} />
        )} */}
        {posts && posts.length > 0 ? (
          posts.map((eachPost, index) => (
            <div className={styles.postContainer} key={index}>
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
                    <p>Published at {new Date(eachPost.Date).toLocaleTimeString()} on {new Intl.DateTimeFormat('en-GB').format(new Date(eachPost.Date))}</p>
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
                    {/* {!displayComments ?<div
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
                        View Comments
                      </div> : ""} */}
                    <div 
                      className={styles.commentsButton}
                      // onClick={() => handleGroupPostComment(eachPost.PostID)}
                    >
                      View Comments
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No posts to show.</p>
        )}
        {/* {displayComments ? (
          <button onClick={showPosts}>RETURN TO POSTS</button>
        ) : (
          ''
        )} */}
      </div>
    </div>
  );
};

export default Profile;