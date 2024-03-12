import { useRef, useState } from 'react';

import UserInput from '../items/inputItems/UserInput';

import styles from './Login.module.css';

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const dateRef = useRef(null);
  const usernameRef = useRef(null);
  const aboutUserRef = useRef(null);
  const avatarRef = useRef(null);

  let [authError, setAuthError] = useState('');
  let [loginPress, setLoginPress] = useState(false);
  let [registerOrLogin, setRegisterOrLogin] = useState(false);

  const toggleRegisterOrLogin = () => {
    setRegisterOrLogin(!registerOrLogin);
  };
  const toggleOpenLogin = () => {
    setLoginPress(!loginPress);
  };

  // send login / register request to server
  const sendRequest = async () => {
    // if logging in
    const formData = new FormData();
    formData.append('email', emailRef.current.value);
    formData.append('password', passwordRef.current.value);

    // if registering
    if (registerOrLogin) {
      const fileInput = avatarRef?.current;
      const file = fileInput?.files[0];
      if (file) {
        if (!(file.type.startsWith('image/') || file.type.endsWith('gif'))) {
          setAuthError('Avatar file must be a jpg or gif');
          console.error('Invalid file type. Please select an image or GIF.');
          return;
        }
      }

      formData.append('firstName', firstNameRef?.current?.value);
      formData.append('lastName', lastNameRef?.current?.value);
      formData.append('date', dateRef?.current?.value);
      formData.append('username', usernameRef?.current?.value);
      formData.append('aboutUser', aboutUserRef?.current?.value);
      formData.append('avatar', file);

      // register request and handling
    } else {
      // login request and handling
      Login(formData).then((data)=> {
        console.log(data);
  
        // sessionStorage.setItem('jwtToken', resp.sessionId);
      })
    }

    console.log(formData);
  };

  return (
    <>
      {loginPress ? (
        <div className={styles.login}>
          <UserInput title='Email' type='email' name='email' ref={emailRef} />
          <UserInput
            title='Password'
            type='password'
            name='password'
            ref={passwordRef}
          />
          {/* open extra inputs if register */}
          {registerOrLogin ? (
            <div className={styles.register}>
              <UserInput
                title='First name'
                type='text'
                name='firstName'
                ref={firstNameRef}
              />
              <UserInput
                title='Last name'
                type='text'
                name='lastName'
                ref={lastNameRef}
              />
              <UserInput
                title='Birth date'
                type='date'
                name='date'
                ref={dateRef}
              />
              <UserInput
                title='Username'
                type='text'
                name='username'
                ref={usernameRef}
              />
              <UserInput
                title='About you'
                type='text'
                name='about'
                ref={aboutUserRef}
              />
              <span>Avatar</span>
              <label className={styles.avatarContainer}>
                <input
                  className={styles.userInput}
                  type='file'
                  name='avatar'
                  id='avatar'
                  ref={avatarRef}
                  accept='.jpg, .jpeg, .gif'
                />
                Select file
              </label>
            </div>
          ) : (
            ''
          )}
          <span className={styles.error}>{authError}</span>
          <div className={styles.selectButton}>
            <button
              onClick={sendRequest}
              className={styles.submit}
              type='submit'
            >
              {!registerOrLogin ? 'Login' : 'Register'}
            </button>
            <button
              onClick={toggleOpenLogin}
              className={styles.submit}
              type='submit'
            >
              Cancel
            </button>
          </div>
          <span className={styles.switch} onClick={toggleRegisterOrLogin}>
            {registerOrLogin ? 'Login' : 'Register'}
          </span>
        </div>
      ) : (
        <button className={styles.loginButton} onClick={toggleOpenLogin}>
          Login
        </button>
      )}
    </>
  );
};

export default Login;
