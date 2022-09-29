import {doFetch} from '../utils/http';
import {apiUrl} from '../utils/variables';
const useMedia = () => {
  const postMedia = async (formdata, token) => {
    const options = {
      method: 'POST',
      headers: {'x-access-token': token},
      body: formdata,
    };
    try {
      const response = await doFetch(apiUrl + '/media', options);
      console.log(response);
      return response;
    } catch (error) {
      console.log('usemedia-postmedia' + error);
    }
  };
  return {postMedia};
};

const useUser = () => {
  const postUser = async (userData) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };
    try {
      return await doFetch(apiUrl + 'users', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {postUser};
};

export {useUser, useMedia};
