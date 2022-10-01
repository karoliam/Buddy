import React, {useContext, useState} from 'react';
import {StyleSheet, SafeAreaView, Text, Button} from 'react-native';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image} from '@rneui/themed';
import {userMedia} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/variables';

const Profile = () => {
  const {user, setIsLoggedIn, avatar, setAvatar} = useContext(MainContext);
  const {userProfilePostData} = userMedia();
  const [profileBackground, setProfileBackgorund] = useState('');
  const [profileDescriptionData, setProfileDescriptionData] = useState('');

  const getProfilePicture = async (profileID) => {
    try {
      const profileData = await userProfilePostData(profileID);
      const profilePostDataArray = profileData.filter(
        (file) => file.title === 'profile_pic'
      );
      const profilePicture = profilePostDataArray.pop();
      if (profilePicture) {
        setAvatar(mediaUrl + profilePicture.filename);
      }
    } catch (error) {
      console.log('Profile.js getProfilePicture' + error);
    }
  };
  const getProfileBackground = async (profileID) => {
    try {
      const profileData = await userProfilePostData(profileID);
      const profilePostDataArray = profileData.filter(
        (file) => file.title === 'profile_background'
      );
      const profileBg = profilePostDataArray.pop();
      if (profileBg) {
        setProfileBackgorund(mediaUrl + profileBg.filename);
      }
    } catch (error) {
      console.log('Profile.js getProfileBackground ' + error);
    }
  };
  const getProfileData = async (profileID) => {
    try {
      const profileData = await userProfilePostData(profileID);
      const profilePostDataArray = profileData.filter(
        (file) => file.title === 'profile_data'
      );
      const profileDesc = profilePostDataArray.pop();
      if (profileDesc) {
        setProfileDescriptionData(profileDesc.description);
        console.log(JSON.stringify(profileDesc.description));
      }
    } catch (error) {
      console.log('Profile.js getProfileData ' + error);
    }
  };

  getProfileData(user.user_id);
  getProfilePicture(user.user_id);
  getProfileBackground(user.user_id);
  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={
          profileBackground
            ? {uri: profileBackground}
            : {
                //placeholderuri
                uri: 'https://i.pinimg.com/originals/d8/81/d3/d881d3e05c90688581cdeaae1be7edae.jpg',
              }
        }
        style={{width: 200, height: 200}}
      ></Image>

      <Image
        source={
          avatar
            ? {uri: avatar}
            : {
                //placeholderuri
                uri: 'https://i.pinimg.com/originals/d8/81/d3/d881d3e05c90688581cdeaae1be7edae.jpg',
              }
        }
        style={{
          width: 100,
          height: 100,
          borderRadius: 400 / 2,
        }}
      />
      <Text>name</Text>
      <Text>bio</Text>
      <Text>location</Text>
      <Text>age</Text>
      <Button title={'Logout'} onPress={logout} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },
});

export default Profile;
