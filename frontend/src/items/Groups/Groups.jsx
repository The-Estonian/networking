import { useOutletContext } from 'react-router-dom';

const Groups = () => {
  const [, , , , readyState] = useOutletContext();
  console.log(readyState);
  return <div>Groups</div>;
};

export default Groups;
