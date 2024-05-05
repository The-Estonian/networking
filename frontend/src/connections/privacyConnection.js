const backendUrl = 
  import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8080';

export const GetPrivacy = async (formData) => {
  try {
    const response = await fetch(`${backendUrl}/getprivacy`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      referrerPolicy: 'no-referrer',
      redirect: 'follow',
      body: formData,
      credentials: 'include',
    });
    // console.log('Profile response: ', response);
    const resp = await response.json();
    return resp;
  } catch (error) {
    console.log('connections GetPrivacy error');
    console.log(error);
  }
};