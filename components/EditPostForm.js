import {Input, Button} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {
  ActivityIndicator,
  Alert,
  Text,
  Dimensions, Image,
  StyleSheet,
  TouchableOpacity,
  View, TextInput, ScrollView
} from "react-native";
import PropTypes from 'prop-types';
import {MainContext} from '../context/MainContext';
import {mediaUrl} from '../utils/variables';
import SelectList from 'react-native-dropdown-select-list';
import cityNames from '../utils/cityNames';
import * as ImagePicker from 'expo-image-picker';
let {width, height} = Dimensions.get('window');

const EditPostForm = ({navigation, route}) => {
  const {filename, title, description, user_id, file_id} = route.params;
  const paramsObject = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const {putMedia, deleteMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const [city, setCity] = useState('');
  const cityData = cityNames;
  const paramsObjectDescription = JSON.parse(paramsObject.description);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      location: paramsObjectDescription.location,
      when: paramsObjectDescription.when,
      writePost: paramsObjectDescription.writePost,
      title: 'feedPost',
    },
  });

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

  const updatePost = async (data) => {
    setIsLoading(true);
    delete data.title;
    const stringData = JSON.stringify(data);
    const descriptionString = "description";
    const doubleStringData = JSON.stringify(stringData);
    const finalData = ('{"' + descriptionString + '"' + ':' + doubleStringData + '}');
    console.log('tuosa', finalData);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await putMedia(token, finalData, paramsObject.file_id);
      console.log('response', response);
      Alert.alert(response.message, '', [
        {
          text: 'Ok',
          onPress: () => {
            setUpdate(!update);
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error('onSubmit modify file failed', error);
      Alert.alert('Editing failed', 'Try again', [
        {
          text: 'Ok'
        }
      ])    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (e) => {
    console.log(cityData[e].value);
    setCity(cityData[e].value);
  };

  const deletePost = () => {
    const deleting = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        await deleteMedia(token, paramsObject.file_id);
      } catch (error) {
        console.log('deleting error', error);
      }
    }
    Alert.alert('Are you sure?', 'Do you want to delete your post?', [
      {
        text: 'Yes, delete',
        onPress: () => {
          deleting();
          Alert.alert('Deleted successfully!', '', [
            {
              text: 'Ok',
              onPress:() => {
                setUpdate(!update);
              }
            }
          ]);
          navigation.navigate('Home');
        },
      },
      { text: "Cancel", onPress: () => console.log('cancel pressed') }
    ]);
  }


  useEffect(() => {

  }, [update]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.editPostText}>Edit Post</Text>
        <TouchableOpacity style={styles.addPictureButton} onPress={pickImage}>
          <Image
            source={{uri: mediaUrl + filename}}
            PlaceholderContent={<ActivityIndicator />}
            style={styles.addPictureImage}
          ></Image>
        </TouchableOpacity>
        <View style={styles.postTextBox}>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.postTextInput}
                multiline={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                // placeholder={paramsObjectDescription.writePost}
              />
            )}
            name="writePost"
          />
        </View>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <SelectList
              setSelected={handleSelect}
              data={cityData}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              search={false}
              boxStyles={styles.locationBox}
              dropdownStyles={styles.locationBoxDropDown}
              inputStyles={styles.locationText}
              dropdownTextStyles={styles.locationText}
              placeholder={paramsObjectDescription.location}
            />
          )}
          name="location"
        />
        <View style={styles.whenBox}>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.whenBoxTextInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                // placeholder={paramsObjectDescription.when}
              />
            )}
            name="when"
          />
        </View>
        <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.publishButton}
          loading={isLoading}
          onPress={handleSubmit(updatePost)}
        >
          <Text style={styles.publishText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleSubmit(deletePost)}>
          <Text style={styles.publishText}>Delete</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  editPostText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#121212',
    backgroundColor: 'rgba(0,255,0,0)',
    fontSize: 26,
    marginTop: 16,
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
    alignItems: 'baseline'

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
    borderRadius: 14,
    marginTop: 32,
    justifyContent: 'center',
    height: 61,
    backgroundColor: 'rgba(246,203,100,1)',
    borderRadius: 14,
    marginTop: 32,
    marginLeft: 32,
    width: width - 62
  },
  publishText: {
    color: 'rgba(255,255,255,1)',
    backgroundColor: 'rgba(255,0,0,0)',
    height: 30,
    width: width - 64,
    lineHeight: 16,
    fontSize: 24,
    alignSelf: 'center',
    paddingTop: 8,
    textAlign: 'center'
  },
  deleteButton: {
    justifyContent: 'center',
    height: 61,
    backgroundColor: '#f66464ff',
    borderRadius: 14,
    marginTop: 16,
    marginLeft: 32,
    width: width - 62,
  },
  buttonsContainer: {
  }
});

EditPostForm.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default EditPostForm;
