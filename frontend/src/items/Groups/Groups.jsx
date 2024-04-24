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
  const [notGroupMembers, setNotGroupMembers] = useState([]);
  const [inviteSent, setInviteSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    modal(true);
    GetAllGroups().then((data) => {
      if (data.login === 'success') {
        data.groups == null ? setGroups([]) : setGroups(data.groups);
        data.groups == null ? setSelectedGroup('') : setSelectedGroup(data.groups[0])
        GetUserList().then((data) => setNotGroupMembers(data.userList))
        modal(false);
      } else {
        navigate('/');
        modal(false);
      }
    });
  }, [navigate, modal])

  useEffect(() => {
    if (inviteSent) {
        setInviteSent(false);  
    }
  }, [inviteSent]);

  function SendGroupInvite(reciver, title, groupId) {
    console.log(reciver, title, groupId)
    setInviteSent(true);
    const notify = document.getElementById('invatationNotify')
    notify.style.display = 'block'
    setTimeout(() => {
      notify.style.display = 'none'
    }, 2000)
  }

  const Groupinfo = (group) => setSelectedGroup(group)
  
  return (
    <div className={styles.groupContainer}>
      <NewGroup setGroups={setGroups} setSelectedGroup={setSelectedGroup} />

      <div className={styles.groupList}>
      {groups.map((group) => (
        <p
         className={group === selectedGroup ? styles.groupNameSelected : styles.groupName} 
         key={group.Id} 
         onClick={() => Groupinfo(group)}
        >
         {group.Title}
        </p>
      ))}

      </div>

      {selectedGroup && (
        <div className={styles.groupInfo}>
          <h1>{selectedGroup.Title}</h1>
          <h2>Description: {selectedGroup.Description}</h2>
          <h3>Created by: {selectedGroup.Creator}</h3>
        
          <select className={styles.userDopDownMenu} value={inviteSent ? '' : undefined} onChange={(e) => SendGroupInvite(e.target.value, selectedGroup.Title, selectedGroup.Id)}>
            <option value=''>Invite...</option>
            {notGroupMembers && notGroupMembers.map((user) => (
              <option key={user.Id} value={user.Id}>{user.Email}</option>
            ))}
            
          </select>
          <label style={{ display: 'none' }} id='invatationNotify'>Group invitation sent!</label>
          <button className={styles.inviteButton}>Create event</button>
          <button className={styles.inviteButton}>Join group</button>
        </div>
      )}
      
    </div>
  );
};

export default Groups;
