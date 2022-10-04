/**
 * Täällä otetaan profiilikuva, title on profile_pic jolla se etitään myöhemmin
 * myös postataan user data postaus jonka title on profile_data ja description sisältää jsonin (fullName, age, location, bio)
 */
// TODO find a neat SVG icon for the add user Profile picture button (the red square)
// TODO go button is broken
import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import {Image} from '@rneui/base';
import {Controller, useForm} from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {single_pixel} from '../images';
let {width} = Dimensions.get('window');

const RegisterUserDataForm = () => {
  const {setShowRegisterUserDataForm} = useContext(MainContext);
  const {fullName, image, setImage, setIsLoggedIn} = useContext(MainContext);
  const {postMedia} = useMedia();
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
  const skipUserData = async () => {
    const pixelUri = Image.resolveAssetSource(single_pixel).uri;
    const profileData = new FormData();
    profileData.append('title', 'profile_data');
    profileData.append('file', {
      uri: pixelUri,
      name: 'single_pixel.jpeg',
      type: 'image/jpeg',
    });
    const profileDataDescription = {
      full_name: fullName,
      age: '',
      location: '',
      bio: '',
    };
    profileData.append('description', JSON.stringify(profileDataDescription));

    try {
      const token = await AsyncStorage.getItem('userToken');

      const pData = await postMedia(token, profileData);
      if (pData) {
        setIsLoggedIn(true);
        setShowRegisterUserDataForm(false);
        // navigation.navigate('Tabs');  // TODO navi to loginstate
        setImage(null);
      }
    } catch (error) {
      console.log('RegisterUserDAtaForm upload-onsubmit', error);
    }

    // navigation.navigate('Tabs');  // TODO navi to loginstate
  };
  const registerUserData = async (data) => {
    const profilePic = new FormData();
    profilePic.append('title', 'profile_pic');
    const filename = image.uri.split('/').pop();
    let extension = filename.split('.').pop();
    extension = extension === 'jpg' ? 'jpeg' : extension;
    profilePic.append('file', {
      uri: image.uri,
      name: filename,
      type: mediatype + '/' + extension,
    });

    //user data upload media
    const pixelUri = Image.resolveAssetSource(single_pixel).uri;
    const profileData = new FormData();
    profileData.append('title', 'profile_data');
    profileData.append('file', {
      uri: pixelUri,
      name: 'single_pixel.jpeg',
      type: 'image/jpeg',
    });
    const profileDataDescription = {
      full_name: fullName,
      age: data.age,
      location: data.location,
      bio: data.bio,
    };
    profileData.append('description', JSON.stringify(profileDataDescription));

    try {
      const token = await AsyncStorage.getItem('userToken');

      const pPic = await postMedia(token, profilePic);
      const pData = await postMedia(token, profileData);
      if (pPic && pData) {
        setIsLoggedIn(true);
        setShowRegisterUserDataForm(false);
        // navigation.navigate('Tabs');  // TODO navi to loginstate
        setImage(null);
      }
    } catch (error) {
      console.log('RegisterUserDAtaForm upload-onsubmit', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.makeMoreInterestingText}>
        Make your profile more interesting
      </Text>
      <TouchableOpacity style={styles.addPictureButton} onPress={selectImage}>
        <Image
          source={
            image ? {uri: image.uri} : require('../assets/adaptive-icon.png')
          }
          style={styles.addPicturePreview}
        >
          <View style={styles.addPictureIcon}></View>
        </Image>
      </TouchableOpacity>
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
        rules={{}}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.locationBox}>
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Location"
              style={styles.locationBoxTextInput}
              autoCapitalize="none"
              errorMessage={
                errors.location && <Text>{errors.location.message}</Text>
              }
            />
          </View>
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
          <TouchableOpacity style={styles.doLaterButton} onPress={skipUserData}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  makeMoreInterestingText: {
    color: 'rgba(0,0,0,1)',
    height: 31,
    width: 285,
    lineHeight: 20,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 88,
    marginLeft: width / 2 - 142.5,
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
    width: 31,
    height: 31,
    backgroundColor: 'rgba(247,3,3,1)',
    marginTop: 69,
    marginLeft: 69,
  },
  addProfilePicText: {
    color: 'rgba(0,0,0,1)',
    height: 21,
    width: 260,
    lineHeight: 20,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 14,
    marginLeft: width / 2 - 130,
  },
  yourAgeBox: {
    width: 285,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 14,
    marginLeft: width / 2 - 142.5,
  },
  yourAgeTextInput: {
    color: '#121212',
    height: 21,
    width: 260,
    fontSize: 16,
    lineHeight: 16,
    marginTop: 19,
    marginLeft: 12,
  },
  locationBox: {
    width: 285,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 16,
    marginLeft: width / 2 - 142.5,
  },
  locationBoxTextInput: {
    color: '#121212',
    height: 21,
    width: 260,
    lineHeight: 14,
    fontSize: 16,
    marginTop: 20,
    marginLeft: 13,
  },
  bioBox: {
    width: 285,
    height: 183,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 16,
    marginLeft: width / 2 - 142.5,
  },
  bioText: {
    color: '#121212',
    height: 21,
    width: 260,
    lineHeight: 16,
    fontSize: 16,
    marginTop: 20,
    marginLeft: 13,
  },
  doLaterButton: {
    top: 0,
    left: 0,
    width: 175,
    height: 36,
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
    borderStyle: 'solid',
  },
  doLaterText: {
    top: 6,
    left: 14,
    position: 'absolute',
    color: 'rgba(83,134,234,1)',
    height: 30,
    width: 147,
    fontSize: 16,
    textAlign: 'center',
  },
  doLaterButtonStack: {
    width: 175,
    height: 40,
  },
  goButton: {
    top: 0,
    left: 0,
    width: 103,
    height: 36,
    position: 'absolute',
    backgroundColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
  },
  goText: {
    top: 8,
    left: 11,
    position: 'absolute',
    color: 'rgba(0,0,0,1)',
    height: 30,
    width: 82,
    fontSize: 16,
    textAlign: 'center',
  },
  goButtonStack: {
    width: 103,
    height: 40,
    marginLeft: 7,
  },
  doLaterButtonStackRow: {
    height: 40,
    flexDirection: 'row',
    marginTop: 16,
    marginLeft: width / 2 - 142.5,
    marginRight: 44,
  },
});

export default RegisterUserDataForm;
