const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'localhost:8080';

export const GetAllComments = async (formData) => {
  try {
    const response = await fetch(`http://${backendUrl}/comments`, {
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
    console.log('SendNewComment error')
    console.log(error)
  }
}