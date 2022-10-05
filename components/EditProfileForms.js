import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Button,
  TextInput,
  ImagePickerIOS,
} from 'react-native';
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
      uri: pixelUri,
      name: 'single_pixel.jpeg',
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
            tag: 'buddyprofile_pic' + user.user_id,
          };
          const picTag = await postTag(token, profilePicTag);
        }
        if (profileBack != null) {
          const delBack = await deleteMediaById(token, profileBId);
          const backgroundUpdate = await postMedia(token, profileBack);
          setProfileBId(backgroundUpdate.file_id);
          const profileBackTag = {
            file_id: backgroundUpdate.file_id,
            tag: 'buddyprofile_background' + user.user_id,
          };
          const BTag = await postTag(token, profileBackTag);
        }
        const delData = await deleteMediaById(token, profileDId);
        const profileDataUpdate = await postMedia(token, profileData);
        setProfileDId(profileDataUpdate.file_id);
        const profileDataTag = {
          file_id: profileDataUpdate.file_id,
          tag: 'buddyprofile_Data' + user.user_id,
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
        <TouchableOpacity onPress={selectBackgroundImage}>
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
            style={{width: 200, height: 200}}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={selectProfilePicture}>
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
            style={{
              width: 100,
              height: 100,
              borderRadius: 400 / 2,
            }}
          />
        </TouchableOpacity>

        <Controller
          control={control}
          rules={{}}
          render={({field: {onChange, onBlur, value}}) => (
            <View>
              <TextInput
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
            </View>
          )}
          name="full_name"
        />
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
                style={styles.yourAgeTextInput}
                autoCapitalize="none"
                errorMessage={errors.age && <Text>{errors.age.message}</Text>}
              />
            </View>
          )}
          name="age"
        />
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={styles.locationBox}>
              <SelectList
                setSelected={handleSelect}
                data={cityNames}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                search={false}
                placeholder="Location"
              />
            </View>
          )}
          name="location"
        />
        <Controller
          control={control}
          rules={{}}
          render={({field: {onChange, onBlur, value}}) => (
            <View>
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="bio"
                style={styles.yourAgeTextInput}
                autoCapitalize="none"
                errorMessage={errors.bio && <Text>{errors.bio.message}</Text>}
              />
            </View>
          )}
          name="bio"
        />
      </SafeAreaView>
      <Button title="Update profile" onPress={handleSubmit(saveData)}></Button>
      <Button title="Retrun" onPress={returnToProfile}></Button>
    </>
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

export default EditProfileForms;
