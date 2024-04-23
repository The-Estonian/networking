import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

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
  const [modal] = useOutletContext();
  useEffect(() => {
    modal(true);
    GetProfile().then((data) => {
      if (data.login === 'success') {
        // profile info
        setUserProfile(JSON.parse(data.profile));
        // following and followers test!!!
        setFollowing(['User1', 'User2', 'User3']);
        setFollowers(['User4', 'User5']);
        // profile related posts 
        setPosts(JSON.parse(data.posts));
        console.log(data.posts);
        modal(false);
      } else {
        navigate('/');
        modal(false);
      }
    });
    if (privacy === '') {
      console.log('Privacy is empty!')
      GetNewPrivacy().then(data => setPrivacy(data.GetPrivacy));
    }
  }, [navigate, modal, privacy]);

  let activebox = privacy === '2' ? styles.private : styles.public;

  // Privacy settings for one div, Please create that div!!!!
  const handlePrivacyChange = () => {
    let newPrivacy = privacy === '1' ? '2' : '1';
    setPrivacy(newPrivacy);
    console.log('Privacy is now ' + (newPrivacy === '1' ? 'public' : 'private'));
  
    if (newPrivacy !== '1' && newPrivacy !== '2') {
      console.log('Do not change the value!!');
      return;
    }
  
    const formData = new FormData();
    formData.append('privacy', newPrivacy);
  
    SendNewPrivacy(formData).then(data => setPrivacy(data.SendNewPrivacy));
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profile}>
        <span>SOMEONE STYLE THIS PLEASE!</span>
        <div className={styles.avatar}>
          {userProfile.Avatar ? (
            <img
              className={styles.avatarImg}
              src={`http://localhost:8080/avatar/${userProfile.Avatar}`}
              alt='Avatar'
            ></img>
          ) : (
            ''
          )}
        </div>
        {/* Privacy settings, one div here */}
        <form> 
          <label>
            <input
              type="radio"
              value="1"
              checked={privacy === '1'}
              onChange={handlePrivacyChange}
            />
            Public
          </label>
          <label>
            <input
              type="radio"
              value='2'
              checked={privacy === '2'}
              onChange={handlePrivacyChange} //onclick send data
            />
            Private
          </label>
        </form>
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
      </div>
      {/* Logged in user's posts */}
      <div className={styles.posts}>
        {posts ? (
          <div>
            <h2>Posts</h2>
            <ul>
              {posts.map((post, index) => (
                <li key={index}>
                  <p>Post: {post.PostContent}</p>
                  <p>Date: {post.Date}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>

  );
};

export default Profile;
