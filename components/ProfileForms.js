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
import {userMedia, useTag} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/variables';
import {setStatusBarNetworkActivityIndicatorVisible} from 'expo-status-bar';
import PropTypes from 'prop-types';

const ProfileForms = ({navigation}) => {
  const {
    user,
    setUser,
    setIsLoggedIn,
    profileData,
    setProfileData,
    setShowEditProfile,
    update,
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
  const {getFilesByTag} = useTag();
  const getProfileData = async (profileID) => {
    console.log(profileID);
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
        console.log('profileDescriptionData');
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
    getProfileData(user.user_id);
  }, []);

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
      <Button
        title="Own posts"
        onPress={() => {
          navigation.navigate('MyFiles');
        }}
      />
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
ProfileForms.propTypes = {
  navigation: PropTypes.object,
};

export default ProfileForms;
