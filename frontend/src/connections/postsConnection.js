const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'localhost:8080';

export const GetPosts = async () => {
  try {
    const response = await fetch(`http://${backendUrl}/posts`, {
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
    console.log('Posts error');
    console.log(error);
  }
};
