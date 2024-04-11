const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'localhost:8080';

export const SendNewPost = async (formData) => {
  try {
    const response = await fetch(`http://${backendUrl}/newpost`, {
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
    console.log('SendNewPost error');
    console.log(error);
  }
};
