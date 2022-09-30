import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {MainContext} from '../context/MainContext';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {applicationTag} from '../utils/variables';
import PropTypes from 'prop-types';
import SelectList from 'react-native-dropdown-select-list';

const CreatePostForm = ({navigation}) => {
  // const navigation = useNavigation();
  const [mediafile, setMediafile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState('');
  const {postMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const {postTag} = useTag();
  const data = [
    {key: '0', value: 'Espoo'},
    {key: '1', value: 'Helsinki'},
    {key: '2', value: 'Vantaa'},
  ];

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
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();

    const formObject = {
      location: city,
      when: data.when,
      writePost: data.writePost,
    };

    const formJSON = JSON.stringify(formObject);
    formData.append('description', formJSON);
    console.log('here is data', data);

    const filename = mediafile.split('/').pop();
    let extension = filename.split('.').pop();
    extension = extension === 'jpg' ? 'jpeg' : extension;
    console.log('filename', extension);
    formData.append('file', {
      uri: mediafile,
      name: filename,
      type: mediaType + '/' + extension,
    });
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const mediaResponse = await postMedia(token, formData);
      console.log('result', mediaResponse);
      const tag = {file_id: mediaResponse.file_id, tag: applicationTag};
      const tagResponse = await postTag(token, tag);
      console.log(tagResponse);
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
  };

  const handleSelect = (e) => {
    console.log(data[e].value);
    setCity(data[e].value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Create post</Text>
      <Image
        source={{uri: mediafile || 'https://placekitten.com/300'}}
        style={{width: 200, height: 200}}
      ></Image>
      <Button title="Choose a picture" onPress={pickImage}></Button>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <SelectList
            setSelected={handleSelect}
            data={data}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            search={false}
            placeholder="Location"
          />
        )}
        name="location"
      />
      <Controller
        control={control}
        rules={{
          minLength: 3,
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="When"
            required
          />
        )}
        name="when"
      />

      {errors.location?.type === 'required' && <Text>This is required.</Text>}
      {errors.location?.type === 'minLength' && <Text>Min 3 chars!</Text>}
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Write your post..."
          />
        )}
        name="writePost"
      />
      <Button
        title="Send"
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
      ></Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
});
CreatePostForm.propTypes = {
  navigation: PropTypes.object,
};

export default CreatePostForm;
