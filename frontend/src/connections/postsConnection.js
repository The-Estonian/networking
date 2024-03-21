export const GetPosts = async () => {
  try {
    const response = await fetch('http://localhost:8080/posts', {
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
    console.log('Posts error');
    console.log(error);
  }
};
