const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'localhost:8080';

export const SendNewGroup = async (formData) => {
  try {
    const response = await fetch(`http://${backendUrl}/newgroup`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      referrerPolicy: 'no-referrer',
      redirect: 'follow',
      body: formData,
      credentials: 'include',
    });
    const resp = await response.json()
    return resp
  } catch (error) {
    console.log('SendNewGroup error')
    console.log(error)
  }
}