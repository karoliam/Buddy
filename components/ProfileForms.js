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
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Button,
  ImageBackground,
  View,
  TouchableOpacity,
  Dimensions
} from "react-native";
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image} from '@rneui/themed';
import {userMedia, useTag} from '../hooks/ApiHooks';
import {mediaUrl, applicationTag } from '../utils/variables';
import {setStatusBarNetworkActivityIndicatorVisible} from 'expo-status-bar';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
let {height, width} = Dimensions.get('window');

const ProfileForms = () => {
  const {
    user,
    setUser,
    setIsLoggedIn,
    avatar,
    setAvatar,
    profileData,
    setProfileData,
    setShowEditProfile,
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
    try {
      //const profileDescrData = await userProfilePostData(profileID);
      //setProfileData(profileDescrData);
      const profilePicTag = await getFilesByTag(applicationTag + 'profile_pic' + profileID);
      if (profilePicTag[0].filename != undefined) {
        setAvatar(mediaUrl + profilePicTag[0].filename);
        setProfilePId(profilePicTag[0].file_id);
      }
      const profileDataTag = await getFilesByTag(
        applicationTag + 'profile_data' + profileID
      );

      if (profileDataTag[0].description != undefined) {
        setProfileDescriptionData(JSON.parse(profileDataTag[0].description));
        setProfileDId(profileDataTag[0].file_id);
      }

      const profileBackTag = await getFilesByTag(
        applicationTag + 'profile_background' + profileID
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
      <View style={styles.backgroundImageStack}>
        <Image
          source={
            profileBackground
              ? {uri: profileBackground}
              : {
                //placeholderuri
                uri: 'https://i.pinimg.com/originals/d8/81/d3/d881d3e05c90688581cdeaae1be7edae.jpg',
              }
          }
          style={styles.backgroundImage}
        />
        <View style={styles.profilePictureHolder}>
          <Image
            source={
              avatar
                ? {uri: avatar}
                : {
                  //placeholderuri
                  uri: 'https://i.pinimg.com/originals/d8/81/d3/d881d3e05c90688581cdeaae1be7edae.jpg',
                }
            }
            style={styles.profilePicture}
          />
        </View>
      </View>
      <View style={styles.fullNameRow}>
        {profileDescriptionData.full_name ? (
        <Text style={styles.fullName}>{profileDescriptionData.full_name}</Text>
        ) : (
          <Text style={styles.fullName}>no</Text>
        )}
        <TouchableOpacity style={styles.nightMode}>
          <FontAwesomeIcon icon="fa-solid fa-moon" size={32} color={'#A5ABE8'}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editProfile} onPress={editProfile}>
          <FontAwesomeIcon icon="fa-solid fa-pen" size={32} color={'#A5ABE8'}/>
        </TouchableOpacity>
      </View>
      <View style={styles.fullNameBorder}></View>
      {profileDescriptionData.bio ? (
        <Text style={styles.bioText}>{profileDescriptionData.bio}</Text>
      ) : (
        <Text style={styles.bioText}>no</Text>
      )}
      <View style={styles.bioBorder}></View>
      <View style={styles.locationIconRow}>
        <View style={styles.locationIcon}>
          <FontAwesomeIcon icon="fa-solid fa-location-dot" size={32} color={'#B0B0B0'}/>
        </View>
        <View style={styles.locationTextColumn}>
          <Text style={styles.locationText}>Location</Text>
          {profileDescriptionData.location ? (
            <Text style={styles.userLocation}>{profileDescriptionData.location}</Text>
          ) : (
            <Text style={styles.userLocation}>no</Text>
          )}
        </View>
      </View>
      <View style={styles.locationBorder}></View>
      <View style={styles.ageIconRow}>
        <View style={styles.ageIcon}>
          <FontAwesomeIcon icon="fa-solid fa-clock" size={32} color={'#B0B0B0'}/>
        </View>
        <View style={styles.ageTextColumn}>
          <Text style={styles.ageText}>Age</Text>
          {profileDescriptionData.age ? (
            <Text style={styles.userAge}>{profileDescriptionData.age}</Text>
          ) : (
            <Text style={styles.userAge}>no</Text>
          )}
        </View>
      </View>
      <View style={styles.ageBorder}></View>
      <View style={styles.pastEventsIconRow}>
        <View style={styles.pastEventsIcon}>
          <FontAwesomeIcon icon="fa-solid fa-calendar" size={32} color={'#B0B0B0'}/>
        </View>
        <View style={styles.pastEventsButtonStack}>
          <TouchableOpacity style={styles.pastEventsButton}>
            <Text style={styles.pastEventsText}>Past Events</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.pastEventsCount}>25</Text>
      </View>
      <View style={styles.pastEventsBorder}></View>
      <View style={styles.logoutIconRow}>
        <TouchableOpacity style={styles.logoutIcon}>
          <FontAwesomeIcon icon="fa-solid fa-lock" size={32} color={'#B0B0B0'}/>
        </TouchableOpacity>
        <View style={styles.logoutButtonStack}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={logout}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)'
  },
  backgroundImage: {
    top: 0,
    left: 0,
    width: width,
    height: 226,
  },
  profilePictureHolder: {
    top: 151,
    left: 32,
    width: 100,
    height: 100,
    position: "absolute",
    borderRadius: 100
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 100
  },
  backgroundImageStack: {
    width: width,
    height: 0.31 * height
  },
  fullName: {
    flex: 1,
    textAlign: 'left',
    backgroundColor: 'rgba(0,255,255,0)',
    color: "#121212",
    fontSize: 20,
    marginTop: 2,
    marginLeft: 8
  },
  nightMode: {
    position: 'absolute',
    right: 56,
    width: 32,
    height: 32
  },
  editProfile: {
    position: 'absolute',
    right: 0,
    width: 32,
    height: 32
  },
  fullNameRow: {
    backgroundColor: 'rgba(0,255,255,0)',
    height: 32,
    flexDirection: "row",
    marginTop: 6,
    marginLeft: 16,
    marginRight: 16
  },
  fullNameBorder: {
    width: (width) - 32,
    height: 2,
    backgroundColor: "rgba(165,171,232,0.5)",
    marginTop: 16,
    marginLeft: 16,
  },
  bioText: {
    textAlign: 'left',
    backgroundColor: 'rgba(0,255,255,0)',
    color: "#121212",
    height: 65,
    width: width - 32,
    fontSize: 16,
    marginTop: 16,
    marginLeft: 16
  },
  bioBorder: {
    width: (width) - 32,
    height: 2,
    backgroundColor: "rgba(165,171,232,0.5)",
    marginTop: 17,
    marginLeft: 16
  },
  locationIcon: {
    backgroundColor: 'rgba(0,255,255,0)',
    width: 32,
    height: 32,
    marginTop: 4
  },
  locationText: {
    flex: 1,
    textAlign: 'left',
    backgroundColor: 'rgba(0,255,255,0)',
    color: "rgba(155,151,151,1)",
    fontSize: 12
  },
  userLocation: {
    flex: 1,
    textAlign: 'left',
    backgroundColor: 'rgba(0,255,255,0)',
    color: "rgba(97,97,97,1)",
    fontSize: 16
  },
  locationTextColumn: {
    backgroundColor: 'rgba(0,255,255,0)',
    marginLeft: 8
  },
  locationIconRow: {
    backgroundColor: 'rgba(0,255,255,0)',
    height: 40,
    flexDirection: "row",
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16
  },
  locationBorder: {
    width: (width) - 32,
    height: 2,
    backgroundColor: "rgba(165,171,232,0.5)",
    marginTop: 15,
    marginLeft: 16
  },
  ageIcon: {
    backgroundColor: 'rgba(0,255,255,0)',
    width: 32,
    height: 32,
    marginTop: 4
  },
  ageText: {
    flex: 1,
    textAlign: 'left',
    backgroundColor: 'rgba(0,255,255,0)',
    color: "rgba(155,151,151,1)",
    fontSize: 12
  },
  userAge: {
    flex: 1,
    textAlign: 'left',
    backgroundColor: 'rgba(0,255,255,0)',
    color: "rgba(97,97,97,1)",
    fontSize: 16
  },
  ageTextColumn: {
    backgroundColor: 'rgba(0,255,255,0)',
    marginLeft: 8
  },
  ageIconRow: {
    backgroundColor: 'rgba(0,255,255,0)',
    height: 40,
    flexDirection: "row",
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16
  },
  ageBorder: {
    width: (width) - 32,
    height: 2,
    backgroundColor: "rgba(165,171,232,0.5)",
    marginTop: 15,
    marginLeft: 16
  },
  pastEventsIcon: {
    backgroundColor: 'rgba(0,255,255,0)',
    width: 32,
    height: 32
  },
  pastEventsButton: {
    top: 4,
    left: 7,
    width: 103,
    height: 24,
    backgroundColor: "rgba(165,171,232,0.5)",
    borderRadius: 20
  },
  pastEventsText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'rgba(0,255,255,0)',
    color: "rgba(0,0,0,1)",
    fontSize: 16,
  },
  pastEventsButtonStack: {
    alignContent: 'center',
    backgroundColor: 'rgba(0,255,255,0)',
    width: 118,
    height: 32,
    marginLeft: 11,
  },
  pastEventsCount: {
    flex: 1,
    textAlign: 'right',
    textAlignVertical: 'center',
    right: 16,
    backgroundColor: 'rgba(0,255,255,0)',
    color: "rgba(97,97,97,1)",
    fontSize: 16,
  },
  pastEventsIconRow: {
    backgroundColor: 'rgba(0,255,255,0)',
    height: 32,
    flexDirection: "row",
    marginTop: 17,
    marginLeft: 16,
    marginRight: 16
  },
  pastEventsBorder: {
    width: (width) - 32,
    height: 2,
    backgroundColor: "rgba(165,171,232,0.5)",
    marginTop: 15,
    marginLeft: 16
  },
  logoutIcon: {
    backgroundColor: 'rgba(0,255,255,0)',
    marginTop: 3,
    width: 32,
    height: 32
  },
  logoutButton: {
    top: 0,
    left: 0,
    width: 103,
    height: 36,
    position: "absolute",
    backgroundColor: "rgba(255,0,0,1)",
    borderRadius: 14
  },
  logoutText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'rgba(0,255,255,0)',
    color: "rgba(255,255,255,1)",
    fontSize: 16,
  },
  logoutButtonStack: {
    backgroundColor: 'rgba(0,255,255,0)',
    width: 103,
    height: 38,
    marginLeft: 18
  },
  logoutIconRow: {
    backgroundColor: 'rgba(0,255,255,0)',
    height: 38,
    flexDirection: "row",
    marginTop: 16,
    marginLeft: 16,
    marginRight: 206
  }
});

export default ProfileForms;
