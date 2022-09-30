import React, {useContext, useState} from 'react';
import {View, Text, Button, ScrollView, TouchableOpacity} from 'react-native';

import {Card, Image} from '@rneui/base';
import {Controller, useForm} from 'react-hook-form';
import {Input} from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterUserDataForm = () => {
  const {fullName, image, setImage} = useContext(MainContext);
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
    console.log('lol');

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 4],
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result);
      setMediatype(result.type);
    }
  };

  const onSubmit = async (data) => {
    //profile pic upload media
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

    const profileData = new FormData();
    profileData.append('title', 'profile_data');
    profileData.append('file', {
      uri: require('../images/single_pixel.jpeg'),
      name: 'single_pixel.jpeg',
      type: 'image/jpeg',
    });
    const profileDataDescription = {
      age: data.age,
      location: data.location,
      bio: data.bio,
    };
    profileData.append('description', JSON.stringify(profileDataDescription));

    try {
      //this is for testing
      //TODO delete next line
      await AsyncStorage.setItem(
        'userToken',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMzAwLCJ1c2VybmFtZSI6ImJ1ZGR5I2VtYWlsQGVtYWlsLmNvbSIsImVtYWlsIjoiZW1haWxAZW1haWwuY29tIiwiZnVsbF9uYW1lIjpudWxsLCJpc19hZG1pbiI6bnVsbCwidGltZV9jcmVhdGVkIjoiMjAyMi0wOS0yOFQxMzo1NzozNy4wMDBaIiwiaWF0IjoxNjY0Mzk4NzY2LCJleHAiOjE2NjQ0ODUxNjZ9.FDHOb8HA65MKq5qxEz-wNxyVY6gTDOgUKg1L_qi6b2E'
      );
      const token = await AsyncStorage.getItem('userToken');
      //const pPic = await postMedia(profilePic, token);
      const pData = await postMedia(profileData, token);
    } catch (error) {
      console.log('upload-onsubmit', error);
    }
  };

  return (
    <ScrollView style={{marginTop: 100}}>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity onPress={selectImage}>
          <Image
            source={
              image ? {uri: image.uri} : require('../assets/adaptive-icon.png')
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
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="age"
              autoCapitalize="none"
              errorMessage={errors.age && <Text>{errors.age.message}</Text>}
            />
          )}
          name="age"
        />
        <Controller
          control={control}
          rules={{}}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="location"
              autoCapitalize="none"
              errorMessage={
                errors.location && <Text>{errors.location.message}</Text>
              }
            />
          )}
          name="location"
        />
        <Controller
          control={control}
          rules={{}}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
          }}
        >
          <Button title="do later" onPress={selectImage}></Button>
          <Button title="go" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterUserDataForm;