import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { GetAllGroups } from '../../connections/groupsConnection.js';
import { GetUserList } from '../../connections/userListConnection.js';

import NewGroup from './NewGroup.jsx';

import styles from './Groups.module.css';


const Groups = () => {
  const [modal, , , ,] = useOutletContext();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    modal(true);
    GetAllGroups().then((data) => {
      if (data.login === 'success') {
        data.groups == null ? setGroups([]) : setGroups(data.groups);
        data.groups == null ? setSelectedGroup('') : setSelectedGroup(data.groups[0])
        modal(false);
      } else {
        navigate('/');
        modal(false);
      }
    });
  }, [navigate, modal]);

  const Groupinfo = (group) => setSelectedGroup(group)
  const handleUserList = () => GetUserList().then((data) => console.log("Userlist: ", data))
     
  return (
    <div className={styles.groupContainer}>
      <NewGroup />
      <div className={styles.groupList}>
        {groups.map((group) => (
          <p className={styles.groupName} key={group.Id} onClick={() => Groupinfo(group)}>{group.Title}</p>
        ))}
      </div>
      {selectedGroup && (
        <div className={styles.groupInfo}>
          <h1>{selectedGroup.Title}</h1>
          <h2>Description: {selectedGroup.Description}</h2>
          <h3>Created by: {selectedGroup.Creator}</h3>
          <button onClick={handleUserList} key={selectedGroup.Id} className={styles.inviteButton}>Invite...</button>
          <button className={styles.inviteButton}>Create event</button>
          <button className={styles.inviteButton}>Join group</button>
        </div>
      )}
      
    </div>
  );
};

export default Groups;
