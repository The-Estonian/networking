const backendUrl =
  import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8080';

export const GetProfile = async (userEmail) => {
  try {
    const response = await fetch(`${backendUrl}/profile/${encodeURIComponent(userEmail)}`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      referrerPolicy: 'no-referrer',
      redirect: 'follow',
      credentials: 'include',
    });
    // console.log('Profile response: ', response);
    const resp = await response.json();
    return resp;
  } catch (error) {
    console.log('Profile error');
    console.log(error);
  }
};
