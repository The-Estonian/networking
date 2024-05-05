import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { GetAllGroups } from '../../connections/groupsConnection.js';
import { GetGroupContent } from '../../connections/groupContentConnection.js';
import { GetUserList } from '../../connections/userListConnection.js';

import NewGroup from './NewGroup.jsx';
import NewEvent from './NewEvent.jsx';

import styles from './Groups.module.css';

const Groups = () => {
  const [modal, logout, sendJsonMessage, ,] = useOutletContext();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [notGroupMembers, setNotGroupMembers] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [invatationSent, setInvatationSent] = useState(false);
  const [isGroupMember, setIsGroupMember] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    modal(true);
    GetAllGroups().then((data) => {
      if (data.login === 'success') {
        data.groups == null ? setGroups([]) : setGroups(data.groups);
        //data.groups == null ? setSelectedGroup('') : setSelectedGroup(data.groups[0])
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

  const Groupinfo = (group) => {
    setSelectedGroup(group);

    const formData = new FormData()
    formData.append('GroupId', group.Id)

    GetGroupContent(formData).then((data => {
      console.log("data: ", data.events);
      setGroupMembers(data.groupMembers)
      setEvents(data.events)
      data.isGroupMember == false ? setIsGroupMember(false) : setIsGroupMember(true)
    }))
  }

  const SendGroupInvite = (reciever, title, groupId) => {
    sendJsonMessage({
      type: 'groupInvatation',
      fromuserid: currentUser,
      message: title,
      GroupId: groupId,
      touser: reciever,
    });
    setInvatationSent(true)

    setTimeout(() => {
      setInvatationSent(false)
    }, 2000)
  }

  return (
    <div className={styles.groupContainer}>
      <NewGroup setGroups={setGroups} /> 
      {isGroupMember && <NewEvent groupId={selectedGroup && selectedGroup.Id} currentUser={currentUser} groupTitle={selectedGroup && selectedGroup.Title} />}

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
          <h4>Group Members:</h4>

          {groupMembers && groupMembers.map((member => (
            <p key={member.Id}>{member.Email}</p>
          )))}

          <h4>Group events:</h4>
          {events && events.map((event => (
            <div key={event.EventId} className={styles.eventInfo}>
              <p>{event.EventTitle}</p>
              <p>{event.EventDescription}</p>
              <p>{event.CreatorEmail}</p>
              <p>{event.EventTime}</p>

                {event.Participants.map((participant => (
                <p key={participant.ParticipantId}>{participant.ParticipantEmail}</p>
                )))}

            </div>
          )))}

        
          {isGroupMember &&  <select className={styles.userDopDownMenu} value='' onChange={(e) => SendGroupInvite(e.target.value, selectedGroup.Title, selectedGroup.Id)}>
            <option value="" disabled>Invite user</option>
              {notGroupMembers && notGroupMembers.map((user) => (
              <option key={user.Id} value={user.Id}>{user.Email}</option>
              ))}
          </select>}

          {invatationSent && <label>Group invitation sent!</label>}
          
          {!isGroupMember && <button className={styles.inviteButton}>Request to join</button>}
        </div>
      )}
    </div>
  );
};

export default Groups;
