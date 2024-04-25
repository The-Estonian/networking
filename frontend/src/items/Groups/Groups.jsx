import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { GetAllGroups } from '../../connections/groupsConnection.js';
import { GetUserList } from '../../connections/userListConnection.js';

import NewGroup from './NewGroup.jsx';

import styles from './Groups.module.css';


const Groups = () => {
  const [
    modal,
    ,
    sendJsonMessage,
    lastMessage,
    ,
    ,
  ] = useOutletContext();

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [notGroupMembers, setNotGroupMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [invatationSent, setInvatationSent] = useState(false);
  const [groupInvNotify, setGroupInvNotify] = useState([]);
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
        navigate('/');
        modal(false);
      }
    });
  }, [navigate, modal])

  // Recieve last message
  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.type === 'groupInvatation') {
        setGroupInvNotify(prevNotifications => [...prevNotifications, messageData]);
      }
    }
  }, [lastMessage])

  function SendGroupInvite(reciever, title, groupId) {
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

  const invatationResponse = (notification, index, e) => {
    setGroupInvNotify(prevNotifications => prevNotifications.filter((_, i) => i !== index))
    console.log("vaartus: ", e.target.value);
    console.log("teada: ", notification);
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
        
          <select className={styles.userDopDownMenu} value='' onChange={(e) => SendGroupInvite(e.target.value, selectedGroup.Title, selectedGroup.Id)}>
            <option value="" disabled>Invite user</option>
              {notGroupMembers && notGroupMembers.map((user) => (
              <option key={user.Id} value={user.Id}>{user.Email}</option>
            ))}
          </select>

          {invatationSent && <label>Group invitation sent!</label>}
         
          {groupInvNotify.map((notification, index) => (
            <div key={index} className={styles.groupInvatation}>
              <p>{notification.fromuserid} invited you to {notification.message}!</p><br></br>
              <button value={'accept'} onClick={(e) => {invatationResponse(notification, index, e)}}>Accept</button>
              <button value={'decline'} onClick={(e) => {invatationResponse(notification, index, e)}}>Decline</button>
            </div>
          ))}
    
          <button className={styles.inviteButton}>Create event</button>
          <button className={styles.inviteButton}>Join group</button>
        </div>
      )}
      
    </div>
  );
};

export default Groups;
