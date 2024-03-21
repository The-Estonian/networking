import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GetProfile } from '../connections/profileConnection.js';

import styles from './Profile.module.css';

const Profile = () => {
  const [userProfile, setUserProfile] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    GetProfile().then((data) => {
      if (data.login === 'success') {
        setUserProfile(JSON.parse(data.profile));
      } else {
        navigate('/');
      }
    });
  }, [navigate]);
  return (
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
      <span>Id: {userProfile.Id}</span>
      <span>Email: {userProfile.Email}</span>
      <span>Firt Name: {userProfile.FirstName}</span>
      <span>Last Name: {userProfile.LastName}</span>
      <span>Username: {userProfile.Username}</span>
      <span>
        Date of Birth: {new Date(userProfile.DateOfBirth).toDateString()}
      </span>
    </div>
  );
};

export default Profile;
