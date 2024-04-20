export const GetUserList = async () => {
  try {
    const response = await fetch(`http://localhost:8080/userlist`, {
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
    console.log('UserList error');
    console.log(error);
  }
};
