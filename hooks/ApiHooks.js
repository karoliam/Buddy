import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../context/MainContext';
import {doFetch} from '../utils/http';
import {apiUrl, applicationTag} from '../utils/variables';

const useMedia = (update, myFilesOnly = false) => {
  const [mediaArray, setMediaArray] = useState([]);
  const {user, filterTags} = useContext(MainContext);

  const loadMedia = async () => {
    try {
      if (filterTags !== null) {
        const json = await useTag().getFilesByTag(filterTags);
        console.log(json);
        json.reverse();
        const allMediaData = json.map(async (mediaItem) => {
          return await doFetch(apiUrl + 'media/' + mediaItem.file_id);
        });
        setMediaArray(await Promise.all(allMediaData));
      } else {
        let json = await useTag().getFilesByTag(applicationTag);
        console.log(json);
        if (myFilesOnly) {
          json = json.filter((file) => file.user_id === user.user_id);
        }
        json.reverse();
        const allMediaData = json.map(async (mediaItem) => {
          return await doFetch(apiUrl + 'media/' + mediaItem.file_id);
        });
        setMediaArray(await Promise.all(allMediaData));
      }
    } catch (error) {
      console.log('media fetch failed', error);
    }
  };
  useEffect(() => {
    loadMedia();
  }, [update]);

  const postMedia = async (token, data) => {
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
      },
      body: data,
    };
    try {
      return await doFetch(apiUrl + 'media', options);
    } catch (error) {
      console.log('usemedia-postmedia' + error);
      throw new Error(error.message);
    }
  };
  const putMedia = async (token, data, fileId) => {
    console.log('putmedia', data);
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: data,
    };
    try {
      return await doFetch(apiUrl + 'media/' + fileId, options);
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const deleteMedia = async (token, fileId) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      return await doFetch(apiUrl + 'media/' + fileId, options);
    } catch (error) {
      throw new Error(error.message);
    }
  };
  return {mediaArray, postMedia, loadMedia, putMedia, deleteMedia};
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    return await doFetch(apiUrl + 'tags/' + tag);
  };

  const getTagsByFileId = async (id) => {
    return await doFetch(apiUrl + 'tags/file/' + id);
  };

  const postTag = async (token, tag) => {
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tag),
    };
    try {
      return await doFetch(apiUrl + 'tags', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getAllTags = async (token) => {
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      }
    };
    try {
      const response = await fetch(apiUrl + 'tags/',options);
      const listOfTags = await response.json();
      return listOfTags;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {getFilesByTag, postTag, getTagsByFileId, getAllTags};
};

const userMedia = () => {
  const userProfilePostData = async (profileID) => {
    const options = {
      method: 'GET',
    };
    try {
      const response = await fetch(apiUrl + 'media/user/' + profileID, options);
      const userData = await response.json();
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const deleteMediaById = async (token, fileId) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      const response = await fetch(apiUrl + 'media/' + fileId, options);
      const deleteResponce = await response.json();
      return deleteResponce;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  return {userProfilePostData, deleteMediaById};
};

const useLogin = () => {
  const postLogin = async (userCredentials) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    };
    try {
      return await doFetch(apiUrl + 'login', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };
  return {postLogin};
};

const useUser = () => {
  const getUserByToken = async (token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const response = await fetch(apiUrl + 'users/user', options);
      const userData = await response.json();
      if (response.ok) {
        return userData;
      } else {
        throw new Error(userData.message);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
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

  const getUserById = async (token, user_id) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const userData = await doFetch(apiUrl + 'users/' + user_id, options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const deleteUserByPut = async (token, newUsername) => {
    try {
      const options = {
        method: 'PUT',
        headers: {'x-access-token': token, 'Content-Type': 'application/json'},
        body: JSON.stringify(newUsername),
      };
      const userUpdate = await doFetch(apiUrl + 'users', options);
      return userUpdate;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {getUserByToken, postUser, getUserById, deleteUserByPut};
};
const useComments = (update) => {
  const postComment = async (token, data) => {
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    console.log('options', options);
    try {
      return await doFetch(apiUrl + 'comments', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const getCommentByFileId = async (file_id) => {
    try {
      const options = {
        method: 'GET',
      };
      const response = await fetch(
        apiUrl + 'comments/file/' + file_id,
        options
      );
      const commentData = await response.json();
      if (response.ok) {
        return commentData;
      } else {
        throw new Error(commentData.message);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // const loadComments = async () => {
  //   const [commentArray, setCommentArray] = useState([]);
  //   try {
  //     const json = await getCommentByFileId(file_id);
  //     console.log(json);
  //     json.reverse();
  //     const allCommentData = json.map(async (commentItem) => {
  //       return await doFetch(apiUrl + 'comments/file/' + file_id);
  //     });
  //     setCommentArray(await Promise.all(allCommentData));
  //   } catch (error) {
  //     console.log('comment fetch failed', error);
  //   }
  // };
  // useEffect(() => {
  //   loadComments();
  // }, [update]);

  return {postComment, getCommentByFileId};
};

export {useLogin, useUser, userMedia, useMedia, useTag, useComments};
