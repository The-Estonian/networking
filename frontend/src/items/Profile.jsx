import { useEffect, useState } from 'react';

import styles from './Profile.module.css';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return (
    <div className={styles.profile}>
      {isLoading ? 'Loading...' : 'Profile data'}
    </div>
  );
};

export default Profile;
