const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'localhost:8080';

export const GetNewPrivacy = async () => {
  try {
    const response = await fetch(`http://${backendUrl}/getprivacy`, {
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
    console.log('connections GetPrivacy error');
    console.log(error);
  }
};