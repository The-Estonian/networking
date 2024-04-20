export const SetRegister = async (formData) => {
  try {
    const response = await fetch(`http://localhost:8080/register`, {
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
