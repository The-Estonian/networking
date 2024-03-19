import { useEffect, useState } from 'react';

import { GetProfile } from '../connections/profileConnection.js';

import styles from './Profile.module.css';

const Profile = () => {
  const [userProfile, setUserProfile] = useState('');
  useEffect(() => {
    GetProfile().then((data) => {
      if (data.login === 'success') {
        console.log(userProfile);
        setUserProfile(JSON.parse(data.profile));
      } else {
        // log user out
      }
    });
  }, []);
  return (
    <div className={styles.profile}>
      <span>Id: {userProfile.Id}</span>
      <span>Email: {userProfile.Email}</span>
      <span>Firt Name: {userProfile.FirstName}</span>
      <span>Last Name: {userProfile.LastName}</span>
      <span>Username: {userProfile.Username}</span>
      <span>
        Date of Birth: {new Date(userProfile.DateOfBirth).toDateString()}
      </span>
      <img
        src={`http://localhost:8080/avatar/${userProfile.Avatar}`}
        alt='Avatar'
      ></img>
    </div>
  );
};

export default Profile;
