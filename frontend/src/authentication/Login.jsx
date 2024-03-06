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
  const avatarRef = useRef(null);
  const aboutUserRef = useRef(null);
  // let [authError, setAuthError] = useState('');
  let [loginPress, setLoginPress] = useState(false);
  let [register, setRegister] = useState(false);
  //   const handleLogin = async () => {
  //     try {
  //       const loginValue = loginRef.current.value;
  //       const passwordValue = passwordRef.current.value;

  //       const authHeader = base64Encode(loginValue, passwordValue);
  //       // Perform authentication and get the token from the server
  //       const response = await fetch('https://01.kood.tech/api/auth/signin', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: authHeader,
  //         },
  //         // body: JSON.stringify(/* your authentication credentials */),
  //       });

  //       if (!response.ok) {
  //         // Handle authentication failure
  //         // console.error('Authentication failed');
  //         setAuthError('Wrong Username or Password');
  //         return;
  //       }
  //       const token = await response.json();

  //       // Store the token securely (e.g., in local storage)
  //       props.onLogin(token);
  //       sessionStorage.setItem('jwtToken', token);
  //       navigate('/dashboard');

  //       // Redirect or perform any other actions after successful login
  //     } catch (error) {
  //       console.error('Error during login:', error);
  //     }
  //   };
  const toggleRegister = () => {
    setRegister(!register);
  };
  const toggleLogin = () => {
    setLoginPress(!loginPress);
  };

  const sendRequest = () => {
    console.log('LOGGING IN');
    console.log({
      email: emailRef.current.value,
      password: passwordRef.current.value,
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      date: dateRef.current.value,
      username: usernameRef?.current?.value,
      avatar: avatarRef?.current?.value,
      aboutUser: aboutUserRef?.current?.value,
    });
  };

  return (
    <>
      {loginPress ? (
        <div className={styles.login}>
          <UserInput title='Email' type='email' name='email' ref={emailRef}/>
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
                ref={usernameRef}
              />
                <UserInput
                  title='Avatar'
                  type='file'
                  name='avatar'
                  ref={usernameRef}
                />
              <label className={styles.avatarContainer}>
                Select file
              </label>
            </div>
          ) : (
            ''
          )}
          {/* <span>{authError}</span> */}
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
