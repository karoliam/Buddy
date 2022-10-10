/**
 * Täällä tehdään ihmeitä ja käyttäjien postauksia
 */
// TODO Location dropdown bugaa ainakin androidilla

import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  StyleSheet,
  Text,
  Image,
  TextInput,
  Alert,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Touchable,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import {MainContext} from '../context/MainContext';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {applicationTag} from '../utils/variables';
import PropTypes from 'prop-types';
import SelectList from 'react-native-dropdown-select-list';
import cityNames from '../utils/cityNames';
let {width, height} = Dimensions.get('window');

const CreatePostForm = ({navigation}) => {
  const [mediafile, setMediafile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [showMoreTags, setShowMoreTags] = useState(false);
  const [city, setCity] = useState('');
  const {postMedia} = useMedia();
  const {user, update, setUpdate} = useContext(MainContext);
  const {postTag} = useTag();
  const data = cityNames;
  const [showMoreTags, setShowMoreTags] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      setMediafile(result.uri);
      setMediaType(result.type);
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      location: '',
      when: '',
      writePost: '',
      title: 'feedPost',
      tag_1: '',
      tag_2: '',
      tag_3: '',
    },
  });
  const openMoreTags = (data) => {
    setShowMoreTags(!showMoreTags);
    console.log('showmore tags', showMoreTags);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    const token = await AsyncStorage.getItem('userToken');
    console.log(data);
    const formObject = {
      location: city,
      when: data.when,
      writePost: data.writePost,
    };

    const formJSON = JSON.stringify(formObject);
    formData.append('description', formJSON);
    // console.log('here is data', data);
    if (mediafile == null) {
      formData.append('title', 'feedPostTxt');
      formData.append('file', {
        uri: 'https://placekitten.com/100',
        name: 'placekitten',
        type: 'image/jpeg',
      });
    } else {
      formData.append('title', 'feedPost');
      const filename = mediafile.split('/').pop();
      let extension = filename.split('.').pop();
      extension = extension === 'jpg' ? 'jpeg' : extension;
      // console.log('filename', extension);
      formData.append('file', {
        uri: mediafile,
        name: filename,
        type: mediaType + '/' + extension,
      });
    }
    setIsLoading(true);
    try {
      const mediaResponse = await postMedia(token, formData);
      console.log('result', mediaResponse);
      // apptag
      const tag = {file_id: mediaResponse.file_id, tag: applicationTag};
      const tagResponse = await postTag(token, tag);
      console.log('ollaa tääl', (data.tag_1.trim().length > 0));
      if (data.tag_1.trim().length > 0) {
        console.log('tag1 ', applicationTag + 'post_tag' + data.tag_1)
        const fTag1 = {file_id: mediaResponse.file_id, tag: applicationTag + 'post_tag' + data.tag_1};
        const fTagResponse1 = await postTag(token, fTag1);
        console.log('CreatePostForm: onSubmit tagResponse', fTagResponse1);
      }
      if (data.tag_2.trim().length > 0) {
        console.log('tag2 ', applicationTag + 'post_tag' + data.tag_2)
        const fTag2 = {file_id: mediaResponse.file_id, tag: applicationTag + 'post_tag' + data.tag_2};
        const fTagResponse2 = await postTag(token, fTag2);
        console.log('CreatePostForm: onSubmit tagResponse', fTagResponse2);
      }
      if (data.tag_3.trim().length > 0) {
        console.log('tag3 ', applicationTag + 'post_tag' + data.tag_3)
        const fTag3 = {file_id: mediaResponse.file_id, tag:  applicationTag + 'post_tag' + data.tag_3};
        const fTagResponse3 = await postTag(token, fTag3);
        console.log('CreatePostForm: onSubmit tagResponse', fTagResponse3);
      }
      Alert.alert(mediaResponse.message, '', [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            setUpdate(!update);
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error('onSubmit upload failed', error);
      Alert.alert('Upload failed. File too big or wrong filetype.', '', [
        {
          text: 'OK',
          onPress: () => {
            console.log(error);
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  const resetForm = () => {
    setMediafile(null);
    setMediaType(null);
    setValue('location', '');
    setValue('when', '');
    setValue('writePost', '');
    setValue('tag_1', '');
    setValue('tag_2', '');
    setValue('tag_3', '');
  };

  const handleSelect = (e) => {
    console.log(data[e].value);
    setCity(data[e].value);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addPictureButton} onPress={pickImage}>
        <Image
          source={{uri: mediafile || 'https://placekitten.com/300'}}
          style={styles.addPictureImage}
        ></Image>
      </TouchableOpacity>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.postTextBox}>
            <TextInput
              multiline={true}
              numberOfLines={7}
              style={styles.postTextInput}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Write your post..."
            />
          </View>
        )}
        name="writePost"
      />
      <Controller
        control={control}
        rules={{
          // minLength: 3,
          // required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.whenBox}>
            <TextInput
              style={styles.whenBoxTextInput}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Add your tag"
              required
            />
          </View>
        )}
        name="tag_1"
      />
      <TouchableOpacity
        style={{
          marginLeft: 54,
          marginTop: 8,
          backgroundColor: 'rgba(165,171,232,1)',
          width: 120,
          borderRadius: 8,
          height: 30,
          justifyContent: 'center'
        }}
        onPress={() => setShowMoreTags(!showMoreTags)}>
        <Text style={{alignSelf: 'center', }}>+ Add more tags</Text>
      </TouchableOpacity>
      {showMoreTags ? <><Controller
        control={control}
        rules={{
          // minLength: 3,
          // required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.whenBox}>
            <TextInput
              style={styles.whenBoxTextInput}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="tag 2"
              required
            />
          </View>
        )}
        name="tag_2"
      />
        <Controller
          control={control}
          rules={{
            // minLength: 3,
            // required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={styles.whenBox}>
              <TextInput
                style={styles.whenBoxTextInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="tag 3"
                required
              />
            </View>
          )}
          name="tag_3"
        /></> : <></>

      }
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          // <View style={styles.locationBox}>
            <SelectList
              setSelected={handleSelect}
              data={data}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              search={false}
              placeholder="Location"
              boxStyles={styles.locationBox}
              dropdownStyles={styles.locationBoxDropDown}
            />
          // </View>
        )}
        name="location"
      />
      <Controller
        control={control}
        rules={{
          // minLength: 3,
          // required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.whenBox}>
            <TextInput
              style={styles.whenBoxTextInput}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="When"
              required
            />
          </View>
        )}
        name="when"
      />
      {errors.location?.type === 'required' && <Text>This is required.</Text>}
      {errors.location?.type === 'minLength' && <Text>Min 3 chars!</Text>}
      <TouchableOpacity
        style={styles.publishButton}
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.publishText}>Publish</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addPictureButton: {
    width: width - 64,
    height: 0.75 * (width - 64),
    backgroundColor: '#E6E6E6',
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginTop: 32,
    marginLeft: 32,
  },
  addPictureImage: {
    width: width - 64,
    height: 0.75 * (width - 64),
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  postTextBox: {
    width: width - 64,
    height: 160,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginLeft: 32,
  },
  postTextInput: {
    paddingTop: 0,
    backgroundColor: 'rgba(255,0,0,0)',
    color: '#121212',
    width: width - 96,
    fontSize: 16,
    textAlignVertical: 'top',
    textAlign: 'left',
    marginTop: 12,
    marginLeft: 16,
  },
  locationBox: {
    width: width - 64,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 16,
    marginLeft: 32,
  },
  locationBoxDropDown: {
    width: width - 64,
    height: 244,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 16,
    marginLeft: 32,
  },
  locationTextInput: {
    color: '#121212',
    height: 30,
    width: 260,
    lineHeight: 14,
    fontSize: 16,
    marginTop: 15,
    marginLeft: 12,
  },
  whenBox: {
    width: width - 64,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 16,
    marginLeft: 32,
  },
  whenBoxTextInput: {
    color: '#121212',
    height: 30,
    width: 260,
    lineHeight: 14,
    fontSize: 16,
    marginTop: 15,
    marginLeft: 12,
  },
  publishButton: {
    width: width - 64,
    height: 61,
    backgroundColor: 'rgba(246,203,100,1)',
    borderRadius: 14,
    marginTop: 32,
    marginLeft: 32,
  },
  publishText: {
    color: 'rgba(255,255,255,1)',
    backgroundColor: 'rgba(255,0,0,0)',
    height: 30,
    width: width - 64,
    lineHeight: 16,
    fontSize: 24,
    textAlign: 'center',
    paddingTop: 8,
    marginTop: 19,
  },
});
CreatePostForm.propTypes = {
  navigation: PropTypes.object,
};

export default CreatePostForm;
