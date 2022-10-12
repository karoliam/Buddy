/**
 * swaippauksella takas ei vaihdu showAnotherProfile
 */

import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, Text, Button} from 'react-native';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image} from '@rneui/themed';
import {userMedia, useTag} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/variables';
import {setStatusBarNetworkActivityIndicatorVisible} from 'expo-status-bar';

const AnotherUserProfileForms = () => {
  const {
    avatar,
    setAvatar,
    setProfilePId,
    setProfileData,
    updateProfile,
    setUpdateProfile,
    profileBackground,
    setProfileBackgorund,
    setProfileBId,
    profileDescriptionData,
    setProfileDescriptionData,
    setUser,
    setProfileDId,
    userIdForProfilePage,
    setShowAnotherUserProfile,
    showAnotherUserProfile,
  } = useContext(MainContext);
  const {userProfilePostData} = userMedia();
  const {getFilesByTag} = useTag();
  const getProfileData = async (profileID) => {
    try {
      //const profileDescrData = await userProfilePostData(profileID);
      //setProfileData(profileDescrData);
      const profilePicTag = await getFilesByTag('buddyprofile_pic' + profileID);
      if (profilePicTag[0].filename != undefined) {
        setAvatar(mediaUrl + profilePicTag[0].filename);
        setProfilePId(profilePicTag[0].file_id);
      }
      const profileDataTag = await getFilesByTag(
        'buddyprofile_data' + profileID
      );

      if (profileDataTag[0].description != undefined) {
        setProfileDescriptionData(JSON.parse(profileDataTag[0].description));
        setProfileDId(profileDataTag[0].file_id);
      }

      const profileBackTag = await getFilesByTag(
        'buddyprofile_background' + profileID
      );
      if (profileBackTag[0].filename != undefined) {
        setProfileBackgorund(mediaUrl + profileBackTag[0].filename);
        setProfileBId(profileBackTag[0].file_id);
      }
    } catch (error) {
      console.log('Profile.js getProfileData ' + error);
    }
  };
  useEffect(() => {
    getProfileData(userIdForProfilePage);
  }, [userIdForProfilePage]);

  //getProfileData(user.user_id);
  const returnToSingle = () => {
    clearProfile;
    setUpdateProfile(!updateProfile);
    setShowAnotherUserProfile(!showAnotherUserProfile);
  };
  const clearProfile = () => {
    setProfileData({});
    setProfileDescriptionData({});
    setAvatar(null);
    setProfileBackgorund(null);
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
      <Button title={'Back'} onPress={returnToSingle} />
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

export default AnotherUserProfileForms;
