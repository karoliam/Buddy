import {
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {mediaUrl} from '../utils/variables';
import {Button, Image} from '@rneui/themed';
import {useRoute} from '@react-navigation/native';
import {useUser} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../context/MainContext';
import PropTypes from 'prop-types';

const SinglePost = ({navigation}) => {
  const route = useRoute();
  const {filename, title, description, user_id, file_id} = route.params;
  const [userFullName, setUserFullName] = useState('');
  const descriptionObject = JSON.parse(description);
  const {getUserById} = useUser();
  const {
    setUserIdForProfilePage,
    setShowAnotherUserProfile,
    showAnotherUserProfile,
  } = useContext(MainContext);
  const {user, showEditPost, setShowEditPost, update, setUpdate} =
    useContext(MainContext);

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

  useEffect(() => {
    showEditPostFunction();
  }, [update]);

  const checkUser = () => {
    setUserIdForProfilePage(user_id);
    setShowAnotherUserProfile(!showAnotherUserProfile);
  };
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
      <TouchableOpacity
        style={{margin: 20, backgroundColor: 'lightblue', padding: 20}}
        onPress={checkUser}
      >
        <Text>{userFullName}</Text>
      </TouchableOpacity>
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
