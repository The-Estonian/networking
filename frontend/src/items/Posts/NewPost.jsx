import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { SendNewPost } from '../../connections/newPostConnection';
import { GetStatus } from '../../connections/statusConnection.js';

const NewPost = () => {
  const navigate = useNavigate();
  useEffect(() => {
    SendNewPost();
    GetStatus().then((data) => {
      if (data.login !== 'success') {
        navigate('/');
      }
    });
  }, [navigate]);

  return <div>NewPost</div>;
};

export default NewPost;
