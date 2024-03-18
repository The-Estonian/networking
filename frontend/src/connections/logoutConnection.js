export const Logout = async () => {
  try {
    const response = await fetch('http://localhost:8080/logout', {
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
    console.log('Logout error');
    console.log(error);
  }
};
