import {
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {mediaUrl} from '../utils/variables';
import {Image} from '@rneui/themed';
import {useRoute} from '@react-navigation/native';
import {useUser} from '../hooks/ApiHooks';
import {useContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../context/MainContext';

const SinglePost = () => {
  const route = useRoute();
  const {filename, description, user_id} = route.params;
  const [userFullName, setUserFullName] = useState('');
  const descriptionObject = JSON.parse(description);
  const {getUserById} = useUser();
  const {
    setUserIdForProfilePage,
    setShowAnotherUserProfile,
    showAnotherUserProfile,
  } = useContext(MainContext);
  // console.log('token here', descriptionObject.token);

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

export default SinglePost;
