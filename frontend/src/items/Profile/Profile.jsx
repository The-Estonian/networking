import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const backendUrl =
  import.meta.env.VITE_APP_BACKEND_PICTURE_URL || 'http://localhost:8080';

import { GetProfile } from '../../connections/profileConnection.js';
import { SendNewPrivacy } from '../../connections/newPrivacyConnection.js';
import { GetNewPrivacy } from '../../connections/privacyConnection.js';

import styles from './Profile.module.css';

const Profile = () => {
  const [userProfile, setUserProfile] = useState('');
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [privacy, setPrivacy] = useState('');
  const navigate = useNavigate();
  const [modal, logout] = useOutletContext();

  //Get path username
  const userEmail = window.location.pathname.substring(9)
  console.log('username from path: ', userEmail)

  useEffect(() => {
    
    modal(true);
    GetProfile(userEmail).then((data) => {
      if (data.login === 'success') {
        // profile info
        setUserProfile(data.profile);
        // following and followers test!!!
        setFollowing(['User1', 'User2', 'User3']);
        setFollowers(['User4', 'User5']);
        // profile related posts
        setPosts(data.posts);
        modal(false);
      } else {
        logout();
      }
    });
    // Get privacy settings
    if (privacy === '') {
      GetNewPrivacy().then((data) => setPrivacy(data.GetPrivacy));
    }
  }, [navigate, modal]);

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
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profile}>
        {userProfile && Object.keys(userProfile).length > 0 ? (
          <>
            <span>SOMEONE STYLE THIS PLEASE!</span>
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

            <span>Id: {userProfile.Id}</span>
            <span>Email: {userProfile.Email}</span>
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
                      <li key={index}>{user}</li>
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
                      <li key={index}>{user}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No followers found.</p>
              )}
            </div>
            {/* Privacy settings */}
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
          </>
        ) : (
          <p>This user is private, please send a follow request</p>
        )}
      </div>
      {/* Logged in user's posts */}
      <div className={styles.posts}>
        {posts && posts.length > 0 ? (
          <div>
            <h2>Posts</h2>
            <ul>
              {posts.map((post, index) => (
                <li key={index}>
                  <p>Post: {post.PostContent}</p>
                  <p>Date: {post.Date}</p>
                  {post.Picture ? (
                    <img
                      className={styles.profilePostImg}
                      src={`${backendUrl}/avatar/${post.Picture}`}
                      alt='PostPicure'
                    ></img>
                  ) : (
                    ''
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No posts to show.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
