import {Text, ScrollView, ActivityIndicator} from 'react-native';
import {mediaUrl} from '../utils/variables';
import {Image} from '@rneui/themed';
import {useRoute} from '@react-navigation/native';
import {useUser} from '../hooks/ApiHooks';
import {useState} from 'react';

const SinglePost = () => {
  const route = useRoute();
  const {filename, description, user_id} = route.params;
  const [userFullName, setUserFullName] = useState('');
  const descriptionObject = JSON.parse(description);
  const {getUserById} = useUser();
  console.log('token here', descriptionObject.token);

  const getFullName = async (token) => {
    try {
      const userData = await getUserById(token, user_id);
      console.log('userData', userData);
      const fullName = userData.full_name;
      setUserFullName(fullName);
      console.log('here', userData);
    } catch (error) {
      console.log('getFullName error', error);
    }
  };
  getFullName(descriptionObject.token);
  console.log('fullname',userFullName);
  return (
    <ScrollView>
      <Image
        source={{uri: mediaUrl + filename}}
        PlaceholderContent={<ActivityIndicator />}
        style={{width: 300, height: 300}}
      />
      <Text>{userFullName}</Text>
      <Text>{descriptionObject.when}</Text>
      <Text>{descriptionObject.location}</Text>
      <Text>{descriptionObject.writePost}</Text>
    </ScrollView>
  );
};

export default SinglePost;
