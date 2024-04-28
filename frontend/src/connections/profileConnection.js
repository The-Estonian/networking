const backendUrl =
  import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8080';

export const GetProfile = async (userId = '') => {
  try {
    const response = await fetch(`${backendUrl}/profile/${encodeURIComponent(userId)}`, {
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
    console.log('Profile error');
    console.log(error);
  }
};
