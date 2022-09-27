const doFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      // http status code 4xx or 5xx
      // message comes from server
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export {doFetch};
