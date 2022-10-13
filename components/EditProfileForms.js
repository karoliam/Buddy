import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Button,
  TextInput,
  ImagePickerIOS,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import {MainContext} from '../context/MainContext';
import {Image, Input} from '@rneui/themed';
import {useMedia, userMedia, useTag, useUser} from '../hooks/ApiHooks';
import {TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Controller, useForm} from 'react-hook-form';
import {single_pixel} from '../images';
import SelectList from 'react-native-dropdown-select-list';
import cityNames from '../utils/cityNames';
import { applicationTag, kissalinkki } from "../utils/variables";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
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
    isLoggedIn,
    setIsLoggedIn,
    setFullName,
    setUpdate,
    update,
    setProfileData,
  } = useContext(MainContext);
  const [tempProfBack, setTempProfBack] = useState(null);
  const [tempProfAvatar, setTempProfAvatar] = useState(null);
  const [avatarMediatype, setAvatarMediatype] = useState(null);
  const [backgroundMediatype, setBackgroundMediatype] = useState(null);
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const {deleteMediaById, userProfilePostData} = userMedia();
  const {deleteUserByPut} = useUser();

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
      uri: kissalinkki,
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
        const delData = await deleteMediaById(token, profileDId);
        const profileDataUpdate = await postMedia(token, profileData);
        setProfileDId(profileDataUpdate.file_id);
        const profileDataTag = {
          file_id: profileDataUpdate.file_id,
          tag: applicationTag + 'profile_Data' + user.user_id,
        };
        const DTag = await postTag(token, profileDataTag);
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
      } catch (error) {
        console.log('EditProfileForms.js upDateData', error);
      }
    }
    setShowEditProfile(false);
  };


  const deleteProfile = () => {
    Alert.alert(
      'Caution!!',
      'You are currently deleting your account, are you shure you want to do that?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Delete', onPress: () => confirmedDelete()},
      ]
    );
  };

  const confirmedDelete = async () => {
    const token = await AsyncStorage.getItem('userToken');
    deleteUserMedia(token);
    const newUser = {
      username: user.username.slice(6),
    };
    try {
      const userUpdates = await deleteUserByPut(token, newUser);
      if (userUpdates) {
        await AsyncStorage.clear();
        setFullName('');
        setShowEditProfile(false);
        setProfileData({});
        setAvatar(null);
        setUser({});
        setProfileBackgorund(null);
        setIsLoggedIn(false);
        setUpdate(!update);
      }
    } catch (error) {
      console.log('EditProfileForms confirmDelete ', error.message);
    }
  };
  const deleteUserMedia = async (token) => {
    try {
      const r = await userProfilePostData(user.user_id);
      r.forEach(async (file) => {
        const deletedMedia = await deleteMedia(token, file.file_id);
        console.log(deletedMedia);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = (e) => {
    console.log(cityNames[e].value);
    setCity(cityNames[e].value);
  };

  return (
    <>
      <KeyboardAwareScrollView style={styles.container}>
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
                      : '../assets/images/buddyplaceholder.png',
                  }
              }
              style={styles.backgroundImage}
            ></Image>
            <View style={styles.backGroundIconHolder}>
              <FontAwesomeIcon icon="fa-solid fa-camera" size={32} color={'#A5ABE8'}/>
            </View>
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
                      : '../assets/images/buddyplaceholder.png',
                  }
              }
              style={styles.profilePicture}
            />
            <View style={styles.profilePictureIconHolder}>
              <FontAwesomeIcon icon="fa-solid fa-camera" size={32}  color={'#A5ABE8'}/>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.editProfileText}>Edit profile</Text>
        <Text style={styles.fullNameHeader}>Full Name</Text>
        <View style={styles.fieldBoxFullName}>
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
                autoCapitalize="none"
                errorMessage={
                  errors.full_name && <Text>{errors.full_name.message}</Text>
                }
              />
            )}
            name="full_name"
          />
        </View>
        <Text style={styles.bioHeader}>About You</Text>
        <View style={styles.fieldBoxBio}>
          <Controller
            control={control}
            rules={{}}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.bioText}
                onBlur={onBlur}
                multiline={true}
                onChangeText={onChange}
                value={value}
                placeholder="bio"
                autoCapitalize="none"
                errorMessage={errors.bio && <Text>{errors.bio.message}</Text>}
              />
            )}
            name="bio"
          />
        </View>
        <Text style={styles.locationHeader}>Location</Text>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
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
              inputStyles={styles.locationText}
              dropdownTextStyles={styles.locationText}
            />
          )}
          name="location"
        />
        <Text style={styles.ageHeader}>Your Age</Text>
        <View style={styles.fieldBoxAge}>
          <Controller
            control={control}
            rules={{}}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Your age"
                style={styles.ageText}
                autoCapitalize="none"
                errorMessage={errors.age && <Text>{errors.age.message}</Text>}
              />
            )}
            name="age"
          />
        </View>
        <View style={styles.updateButtonStackRow}>
        <View style={styles.returnButtonStack}>
            <TouchableOpacity
              style={styles.returnButton}
              onPress={returnToProfile}
            >
              <Text style={styles.returnText}>Return</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.updateButtonStack}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleSubmit(saveData)}
            >
              <Text style={styles.updateText}>Update Profile</Text>
            </TouchableOpacity>
          </View>

        </View>
          <View style={styles.deleteButton}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={deleteProfile}
            >
              <Text style={styles.deleteText}>Delete profile</Text>
            </TouchableOpacity>
          </View>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)'
  },
  backgroundImage: {
    backgroundColor: 'rgba(0,255,0,0)',
    top: 0,
    left: 0,
    width: width,
    height: 226,
  },
  backGroundIconHolder: {
    alignItems: 'center',
    position: "absolute",
    alignContent: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    padding: 8,
    height: 50,
    width: 50,
    borderRadius: 100,
    bottom: 6,
    right: 16
  },
  profilePictureHolder: {
    backgroundColor: 'rgba(0,255,0,0)',
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
  profilePictureIconHolder: {
    left: 80,
    top: -16
  },
  backgroundImageStack: {
    backgroundColor: 'rgba(0,255,0,0)',
    width: width,
    height: 0.31 * height
  },
  editProfileText: {
    flex: 1,
    textAlign: 'left',
    textAlignVertical: 'center',
    color: '#121212',
    backgroundColor: 'rgba(0,255,0,0)',
    fontSize: 26,
    marginTop: 16,
    marginLeft: 64
  },
  fullNameHeader: {
    flex: 1,
    textAlign: 'left',
    textAlignVertical: 'center',
    color: '#9B9797',
    backgroundColor: 'rgba(0,255,0,0)',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 72
  },
  fieldBoxFullName: {
    width: width - 128,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 2,
    marginLeft: 64
  },
  fullName: {
    flex: 1,
    textAlignVertical: 'center',
    color: '#121212',
    backgroundColor: 'rgba(0,255,0,0)',
    fontSize: 20,
    marginLeft: 12,
    marginRight: 12
  },
  bioHeader: {
    flex: 1,
    textAlign: 'left',
    textAlignVertical: 'center',
    color: '#9B9797',
    backgroundColor: 'rgba(0,255,0,0)',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 72
  },
  fieldBoxBio: {
    width: width - 128,
    height: 183,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 2,
    marginLeft: 64
  },
  bioText: {
    flex: 1,
    textAlignVertical: 'top',
    color: '#121212',
    backgroundColor: 'rgba(255,0,0,0)',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 12,
    marginRight: 12
  },
  locationHeader: {
    flex: 1,
    textAlign: 'left',
    textAlignVertical: 'center',
    color: '#9B9797',
    backgroundColor: 'rgba(0,255,0,0)',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 72
  },
  locationBox: {
    width: width - 128,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 2,
    marginLeft: 64,
    alignItems: 'center'
  },
  locationBoxDropDown: {
    width: width - 128,
    height: 244,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 16,
    marginLeft: 64
  },
  locationText: {
    flex: 1,
    marginLeft: -8,
    textAlign: 'left',
    textAlignVertical: 'center',
    color: '#121212',
    backgroundColor: 'rgba(255,0,0,0)',
    fontSize: 16,
    marginRight: 12
  },
  ageHeader: {
    flex: 1,
    textAlign: 'left',
    textAlignVertical: 'center',
    color: '#9B9797',
    backgroundColor: 'rgba(0,255,0,0)',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 72
  },
  fieldBoxAge: {
    width: width - 128,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 2,
    marginLeft: 64
  },
  ageText: {
    flex: 1,
    textAlignVertical: 'center',
    color: '#121212',
    backgroundColor: 'rgba(0,255,0,0)',
    fontSize: 16,
    marginLeft: 12,
    marginRight: 12
  },
  updateButton: {
    width: width - 238,
    height: 36,
    // backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 10,
    backgroundColor: 'rgba(165,171,232,0.5)',
    marginLeft: 20
  },
  updateText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'rgba(255,0,0,0)',
    fontSize: 16,
    marginLeft: 12,
    marginRight: 12,
    marginTop: 6
  },
  updateButtonStack: {
    width: width - 238,
    height: 40,

  },
  returnButton: {
    width: width - 311,
    height: 36,
    backgroundColor: 'rgba(246,203,100,1)',
    borderRadius: 10,
  },
  returnText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(0,0,0,1)',
    backgroundColor: 'rgba(255,0,0,0)',
    fontSize: 16,
    marginLeft: 12,
    marginRight: 12,
    marginTop: 6
  },
  returnButtonStack: {
    width: width - 311,
    height: 40,
    marginLeft: 10,
  },
  updateButtonStackRow: {
    width: width - 128,
    backgroundColor: 'rgba(255,0,0,0)',
    height: 36,
    flexDirection: 'row',
    marginTop: 16,
    marginLeft: 64,
    marginBottom: 32
  },
  deleteButton: {
    backgroundColor: '#f66464ff',
    height: 40,
    alignItems: 'center',
    marginLeft: 64,
    marginRight: 64,
    borderRadius: 10,
    marginBottom: 50
  },
  deleteText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: 'white'
  }
});

export default EditProfileForms;
