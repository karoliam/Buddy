import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MainContext = React.createContext({});

const MainProvider = (props) => {
  // TODO: create state isLoggedIn, set value to false
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(true);
  const [updateProfile, setUpdateProfile] = useState(true);
  const [fullName, setFullName] = useState('');
  const [image, setImage] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [showRegisterUserDataForm, setShowRegisterUserDataForm] =
    useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAnotherUserProfile, setShowAnotherUserProfile] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [profileBackground, setProfileBackgorund] = useState('');
  const [profileBackgroundAnother, setProfileBackgorundAnother] = useState('');
  const [profileDescriptionData, setProfileDescriptionData] = useState({});
  const [profilePId, setProfilePId] = useState(0);
  const [profileBId, setProfileBId] = useState(0);
  const [profileDId, setProfileDId] = useState(0);
  const [city, setCity] = useState('');
  const [userIdForProfilePage, setUserIdForProfilePage] = useState(0);

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        update,
        setUpdate,
        updateProfile,
        setUpdateProfile,
        fullName,
        setFullName,
        image,
        setImage,
        avatar,
        setAvatar,
        profileData,
        setProfileData,
        showRegisterUserDataForm,
        setShowRegisterUserDataForm,
        showEditProfile,
        setShowEditProfile,
        showEditPost,
        setShowEditPost,
        profileBackground,
        setProfileBackgorund,
        profileDescriptionData,
        setProfileDescriptionData,
        profilePId,
        setProfilePId,
        profileBId,
        setProfileBId,
        profileDId,
        setProfileDId,
        city,
        setCity,
        userIdForProfilePage,
        setUserIdForProfilePage,
        showAnotherUserProfile,
        setShowAnotherUserProfile,
        profileBackgroundAnother,
        setProfileBackgorundAnother,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export {MainContext, MainProvider};
