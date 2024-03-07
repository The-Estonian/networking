import { useRef, useState } from 'react';

import UserInput from '../items/inputItems/UserInput';

import styles from './Login.module.css';

// const base64Encode = (username, password) => {
//   const credentials = `${username}:${password}`;
//   const encodedCredentials = btoa(credentials);
//   return `Basic ${encodedCredentials}`;
// };

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
  let [register, setRegister] = useState(false);

  const toggleRegister = () => {
    setRegister(!register);
  };
  const toggleLogin = () => {
    setLoginPress(!loginPress);
  };

  const sendRequest = async () => {
    const fileInput = avatarRef?.current;
    const file = fileInput?.files[0];
    if (file) {
      if (!(file.type.startsWith('image/') || file.type.endsWith('gif'))) {
        console.error('Invalid file type. Please select an image or GIF.');
        return;
      }
    }

    const formData = new FormData();
    formData.append('email', emailRef.current.value);
    formData.append('password', passwordRef.current.value);
    formData.append('firstName', firstNameRef?.current?.value);
    formData.append('lastName', lastNameRef?.current?.value);
    formData.append('date', dateRef?.current?.value);
    formData.append('username', usernameRef?.current?.value);
    formData.append('aboutUser', aboutUserRef?.current?.value);
    formData.append('avatar', file);

    console.log(formData);
    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        referrerPolicy: 'no-referrer',
        redirect: 'follow',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        setAuthError('Wrong Username or Password');
        return;
      }
      const resp = await response.json();
      console.log(resp);
      // sessionStorage.setItem('jwtToken', resp.sessionId);
    } catch (error) {
      console.log('Error logging in');
      console.log(error);
    }
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
          {register ? (
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
          <span>{authError}</span>
          <div className={styles.selectButton}>
            <button
              onClick={sendRequest}
              className={styles.submit}
              type='submit'
            >
              {!register ? 'Login' : 'Register'}
            </button>
            <button
              onClick={toggleLogin}
              className={styles.submit}
              type='submit'
            >
              Cancel
            </button>
          </div>
          <span className={styles.switch} onClick={toggleRegister}>
            {register ? 'Login' : 'Register'}
          </span>
        </div>
      ) : (
        <button className={styles.loginButton} onClick={toggleLogin}>
          Login
        </button>
      )}
    </>
  );
};

export default Login;
