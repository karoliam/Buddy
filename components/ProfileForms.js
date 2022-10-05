/**
 * täällä tapahtuu monenlaisia
 * haen profiilin kaikki media yhtenä pötkönä
 * erittelen median titlen mukaisesti kolmeen kategoriaan (näille vois tyylii tehä jonkun yhteisen muuttujan)
 * -> profile_pic on porfiilikuva
 * -> profile_background on profiilin taustakuva
 * -> profile_data on profiilin bio, ikä, nimi sekä sijainti
 *  HUOM enkelikissa on placeholderi
 */

import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, Text, Button} from 'react-native';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image} from '@rneui/themed';
import {userMedia} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/variables';
import {setStatusBarNetworkActivityIndicatorVisible} from 'expo-status-bar';

const ProfileForms = () => {
  const {
    user,
    setUser,
    setIsLoggedIn,
    profileData,
    setProfileData,
    setShowEditProfile,

    avatar,
    setAvatar,
    setProfilePId,
    profileBackground,
    setProfileBackgorund,
    setProfileBId,
    profileDescriptionData,
    setProfileDescriptionData,
    setProfileDId,
  } = useContext(MainContext);
  const {userProfilePostData} = userMedia();

  const getProfileData = async (profileID) => {
    try {
      const profileDescrData = await userProfilePostData(profileID);
      setProfileData(profileDescrData);
    } catch (error) {
      console.log('Profile.js getProfileData ' + error);
    }
  };

  useEffect(() => {
    getProfileData(user.user_id);
  }, []);

  useEffect(() => {
    if (profileData != null) {
      handleProfileData();
    }
  }, [profileData]);

  const handleProfileData = async () => {
    getProfileBackground();
    getProfileDescription();
    getProfilePic();
  };
  const getProfileBackground = () => {
    const profilePostDataArray = profileData.filter(
      (file) => file.title === 'profile_background'
    );
    const profileBg = profilePostDataArray.pop();
    if (profileBg) {
      setProfileBId(profileBg.file_id);
      setProfileBackgorund(mediaUrl + profileBg.filename);
    }
  };

  const getProfilePic = () => {
    const profilePostDataArray = profileData.filter(
      (file) => file.title === 'profile_pic'
    );
    const profilePicture = profilePostDataArray.pop();
    if (profilePicture) {
      setProfilePId(profilePicture.file_id);
      setAvatar(mediaUrl + profilePicture.filename);
    }
  };

  const getProfileDescription = () => {
    const profilePostDataArray = profileData.filter(
      (file) => file.title === 'profile_data'
    );
    const profileDesc = profilePostDataArray.pop();
    if (profileDesc) {
      setProfileDId(profileDesc.file_id);
      setProfileDescriptionData(JSON.parse(profileDesc.description));
    }
  };

  //getProfileData(user.user_id);
  const logout = async () => {
    await AsyncStorage.clear();
    setProfileData({});
    setAvatar(null),
      setUser({}),
      setProfileBackgorund(null),
      setIsLoggedIn(false);
  };

  const editProfile = () => {
    setShowEditProfile(true);
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
      {profileDescriptionData.full_name ? (
        <Text>{profileDescriptionData.full_name}</Text>
      ) : (
        <Text>no</Text>
      )}
      {profileDescriptionData.age ? (
        <Text>{profileDescriptionData.age}</Text>
      ) : (
        <Text>no</Text>
      )}
      {profileDescriptionData.location ? (
        <Text>{profileDescriptionData.location}</Text>
      ) : (
        <Text>no</Text>
      )}
      {profileDescriptionData.bio ? (
        <Text>{profileDescriptionData.bio}</Text>
      ) : (
        <Text>no</Text>
      )}
      <Button title={'Logout'} onPress={logout} />
      <Button title={'Edit profile'} onPress={editProfile} />
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

export default ProfileForms;
