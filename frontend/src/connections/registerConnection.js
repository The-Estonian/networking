const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'localhost:8080';

export const SetRegister = async (formData) => {
  try {
    const response = await fetch(`http://${backendUrl}/register`, {
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
    console.log('Registration error');
    console.log(error);
  }
};
