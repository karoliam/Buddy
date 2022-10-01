import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MainContext = React.createContext({});

const MainProvider = ({children}) => {
  // TODO: create state isLoggedIn, set value to false
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState('');

  return (
    <MainContext.Provider
      value={{isLoggedIn, setIsLoggedIn, user, setUser, avatar, setAvatar}}
    >
      {children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export {MainContext, MainProvider};
