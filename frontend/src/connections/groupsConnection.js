const backendUrl =
  import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8080';

export const GetAllGroups = async (formData) => {
  try {
    const response = await fetch(`${backendUrl}/groups`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      referrerPolicy: 'no-referrer',
      redirect: 'follow',
      body: formData,
      credentials: 'include',
    });
    const resp = await response.json();
    return resp;
  } catch (error) {
    console.log('Groups error');
    console.log(error);
  }
};
