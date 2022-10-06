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
  ImageBackground, View, TouchableOpacity, Dimensions
} from "react-native";
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image} from '@rneui/themed';
import {userMedia} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/variables';
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
  } = useContext(MainContext);
  const {userProfilePostData} = userMedia();
  const [profileBackground, setProfileBackgorund] = useState('');
  const [profileDescriptionData, setProfileDescriptionData] = useState({});
  console.log(
    'ProfileForms.js profileforms() ',
    'user',
    user,
    'avatar',
    avatar,
    'profileData',
    profileData,
    'profileBackground',
    profileBackground,
    'profileDescriptionData',
    profileDescriptionData
  );
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
      setProfileBackgorund(mediaUrl + profileBg.filename);
    }
  };

  const getProfilePic = () => {
    const profilePostDataArray = profileData.filter(
      (file) => file.title === 'profile_pic'
    );
    const profilePicture = profilePostDataArray.pop();
    if (profilePicture) {
      setAvatar(mediaUrl + profilePicture.filename);
    }
  };

  const getProfileDescription = () => {
    const profilePostDataArray = profileData.filter(
      (file) => file.title === 'profile_data'
    );
    const profileDesc = profilePostDataArray.pop();
    if (profileDesc) {
      setProfileDescriptionData(JSON.parse(profileDesc.description));
    }
  };

  //getProfileData(user.user_id);
  const logout = async () => {
    await AsyncStorage.clear();
    setProfileData({});
    setAvatar(''), setUser({}), setIsLoggedIn(false);
  };

  const editProfile = () => {};

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
          <FontAwesomeIcon icon="fa-solid fa-moon" size={32}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editProfile}>
          <FontAwesomeIcon icon="fa-solid fa-pen" size={32}/>
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
          <TouchableOpacity style={styles.pastEventsButton}></TouchableOpacity>
          <Text style={styles.pastEventsText}>Past Events</Text>
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
          ></TouchableOpacity>
          <Text style={styles.logoutText}>Logout</Text>
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
    width: '100%',
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
    width: '100%',
    height: '31.65%'
  },
  fullName: {
    color: "#121212",
    height: 30,
    width: 156,
    fontSize: 20,
    marginTop: 2,
    marginLeft: 8
  },
  nightMode: {
    position: 'absolute',
    right: 72,
    width: 32,
    height: 32
  },
  editProfile: {
    position: 'absolute',
    right: 16,
    width: 32,
    height: 32
  },
  fullNameRow: {
    height: 32,
    flexDirection: "row",
    marginTop: 6,
    marginLeft: 16,
    marginRight: 16
  },
  fullNameBorder: {
    width: (width) - 32,
    height: 2,
    backgroundColor: "rgba(165,171,232,1)",
    marginTop: 16,
    marginLeft: 16,
  },
  bioText: {
    color: "#121212",
    height: 65,
    width: 343,
    fontSize: 16,
    marginTop: 16,
    marginLeft: 16
  },
  bioBorder: {
    width: (width) - 32,
    height: 2,
    backgroundColor: "rgba(165,171,232,1)",
    marginTop: 17,
    marginLeft: 16
  },
  locationIcon: {
    width: 32,
    height: 32,
    marginTop: 8
  },
  locationText: {
    color: "rgba(155,151,151,1)",
    height: 20,
    width: 58,
    fontSize: 12
  },
  userLocation: {
    color: "rgba(97,97,97,1)",
    height: 20,
    width: 58,
    fontSize: 16
  },
  locationTextColumn: {
    width: 58,
    marginLeft: 8
  },
  locationIconRow: {
    height: 40,
    flexDirection: "row",
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16
  },
  locationBorder: {
    width: (width) - 32,
    height: 2,
    backgroundColor: "rgba(165,171,232,1)",
    marginTop: 15,
    marginLeft: 16
  },
  ageIcon: {
    width: 32,
    height: 32,
    marginTop: 7
  },
  ageText: {
    color: "rgba(155,151,151,1)",
    height: 20,
    width: 58,
    fontSize: 12
  },
  userAge: {
    color: "rgba(97,97,97,1)",
    height: 20,
    width: 58,
    fontSize: 16
  },
  ageTextColumn: {
    width: 58,
    marginLeft: 8
  },
  ageIconRow: {
    height: 40,
    flexDirection: "row",
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16
  },
  ageBorder: {
    width: (width) - 32,
    height: 2,
    backgroundColor: "rgba(165,171,232,1)",
    marginTop: 15,
    marginLeft: 16
  },
  pastEventsIcon: {
    width: 32,
    height: 32
  },
  pastEventsButton: {
    top: 0,
    left: 7,
    width: 103,
    height: 24,
    position: "absolute",
    backgroundColor: "rgba(165,171,232,1)",
    borderRadius: 20
  },
  pastEventsText: {
    top: 2,
    left: 0,
    position: "absolute",
    color: "rgba(0,0,0,1)",
    height: 24,
    width: 118,
    fontSize: 16,
    textAlign: "center"
  },
  pastEventsButtonStack: {
    width: 118,
    height: 26,
    marginLeft: 11,
    marginTop: 4
  },
  pastEventsCount: {
    position: 'absolute',
    textAlign: 'right',
    right: 16,
    color: "rgba(97,97,97,1)",
    height: 20,
    width: 43,
    fontSize: 16,
    marginTop: 4,
  },
  pastEventsIconRow: {
    height: 32,
    flexDirection: "row",
    marginTop: 17,
    marginLeft: 16,
    marginRight: 16
  },
  pastEventsBorder: {
    width: (width) - 32,
    height: 2,
    backgroundColor: "rgba(165,171,232,1)",
    marginTop: 15,
    marginLeft: 16
  },
  logoutIcon: {
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
    top: 8,
    left: 11,
    position: "absolute",
    color: "rgba(0,0,0,1)",
    height: 30,
    width: 82,
    fontSize: 16,
    textAlign: "center"
  },
  logoutButtonStack: {
    width: 103,
    height: 38,
    marginLeft: 18
  },
  logoutIconRow: {
    height: 38,
    flexDirection: "row",
    marginTop: 16,
    marginLeft: 16,
    marginRight: 206
  }
});

export default ProfileForms;
