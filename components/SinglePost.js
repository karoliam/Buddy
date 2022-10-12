import {
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Button, Image} from '@rneui/themed';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../context/MainContext';
import PropTypes from 'prop-types';
import {appChatPostTitle, appChatTag, mediaUrl} from '../utils/variables';

const SinglePost = ({navigation, route}) => {
  const {filename, title, description, user_id, file_id} = route.params;
  const [userFullName, setUserFullName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const descriptionObject = JSON.parse(description);
  const {getUserById} = useUser();
  const {postTag} = useTag();
  const {postMedia} = useMedia();
  const {
    user,
    showEditPost,
    setShowEditPost,
    update,
    setUpdate,
    updateChatProfiles,
    setUpdateChatProfiles,
  } = useContext(MainContext);

  const paramsObject = {
    filename: filename,
    title: title,
    description: description,
    user_id: user_id,
    file_id: file_id,
  };
  console.log('params', paramsObject);
  const getFullName = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await getUserById(token, user_id);
      //console.log('userData', userData);
      const fullName = userData.full_name;
      const email = userData.email;
      setUserEmail(email);
      setUserFullName(fullName);
    } catch (error) {
      console.log('getFullName error', error);
    }
  };
  getFullName(descriptionObject.token);

  console.log('current user', user.user_id, 'post user', user_id);
  const showEditPostFunction = () => {
    if (user_id !== user.user_id) {
      setShowEditPost(false);
    } else {
      setShowEditPost(true);
    }
  };

  const createChatFile = async () => {
    const formData = new FormData();
    const token = await AsyncStorage.getItem('userToken');
    formData.append('file', {
      uri: 'https://placekitten.com/100',
      name: 'placekitten',
      type: 'image/jpeg',
    });
    /*
    en tiedä miksi näitä tarvittais kun description on optional
    const formObject = {
      location: 'default',
      when: 'default',
      writePost: 'default',
    };
    const formJSON = JSON.stringify(formObject);
    formData.append('description', formJSON);
    */
    console.log(user);
    const currentIdString = user.user_id.toString();
    const otherIdString = user_id.toString();
    const usersIdChatTitle = currentIdString + '#' + otherIdString;

    formData.append('title', usersIdChatTitle);

    try {
      const chatMediaResponse = await postMedia(token, formData);
      const appTag = {file_id: chatMediaResponse.file_id, tag: appChatTag};
      const appTagResponse = await postTag(token, appTag);
      console.log('mediaresponese chat', chatMediaResponse);
      setUpdateChatProfiles(!updateChatProfiles);
      const chatParamsObject = {
        usersIdChatTitle: usersIdChatTitle,
        chatMediaResponse: chatMediaResponse,
      };
      navigation.navigate('ChatView', chatParamsObject);
    } catch (error) {
      console.log('creating chat file error', error);
    }
  };

  useEffect(() => {
    showEditPostFunction();
  }, [update]);

  return (
    <ScrollView>
      <Image
        source={{uri: mediaUrl + filename}}
        PlaceholderContent={<ActivityIndicator />}
        style={{width: 300, height: 300}}
      />

      {showEditPost ? (
        <Button
          title="edit"
          onPress={() => {
            navigation.navigate('EditPost', paramsObject);
          }}
        />
      ) : (
        <Text></Text>
      )}
      <Button title="Chat" onPress={() => createChatFile()}></Button>
      <Text>{userFullName}</Text>
      <Text>{descriptionObject.when}</Text>
      <Text>{descriptionObject.location}</Text>
      <Text>{descriptionObject.writePost}</Text>
    </ScrollView>
  );
};

SinglePost.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default SinglePost;
