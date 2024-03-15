import { useRef, useState } from 'react';

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
  let [loginMenuOpen, setLoginMenuOpen] = useState(false);
  let [switchRegOrLogin, setSwitchRegOrLogin] = useState(false);
  let [inputError, setInputError] = useState(false);
  let [inputErrorText, setInputErrorText] = useState('');

  const toggleRegisterOrLogin = () => {
    setSwitchRegOrLogin(!switchRegOrLogin);
  };
  const toggleOpenLogin = () => {
    setLoginMenuOpen(!loginMenuOpen);
  };

  const validateEmailInput = (e) => {
    let mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!e.target.value.match(mailformat)) {
      setInputError(true);
      setInputErrorText('Not a valid email!');
    } else {
      setInputError(false);
    }
  };

  const validatePasswordInput = (e) => {
    if (e.target.value.length < 6) {
      setInputError(true);
      setInputErrorText('Password length must be above 5 letters');
    } else {
      setInputError(false);
    }
  };

  const validateNameInput = (e) => {
    if (e.target.value.length < 1) {
      setInputError(true);
      setInputErrorText('Empty names not allowed!');
    } else {
      setInputError(false);
    }
  };

  const validateDateInput = (e) => {
    let currYear = new Date().getFullYear();
    if (currYear - e.target.valueAsDate.getFullYear() < 18) {
      setInputError(true);
      setInputErrorText('Must be at least 18 years old');
    } else {
      setInputError(false);
    }
  };

  // send login / register request to server
  const sendRequest = async () => {
    // if logging in
    const formData = new FormData();
    formData.append('email', emailRef.current.value);
    formData.append('password', passwordRef.current.value);

    // if registering
    if (switchRegOrLogin) {
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
      Login(formData).then((data) => {
        console.log(data);

        // sessionStorage.setItem('jwtToken', resp.sessionId);
      });
    }

    console.log(formData);
  };

  const validateAllRequiredInputs = () => {
    // registration
    if (switchRegOrLogin) {
      if (
        emailRef?.current?.value.length > 0 &&
        passwordRef?.current?.value.length > 0 &&
        firstNameRef?.current?.value.length > 0 &&
        lastNameRef?.current?.value.length > 0 &&
        dateRef?.current?.value.length > 0
      ) {
        sendRequest();
      } else {
        setInputError(true);
        setInputErrorText('Inputs marked with * are required!');
      }
      // login
    } else {
      if (
        emailRef?.current?.value.length > 0 &&
        passwordRef?.current?.value.length > 0
      ) {
        sendRequest();
        setInputError(false);
      } else {
        setInputError(true);
        setInputErrorText('Inputs marked with * are required!');
      }
    }
  };

  return (
    <>
      {loginMenuOpen ? (
        <div className={styles.login}>
          <span className={styles.required}>Email</span>
          <input
            className={styles.userInput}
            type='email'
            name='email'
            ref={emailRef}
            onChange={validateEmailInput}
          />
          <span className={styles.required}>Password</span>
          <input
            className={styles.userInput}
            type='password'
            name='password'
            ref={passwordRef}
            onChange={validatePasswordInput}
          />
          {/* open extra inputs if register */}
          {switchRegOrLogin ? (
            <div className={styles.register}>
              <span className={styles.required}>First name</span>
              <input
                className={styles.userInput}
                type='text'
                name='firstName'
                ref={firstNameRef}
                onChange={validateNameInput}
              />
              <span className={styles.required}>Last name</span>
              <input
                className={styles.userInput}
                type='text'
                name='lastName'
                ref={lastNameRef}
                onChange={validateNameInput}
              />
              <span className={styles.required}>Birth date</span>
              <input
                className={styles.userInput}
                type='date'
                name='date'
                ref={dateRef}
                onChange={validateDateInput}
              />
              <span>Username</span>
              <input
                className={styles.userInput}
                type='text'
                name='username'
                ref={usernameRef}
              />
              <span>About you</span>
              <input
                className={styles.userInput}
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
              onClick={validateAllRequiredInputs}
              className={styles.submit}
              type='submit'
            >
              {!switchRegOrLogin ? 'Login' : 'Register'}
            </button>
            <button
              onClick={toggleOpenLogin}
              className={styles.submit}
              type='submit'
            >
              Cancel
            </button>
          </div>
          {inputError ? (
            <span className={styles.errorMsg}>{inputErrorText}</span>
          ) : (
            ''
          )}
          <span className={styles.switch} onClick={toggleRegisterOrLogin}>
            {switchRegOrLogin ? 'Login' : 'Register'}
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
