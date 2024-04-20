export const GetMessages = async (partnerId) => {
  try {
    const response = await fetch(`http://localhost:8080/messages`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      referrerPolicy: 'no-referrer',
      redirect: 'follow',
      body: partnerId,
      credentials: 'include',
    });
    const resp = await response.json();
    return resp;
  } catch (error) {
    console.log('Messages error');
    console.log(error);
  }
};
