const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

export const GetLogin = async (formData) => {
  try {
    const response = await fetch(`${backendUrl}/login`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      referrerPolicy: 'no-referrer',
      redirect: 'follow',
      body: formData,
      credentials: 'include',
    });
    const resp = await response.json();
    console.log(resp);
    return resp;
  } catch (error) {
    console.log('Login error');
    console.log(error);
  }
};
