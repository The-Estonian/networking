import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { SendNewPost } from '../../connections/newPostConnection';

const PostNewPrivacy = () => {
    const [privacy, setPrivacy] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
      GetStatus().then((data) => {
        if (data.login !== 'success') {
          navigate('/');
        }
      });
    }, [navigate]);

    const validateNewPostPrivacyInput = (e) => {
      setPrivacy(e.target.value);
      if (e.target.value !== 1 || e.target.value !== 2) {
        setInputError(true);
        setInputErrorText('Do not change the value');
      } else {
        setInputError(false);
      }
    };
  
    const submitNewSettings = async () => {
      console.log('Sending new privacy settings');
      const formData = new FormData();
      formData.append('privacy', privacy);
  
      const resp = await SendNewPost(formData);
      // Handle the response
    };
  
    return [privacy, handlePrivacyChange, handleSaveSettings];
  };
  
  export default PostNewPrivacy;