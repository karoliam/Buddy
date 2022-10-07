import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Button,
  TextInput,
  ImagePickerIOS, Dimensions
} from "react-native";
import {MainContext} from '../context/MainContext';
import {Image, Input} from '@rneui/themed';
import {useMedia, userMedia, useTag} from '../hooks/ApiHooks';
import {TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Controller, useForm} from 'react-hook-form';
import {single_pixel} from '../images';
import SelectList from 'react-native-dropdown-select-list';
import cityNames from '../utils/cityNames';
import { applicationTag } from "../utils/variables";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
let {height, width} = Dimensions.get('window');

const EditProfileForms = () => {
  const {
    user,
    setUser,
    avatar,
    setAvatar,
    setShowEditProfile,
    profileBackground,
    setProfileBackgorund,
    profileDescriptionData,
    setProfilePId,
    setProfileBId,
    setProfileDId,
    profilePId,
    profileBId,
    profileDId,
    city,
    setCity,
  } = useContext(MainContext);
  const [tempProfBack, setTempProfBack] = useState(null);
  const [tempProfAvatar, setTempProfAvatar] = useState(null);
  const [avatarMediatype, setAvatarMediatype] = useState(null);
  const [backgroundMediatype, setBackgroundMediatype] = useState(null);
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const {deleteMediaById} = userMedia();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      full_name: profileDescriptionData.full_name,
      age: profileDescriptionData.age,
      location: profileDescriptionData.location,
      bio: profileDescriptionData.bio,
    },
  });
  //getProfileData(user.user_id);
  const returnToProfile = () => {
    setTempProfAvatar(null);
    setTempProfBack(null);
    setShowEditProfile(false);
  };

  const selectBackgroundImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 4],
      quality: 1,
    });
    setTempProfBack(result.uri);
    setProfileBackgorund('');
    setBackgroundMediatype(result.type);
  };
  const selectProfilePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 4],
      quality: 1,
    });
    setTempProfAvatar(result.uri);
    setAvatar('');
    setAvatarMediatype(result.type);
  };

  const saveData = (data) => {
    setProfileBackgorund(tempProfBack);
    setAvatar(tempProfAvatar);
    updateserData(data);
  };

  const updateserData = async (data) => {
    const token = await AsyncStorage.getItem('userToken');
    const pixelUri = Image.resolveAssetSource(single_pixel).uri;
    const profileData = new FormData();
    profileData.append('title', 'profile_data');
    profileData.append('file', {
      uri: 'https://placekitten.com/100',
      name: 'placekitten',
      type: 'image/jpeg',
    });
    const profileDataDescription = {
      full_name: data.full_name,
      age: data.age,
      location: city,
      bio: data.bio,
    };
    profileData.append('description', JSON.stringify(profileDataDescription));

    let profileBack = null;
    if (tempProfBack != null) {
      profileBack = new FormData();
      profileBack.append('title', 'profile_background');
      const filenameBack = tempProfBack.split('/').pop();
      let extension = filenameBack.split('.').pop();
      extension = extension === 'jpg' ? 'jpeg' : extension;
      profileBack.append('file', {
        uri: tempProfBack,
        name: filenameBack,
        type: backgroundMediatype + '/' + extension,
      });
    }
    let profilePic = null;
    if (tempProfAvatar != null) {
      profilePic = new FormData();
      profilePic.append('title', 'profile_pic');
      const filename = tempProfAvatar.split('/').pop();
      let extension = filename.split('.').pop();
      extension = extension === 'jpg' ? 'jpeg' : extension;
      profilePic.append('file', {
        uri: tempProfAvatar,
        name: filename,
        type: avatarMediatype + '/' + extension,
      });
    }

    if (token) {
      try {
        if (profilePic != null) {
          const delPic = await deleteMediaById(token, profilePId);
          const profilePicUpdate = await postMedia(token, profilePic);
          setProfilePId(profilePicUpdate.file_id);
          const profilePicTag = {
            file_id: profilePicUpdate.file_id,
            tag: applicationTag + 'profile_pic' + user.user_id,
          };
          const picTag = await postTag(token, profilePicTag);
        }
        if (profileBack != null) {
          const delBack = await deleteMediaById(token, profileBId);
          const backgroundUpdate = await postMedia(token, profileBack);
          setProfileBId(backgroundUpdate.file_id);
          const profileBackTag = {
            file_id: backgroundUpdate.file_id,
            tag: applicationTag + 'profile_background' + user.user_id,
          };
          const BTag = await postTag(token, profileBackTag);
        }
        const delData = await deleteMediaById(token, profileDId);
        const profileDataUpdate = await postMedia(token, profileData);
        setProfileDId(profileDataUpdate.file_id);
        const profileDataTag = {
          file_id: profileDataUpdate.file_id,
          tag: applicationTag + 'profile_Data' + user.user_id,
        };
        const DTag = await postTag(token, profileDataTag);
      } catch (error) {
        console.log('EditProfileForms.js upDateData', error);
      }
    }
    setShowEditProfile(false);
  };
  const handleSelect = (e) => {
    console.log(cityNames[e].value);
    setCity(cityNames[e].value);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.backgroundImageStack}>
          <TouchableOpacity style={styles.backgroundImageStack} onPress={selectBackgroundImage}>
            <Image
              source={
                profileBackground
                  ? {uri: profileBackground}
                  : {
                      //placeholderuri
                      uri: tempProfBack
                        ? tempProfBack
                        : 'https://i.pinimg.com/originals/d8/81/d3/d881d3e05c90688581cdeaae1be7edae.jpg',
                    }
              }
              style={styles.backgroundImage}
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profilePictureHolder} onPress={selectProfilePicture}>
            <Image
              source={
                avatar
                  ? {uri: avatar}
                  : {
                      //placeholderuri
                      uri: tempProfAvatar
                        ? tempProfAvatar
                        : 'https://i.pinimg.com/originals/d8/81/d3/d881d3e05c90688581cdeaae1be7edae.jpg',
                    }
              }
              style={styles.profilePicture}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.fullNameRow}>
          <Controller
            control={control}
            rules={{}}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.fullName}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Full name"
                style={styles.yourAgeTextInput}
                autoCapitalize="none"
                errorMessage={
                  errors.full_name && <Text>{errors.full_name.message}</Text>
                }
              />
            )}
            name="full_name"
          />
        </View>
        <View style={styles.fullNameBorder}></View>
        <Controller
          control={control}
          rules={{}}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.bioText}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="bio"
              autoCapitalize="none"
              errorMessage={errors.bio && <Text>{errors.bio.message}</Text>}
            />
          )}
          name="bio"
        />
        <View style={styles.bioBorder}></View>
        <View style={styles.locationIconRow}>
          <View style={styles.locationIcon}>
            <FontAwesomeIcon icon="fa-solid fa-location-dot" size={32} color={'#B0B0B0'}/>
          </View>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <View>
                <SelectList
                  setSelected={handleSelect}
                  data={cityNames}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  search={false}
                  placeholder="Location"
                  boxStyles={styles.locationBox}
                  dropdownStyles={styles.locationBoxDropDown}
                />
              </View>
            )}
            name="location"
          />
        </View>
        <View style={styles.locationBorder}></View>
        <View style={styles.ageIconRow}>
          <View style={styles.ageIcon}>
            <FontAwesomeIcon icon="fa-solid fa-clock" size={32} color={'#B0B0B0'}/>
          </View>
          <View style={styles.ageTextColumn}>
            <Text style={styles.ageText}>Age</Text>
              <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, onBlur, value}}) => (
                <View>
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Your age"
                    style={styles.userAge}
                    autoCapitalize="none"
                    errorMessage={errors.age && <Text>{errors.age.message}</Text>}
                  />
                </View>
              )}
              name="age"
              />
          </View>
        </View>
        <View style={styles.ageBorder}></View>

      </SafeAreaView>
      <Button title="Update profile" onPress={handleSubmit(saveData)}></Button>
      <Button title="Return" onPress={returnToProfile}></Button>
    </>
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
  locationBox: {
    width: 285,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
    borderStyle: 'solid',
  },
  locationBoxDropDown: {
    width: 285,
    height: 244,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
    borderStyle: 'solid',
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
  },
});

export default EditProfileForms;
