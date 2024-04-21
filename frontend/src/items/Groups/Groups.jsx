import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

const Groups = () => {
  const [modal, sendJsonMessage] = useOutletContext();
  useEffect(() => {
    sendJsonMessage({
      type: 'message',
      Message: "Msg from chat",
      touser: 2,
    });
  });
  return <div>Groups</div>;
};

export default Groups;
