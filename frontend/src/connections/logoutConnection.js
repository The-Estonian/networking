const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'localhost:8080';

export const SetLogout = async () => {
  try {
    const response = await fetch(`http://${backendUrl}/logout`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      referrerPolicy: 'no-referrer',
      redirect: 'follow',
      credentials: 'include',
    });
    const resp = await response.json();
    return resp;
  } catch (error) {
    console.log('Logout error');
    console.log(error);
  }
};
