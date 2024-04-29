import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { GetAllGroups } from '../../connections/groupsConnection.js';
import { GetUserList } from '../../connections/userListConnection.js';

import NewGroup from './NewGroup.jsx';
import NewEvent from './NewEvent.jsx';

import styles from './Groups.module.css';

const Groups = () => {
  const [modal, logout, sendJsonMessage, ,] = useOutletContext();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [notGroupMembers, setNotGroupMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [invatationSent, setInvatationSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    modal(true);
    GetAllGroups().then((data) => {
      if (data.login === 'success') {
        data.groups == null ? setGroups([]) : setGroups(data.groups);
        data.groups == null ? setSelectedGroup('') : setSelectedGroup(data.groups[0])
        GetUserList().then((data) => {
          setCurrentUser(data.activeUser)
          setNotGroupMembers(data.userList)
        })
        modal(false);
      } else {
        logout()
      }
    });
  }, [navigate, modal]);

  const SendGroupInvite = (reciever, title, groupId) => {
    sendJsonMessage({
      type: 'groupInvatation',
      fromuserid: currentUser,
      message: title,
      groupId: groupId,
      touser: reciever,
    });
    setInvatationSent(true)

    setTimeout(() => {
      setInvatationSent(false)
    }, 2000)
  }

  const Groupinfo = (group) => setSelectedGroup(group);

  return (
    <div className={styles.groupContainer}>
      <NewGroup setGroups={setGroups} setSelectedGroup={setSelectedGroup} />
      <NewEvent members={selectedGroup && selectedGroup.Members} groupId={selectedGroup && selectedGroup.Id}/>

      <div className={styles.groupList}>
        <h3>All Groups</h3>
        {groups.map((group) => (
          <p
            className={
              group === selectedGroup
                ? styles.groupNameSelected
                : styles.groupName
            }
            key={group.Id}
            onClick={() => Groupinfo(group)}
          >
            {group.Title}
          </p>
        ))}
        <h3>Joined Groups</h3>
      </div>
      {selectedGroup && (
        <div className={styles.groupInfo}>
          <h1>{selectedGroup.Title}</h1>
          <h2>Description: {selectedGroup.Description}</h2>
          <h3>Created by: {selectedGroup.Creator}</h3>
          <h4>Group members: {selectedGroup.Members}</h4>
        
          <select className={styles.userDopDownMenu} value='' onChange={(e) => SendGroupInvite(e.target.value, selectedGroup.Title, selectedGroup.Id)}>
            <option value="" disabled>Invite user</option>
              {notGroupMembers && notGroupMembers.filter(user => !selectedGroup.Members.includes(user.Id)).map((user) => (
              <option key={user.Id} value={user.Id}>{user.Email}</option>
              ))}
          </select>
          {invatationSent && <label>Group invitation sent!</label>}
    
          <button className={styles.inviteButton}>Join group</button>
        </div>
      )}
    </div>
  );
};

export default Groups;
