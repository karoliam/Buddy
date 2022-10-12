/**
 * Täällä otetaan profiilikuva, title on profile_pic jolla se etitään myöhemmin
 * myös postataan user data postaus jonka title on profile_data ja description sisältää jsonin (fullName, age, location, bio)
 */
// TODO data testing (age should be a !NaN etc.)
import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Image} from '@rneui/base';
import {Controller, useForm} from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, userMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {single_pixel} from '../images';
let {width} = Dimensions.get('window');
import SelectList from 'react-native-dropdown-select-list';
import cityNames from '../utils/cityNames';
import {applicationTag, kissalinkki} from '../utils/variables';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const RegisterUserDataForm = () => {
  const {
    setShowRegisterUserDataForm,
    fullName,
    image,
    setImage,
    setIsLoggedIn,
    user,
    city,
    setCity,
    profileDId,
    setUpdateProfile,
    updateProfile,
    updateChatProfiles,
    setUpdateChatProfiles,
  } = useContext(MainContext);
  const {postMedia} = useMedia();
  const {deleteMediaById} = userMedia();
  const {postTag} = useTag();
  const [mediatype, setMediatype] = useState(null);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      age: '',
      location: '',
      bio: '',
    },
  });
  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result);
      setMediatype(result.type);
    }
  };

  const registerUserData = async (data) => {
    const profilePic = new FormData();
    if (image) {
      profilePic.append('title', 'profile_pic');
      const filename = image.uri.split('/').pop();
      let extension = filename.split('.').pop();
      extension = extension === 'jpg' ? 'jpeg' : extension;
      profilePic.append('file', {
        uri: image.uri,
        name: filename,
        type: mediatype + '/' + extension,
      });
    }

    //user data upload media
    const profileData = new FormData();
    profileData.append('title', 'profile_data');
    profileData.append('file', {
      uri: kissalinkki,
      name: 'single_pixel.jpeg',
      type: 'image/jpeg',
    });
    const profileDataDescription = {
      full_name: fullName,
      age: data.age,
      location: city,
      bio: data.bio,
    };
    profileData.append('description', JSON.stringify(profileDataDescription));
    console.log('profile data', profileData);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (image) {
        const pPic = await postMedia(token, profilePic);
        const profilePicTag = {
          file_id: pPic.file_id,
          tag: applicationTag + 'profile_pic' + user.user_id,
        };
        const pocTag = await postTag(token, profilePicTag);
        console.log(pocTag);
      }
      const delData = await deleteMediaById(token, profileDId);
      console.log(delData);
      const pData = await postMedia(token, profileData);
      console.log(pData);
      const profileDataTag = {
        file_id: pData.file_id,
        tag: applicationTag + 'profile_data' + user.user_id,
      };
      const dataTag = await postTag(token, profileDataTag);
      console.log(dataTag);
      setUpdateChatProfiles(updateChatProfiles);
      setCity('');
      setUpdateProfile(!updateProfile);
      setIsLoggedIn(true);
      setShowRegisterUserDataForm(false);
      // navigation.navigate('Tabs');  // TODO navi to loginstate
      setImage(null);
    } catch (error) {
      console.log('RegisterUserDAtaForm upload-onsubmit', error);
    }
  };
  const handleSelect = (e) => {
    console.log(cityNames[e].value);
    setCity(cityNames[e].value);
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.makeMoreInterestingText}>
        Make your profile more interesting
      </Text>
      <View style={styles.addPictureButtonStack}>
        <TouchableOpacity style={styles.addPictureButton} onPress={selectImage}>
          <Image
            source={
              image ? {uri: image.uri} : require('../assets/adaptive-icon.png')
            }
            style={styles.addPicturePreview}
          ></Image>
          <View style={styles.addPictureIcon}>
            <FontAwesomeIcon
              icon="fa-solid fa-camera"
              size={32}
              color={'#5E5E5E'}
            />
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.addProfilePicText}>Add a profile picture</Text>
      <Controller
        control={control}
        rules={{}}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.yourAgeBox}>
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
            inputStyles={styles.locationBoxTextInput}
            dropdownTextStyles={styles.locationBoxTextInput}
          />
        )}
        name="location"
      />
      <Controller
        control={control}
        rules={{}}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.bioBox}>
            <TextInput
              onBlur={onBlur}
              multiline={true}
              onChangeText={onChange}
              value={value}
              placeholder="A bit about yourself..."
              style={styles.bioText}
              autoCapitalize="none"
              errorMessage={errors.bio && <Text>{errors.bio.message}</Text>}
            />
          </View>
        )}
        name="bio"
      />
      <View style={styles.doLaterButtonStackRow}>
        <View style={styles.doLaterButtonStack}>
          <TouchableOpacity
            style={styles.doLaterButton}
            onPress={handleSubmit(registerUserData)}
          >
            <Text style={styles.doLaterText}>or do this later...</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.goButtonStack}>
          <TouchableOpacity
            style={styles.goButton}
            onPress={handleSubmit(registerUserData)}
          >
            <Text style={styles.goText}>Go</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  makeMoreInterestingText: {
    color: 'rgba(0,0,0,1)',
    backgroundColor: 'rgba(0,255,0,0)',
    lineHeight: 20,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 88,
  },
  addPictureButton: {
    width: 100,
    height: 100,
    backgroundColor: '#E6E6E6',
    borderRadius: 100,
    marginTop: 14,
    marginLeft: width / 2 - 50,
  },
  addPicturePreview: {
    width: 100,
    height: 100,
    borderRadius: 400 / 2,
  },
  addPictureIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(247,3,3,0)',
    marginTop: -25,
    marginLeft: 80,
  },
  addPictureButtonStack: {
    alignContent: 'center',
    height: 120,
    backgroundColor: 'rgba(247,3,3,0)',
  },
  addProfilePicText: {
    color: 'rgba(0,0,0,1)',
    backgroundColor: 'rgba(247,3,3,0)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
  },
  yourAgeBox: {
    width: width - 128,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 14,
    marginLeft: 64,
  },
  yourAgeTextInput: {
    flex: 1,
    textAlignVertical: 'center',
    color: '#121212',
    backgroundColor: 'rgba(255,0,0,0)',
    fontSize: 16,
    marginLeft: 12,
    marginRight: 12,
  },
  locationBox: {
    width: width - 128,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 16,
    marginLeft: 64,
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
    marginLeft: 64,
  },
  locationBoxTextInput: {
    flex: 1,
    marginLeft: -8,
    textAlign: 'left',
    textAlignVertical: 'center',
    color: '#121212',
    backgroundColor: 'rgba(255,0,0,0)',
    fontSize: 16,
    marginRight: 12,
  },
  bioBox: {
    width: width - 128,
    height: 183,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 16,
    marginLeft: 64,
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
    marginRight: 12,
  },
  doLaterButton: {
    width: width - 238,
    height: 36,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
  },
  doLaterText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(83,134,234,1)',
    backgroundColor: 'rgba(255,0,0,0)',
    fontSize: 16,
    marginLeft: 12,
    marginRight: 12,
  },
  doLaterButtonStack: {
    width: width - 238,
    height: 40,
  },
  goButton: {
    width: width - 311,
    height: 36,
    backgroundColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
  },
  goText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(0,0,0,1)',
    backgroundColor: 'rgba(255,0,0,0)',
    fontSize: 16,
    marginLeft: 12,
    marginRight: 12,
  },
  goButtonStack: {
    width: width - 311,
    height: 40,
    marginLeft: 10,
  },
  doLaterButtonStackRow: {
    width: width - 128,
    backgroundColor: 'rgba(255,0,0,0)',
    height: 36,
    flexDirection: 'row',
    marginTop: 16,
    marginLeft: 64,
  },
});

export default RegisterUserDataForm;
