export const GetStatus = async () => {
  try {
    const response = await fetch('http://localhost:8080/status', {
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
    console.log('Status error');
    console.log(error);
  }
};
