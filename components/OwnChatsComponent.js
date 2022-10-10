import ChatPage from '../components/ChatPage';
import PropTypes from 'prop-types';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../context/MainContext';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';

const OwnChatsComponent = ({navigation, route}) => {
  const {user} = useContext(MainContext);
  const {getFilesByTag, getAllTags} = useTag();
  const [userOwnTags, setUserOwnTags] = useState([]);
  const {getUserById} = useUser()

  const getChatNames = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const allTags = await getAllTags(token);
    // const allTagsArray = allTags.map((item) => item.tag);
    const userIdString = user.user_id.toString();
    const ownTags = allTags.filter((item) => item.tag.includes(userIdString) && !item.tag.includes('buddyprofile'));
    const ownTagsMap = ownTags.map((item) => item.tag);
    console.log('own', ownTagsMap);
    setUserOwnTags(ownTagsMap);
    const otherIdArray = ownTagsMap.map((item) => item.slice(userIdString.length));
    console.log('other id', otherIdArray);
    const userById = otherIdArray.forEach(async (item) => {
      await getUserById(token, item);
    });
    console.log('user', userById);
  };
  useEffect(() => {
    getChatNames();
  }, []);
  return (
    <SafeAreaView>
      <Text>Chats</Text>
      <FlatList
        data={userOwnTags}
        style={{marginLeft: 16, marginBottom: 16}}
        renderItem={({item}) => <TouchableOpacity><Text>{item}</Text></TouchableOpacity>}
      />
    </SafeAreaView>
  );
};
OwnChatsComponent.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default OwnChatsComponent;
