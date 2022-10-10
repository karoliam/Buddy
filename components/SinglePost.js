import {
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {applicationTag, mediaUrl} from '../utils/variables';
import {Button, Image} from '@rneui/themed';
import {useRoute} from '@react-navigation/native';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../context/MainContext';
import PropTypes from 'prop-types';

const SinglePost = ({navigation, route}) => {
  // const route = useRoute();
  const {filename, title, description, user_id, file_id} = route.params;
  const [userFullName, setUserFullName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const descriptionObject = JSON.parse(description);
  const {getUserById} = useUser();
  const {postTag} = useTag();
  const {postMedia} = useMedia();
  const {user, showEditPost, setShowEditPost, update, setUpdate} = useContext(MainContext);

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
  }

  const createChatFile = async () => {
    const formData = new FormData();
    const token = await AsyncStorage.getItem('userToken');
    formData.append('file', {
      uri: 'https://placekitten.com/100',
      name: 'placekitten',
      type: 'image/jpeg',
    });
    const currentIdString = user.user_id.toString();
    const otherIdString = user_id.toString();
    const idConcat = currentIdString.concat(otherIdString);
    console.log('id concat', idConcat);

    formData.append('title', 'chatFile');
    formData.append('description', idConcat);
        try {
      const chatMediaResponse = await postMedia(token, formData);
      const appTag = {file_id: chatMediaResponse.file_id, tag: applicationTag};
      const appTagResponse = await postTag(token, appTag);
      const chatTag = {file_id: chatMediaResponse.file_id, tag: idConcat};
      const chatTagResponse = await postTag(token, chatTag);
      console.log('chat media response', chatMediaResponse);
      navigation.navigate('ChatView', idConcat);
    } catch (error) {
      console.log('creating chat file error', error);
    }
  }


  useEffect(() => {
    showEditPostFunction()
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
      <Button title='Chat' onPress={() => createChatFile()}></Button>
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
