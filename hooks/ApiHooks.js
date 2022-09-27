import {useEffect, useState} from 'react';
import {doFetch} from '../utils/http';
import {apiUrl} from '../utils/variables';


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



export {useUser};