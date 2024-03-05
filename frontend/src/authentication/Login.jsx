import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Login.module.css';

// const base64Encode = (username, password) => {
//   const credentials = `${username}:${password}`;
//   const encodedCredentials = btoa(credentials);
//   return `Basic ${encodedCredentials}`;
// };

const Login = (props) => {
  const loginRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  let [authError, setAuthError] = useState('');
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

  return (
    <div className={styles.login}>
      <span>LOGIN</span>
      <input type='text' name='login' id='login' ref={loginRef} />
      <span>PASSWORD</span>
      <input type='password' name='password' id='password' ref={passwordRef} />
      <span>{authError}</span>
      <button onClick={console.log("LOGGING IN")} className={styles.submit} type='submit'>
        SUBMIT
      </button>
    </div>
  );
};

export default Login;
