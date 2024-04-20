export const GetProfile = async () => {
  try {
    const response = await fetch(`http://localhost:8080/profile`, {
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
    console.log('Profile error');
    console.log(error);
  }
};
