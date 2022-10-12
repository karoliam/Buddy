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
  Dimensions,
} from 'react-native';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image} from '@rneui/themed';
import {userMedia, useTag} from '../hooks/ApiHooks';
import {mediaUrl, applicationTag} from '../utils/variables';
import {setStatusBarNetworkActivityIndicatorVisible} from 'expo-status-bar';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import PropTypes from 'prop-types';
import {ScrollView} from 'react-native-gesture-handler';
let {height, width} = Dimensions.get('window');

const ProfileForms = ({navigation}) => {
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
    updateProfile,
    userIdForProfilePage,
    update,
    setCity,
  } = useContext(MainContext);
  const {userProfilePostData} = userMedia();
  const {getFilesByTag} = useTag();
  const getProfileData = async (profileID) => {
    try {
      //const profileDescrData = await userProfilePostData(profileID);
      //setProfileData(profileDescrData);
      const profileDataTag = await getFilesByTag(
        applicationTag + 'profile_data' + profileID
      );
      console.log('moi', profileDataTag[0].description);

      setProfileDescriptionData(JSON.parse(profileDataTag[0].description));
      setProfileDId(profileDataTag[0].file_id);
      const profilePicTag = await getFilesByTag(
        applicationTag + 'profile_pic' + profileID
      );

      if (profilePicTag[0].filename !== undefined) {
        setAvatar(mediaUrl + profilePicTag[0].filename);
        setProfilePId(profilePicTag[0].file_id);
      } else {
        setAvatar(null);
      }

      const profileBackTag = await getFilesByTag(
        applicationTag + 'profile_background' + profileID
      );
      if (profileBackTag[0].filename !== undefined) {
        setProfileBackgorund(mediaUrl + profileBackTag[0].filename);
        setProfileBId(profileBackTag[0].file_id);
      } else {
        setProfileBackgorund('');
      }
    } catch (error) {
      console.log('Profile.js getProfileData ' + error);
    }
  };

  useEffect(() => {
    getProfileData(user.user_id);
  }, [updateProfile]);

  //getProfileData(user.user_id);
  const logout = async () => {
    setProfileDescriptionData({});
    await AsyncStorage.clear();
    setProfileData({});
    setCity('');
    setAvatar(null);
    setUser({});
    setProfileBackgorund(null);
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
              :
                //placeholderuri
                require('../assets/images/buddyplaceholder.png')
          }
          style={styles.backgroundImage}
        />
        <View style={styles.profilePictureHolder}>

          <Image
            source={
              avatar
                ? {uri: avatar}
                : require('../assets/images/buddyplaceholder.png')
            }
            style={styles.profilePicture}
          />
        </View>
      </View>
      <ScrollView>
        <View style={{marginBottom: 50}}>
      <View style={styles.fullNameRow}>
        {profileDescriptionData.full_name ? (
          <Text style={styles.fullName}>
            {profileDescriptionData.full_name}
          </Text>
        ) : (
          <Text style={styles.fullName}>Add your full name</Text>
        )}
        {/* <TouchableOpacity style={styles.nightMode}>
          <FontAwesomeIcon icon="fa-solid fa-moon" size={32} color={'#A5ABE8'}/>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.editProfile} onPress={editProfile}>
          <Text style={{marginTop: 3}}>Edit profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bioBorder}></View>
      <View style={styles.bioContainer}>
      <View style={styles.locationIconRow}>
        <View style={styles.locationIcon}>
          <FontAwesomeIcon icon="fa-solid fa-book" size={32} color={'#B0B0B0'}/>
        </View>
        <View style={styles.locationTextColumn}>
          <Text style={styles.bioSmallText}>Bio</Text>
          {profileDescriptionData.bio ? (
            <Text style={styles.bioText}>{profileDescriptionData.bio}</Text>
          ) : (
            <Text style={styles.userLocation}>Write something about yourself</Text>
          )}
        </View>
        </View>
        </View>
      <View style={styles.bioBorder}></View>
      <View style={styles.locationIconRow}>
        <View style={styles.locationIcon}>
          <FontAwesomeIcon
            icon="fa-solid fa-location-dot"
            size={32}
            color={'#B0B0B0'}
          />
        </View>
        <View style={styles.locationTextColumn}>
          <Text style={styles.locationText}>Location</Text>
          {profileDescriptionData.location ? (
            <Text style={styles.userLocation}>
              {profileDescriptionData.location}
            </Text>
          ) : (
            <Text style={styles.userLocation}>no</Text>
          )}
        </View>
      </View>
      <View style={styles.locationBorder}></View>
      <View style={styles.ageIconRow}>
        <View style={styles.ageIcon}>
          <FontAwesomeIcon
            icon="fa-solid fa-clock"
            size={32}
            color={'#B0B0B0'}
          />
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
          <FontAwesomeIcon
            icon="fa-solid fa-calendar"
            size={32}
            color={'#B0B0B0'}
          />
        </View>
        <View style={styles.pastEventsButtonStack}>
          <TouchableOpacity
            style={styles.pastEventsButton}
            onPress={() => {
              navigation.navigate('MyFiles');
            }}
          >
            <Text style={styles.pastEventsText}>Own posts</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.pastEventsBorder}></View>
      <View style={styles.logoutIconRow}>
        <TouchableOpacity style={styles.logoutIcon}>
          <FontAwesomeIcon
            icon="fa-solid fa-lock"
            size={32}
            color={'#B0B0B0'}
          />
        </TouchableOpacity>
        <View style={styles.logoutButtonStack}>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
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
    position: 'absolute',
    borderRadius: 100,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  backgroundImageStack: {
    width: width,
    height: 0.31 * height,
  },
  fullName: {
    flex: 1,
    textAlign: 'left',
    backgroundColor: 'rgba(0,255,255,0)',
    color: '#121212',
    fontSize: 20,
    marginTop: 2,
    marginLeft: 8,
    fontWeight: '500'
  },
  nightMode: {
    position: 'absolute',
    right: 56,
    width: 32,
    height: 32,
  },
  editProfile: {
    backgroundColor: 'rgba(246,203,100,1)',
    borderRadius: 10,
    height: 40,
    padding: 8,
  },
  fullNameRow: {
    backgroundColor: 'rgba(0,255,255,0)',
    height: 32,
    flexDirection: 'row',
    marginTop: 6,
    marginLeft: 16,
    marginRight: 16,
  },
  fullNameBorder: {
    width: width - 32,
    height: 2,
    backgroundColor: 'rgba(165,171,232,0.5)',
    marginTop: 16,
    marginLeft: 16,
  },
  bioSmallText: {
    textAlign: 'left',
    backgroundColor: 'rgba(0,255,255,0)',
    color: "rgba(155,151,151,1)",
    fontSize: 12
  },

  bioText: {
    textAlign: 'left',
    backgroundColor: 'rgba(0,255,255,0)',
    color: "#121212",
    height: 90,
    fontSize: 16,
    marginTop: 8
  },
  bioContainer: {
    // flex: 2,
    height: 140
  },
  bioBorder: {
    width: width - 32,
    height: 2,
    backgroundColor: 'rgba(165,171,232,0.5)',
    marginTop: 17,
    marginLeft: 16,
  },
  locationIcon: {
    backgroundColor: 'rgba(0,255,255,0)',
    width: 32,
    height: 32,
    marginTop: 4,
  },
  locationText: {
    flex: 1,
    textAlign: 'left',
    backgroundColor: 'rgba(0,255,255,0)',
    color: 'rgba(155,151,151,1)',
    fontSize: 12,
  },
  userLocation: {
    flex: 1,
    textAlign: 'left',
    backgroundColor: 'rgba(0,255,255,0)',
    color: 'rgba(97,97,97,1)',
    fontSize: 16,
  },
  locationTextColumn: {
    backgroundColor: 'rgba(0,255,255,0)',
    marginLeft: 8,
  },
  locationIconRow: {
    backgroundColor: 'rgba(0,255,255,0)',
    height: 40,
    flexDirection: 'row',
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,
  },
  locationBorder: {
    width: width - 32,
    height: 2,
    backgroundColor: 'rgba(165,171,232,0.5)',
    marginTop: 15,
    marginLeft: 16,
  },
  ageIcon: {
    backgroundColor: 'rgba(0,255,255,0)',
    width: 32,
    height: 32,
    marginTop: 4,
  },
  ageText: {
    flex: 1,
    textAlign: 'left',
    backgroundColor: 'rgba(0,255,255,0)',
    color: 'rgba(155,151,151,1)',
    fontSize: 12,
  },
  userAge: {
    flex: 1,
    textAlign: 'left',
    backgroundColor: 'rgba(0,255,255,0)',
    color: 'rgba(97,97,97,1)',
    fontSize: 16,
  },
  ageTextColumn: {
    backgroundColor: 'rgba(0,255,255,0)',
    marginLeft: 8,
  },
  ageIconRow: {
    backgroundColor: 'rgba(0,255,255,0)',
    height: 40,
    flexDirection: 'row',
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,
  },
  ageBorder: {
    width: width - 32,
    height: 2,
    backgroundColor: 'rgba(165,171,232,0.5)',
    marginTop: 15,
    marginLeft: 16,
  },
  pastEventsIcon: {
    backgroundColor: 'rgba(0,255,255,0)',
    width: 32,
    height: 32,
  },
  pastEventsButton: {
    top: 4,
    left: 7,
    width: 103,
    height: 40,
    backgroundColor: "rgba(165,171,232,0.5)",
    borderRadius: 10,
    margin: 'auto',
    alignItems: 'center'
  },
  pastEventsText: {
    flex: 1,
    backgroundColor: 'rgba(0,255,255,0)',
    color: 'rgba(0,0,0,1)',
    fontSize: 16,
    marginTop: 8
  },
  pastEventsButtonStack: {
    alignContent: 'center',
    width: 118,
    height: 32,
    marginLeft: 11,
    bottom: 8
  },
  pastEventsCount: {
    flex: 1,
    textAlign: 'right',
    textAlignVertical: 'center',
    right: 16,
    backgroundColor: 'rgba(0,255,255,0)',
    color: 'rgba(97,97,97,1)',
    fontSize: 16,
  },
  pastEventsIconRow: {
    backgroundColor: 'rgba(0,255,255,0)',
    height: 32,
    flexDirection: 'row',
    marginTop: 17,
    marginLeft: 16,
    marginRight: 16,
  },
  pastEventsBorder: {
    width: width - 32,
    height: 2,
    backgroundColor: 'rgba(165,171,232,0.5)',
    marginTop: 15,
    marginLeft: 16,
  },
  logoutIcon: {
    backgroundColor: 'rgba(0,255,255,0)',
    marginTop: 3,
    width: 32,
    height: 32,
  },
  logoutButton: {
    top: 0,
    left: 0,
    width: 103,
    height: 40,
    position: "absolute",
    backgroundColor: '#f66464ff',
    borderRadius: 10,
  },
  logoutText: {
    flex: 1,
    alignSelf: 'center',
    margin: 8,
    backgroundColor: 'rgba(0,255,255,0)',
    color: 'rgba(255,255,255,1)',
    fontSize: 16,
  },
  logoutButtonStack: {
    backgroundColor: 'rgba(0,255,255,0)',
    width: 103,
    height: 38,
    marginLeft: 18,
  },
  logoutIconRow: {
    backgroundColor: 'rgba(0,255,255,0)',
    height: 38,
    flexDirection: 'row',
    marginTop: 16,
    marginLeft: 16,
    marginRight: 206,
  },
});

ProfileForms.propTypes = {
  navigation: PropTypes.object,
};

export default ProfileForms;
