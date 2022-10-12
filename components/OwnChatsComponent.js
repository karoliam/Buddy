import ChatPage from '../components/ChatPage';
import PropTypes from 'prop-types';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../context/MainContext';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {appChatPostTitle, appChatTag} from '../utils/variables';

const OwnChatsComponent = ({navigation, route}) => {
  const {user} = useContext(MainContext);
  const {getFilesByTag, getAllTags} = useTag();
  const [userOwnTags, setUserOwnTags] = useState([]);
  const {getUserById} = useUser();
  const [getUserInfo, setGetUserInfo] = useState([]);
  const [otherUserWholeInfo, setOtherUserWholeInfo] = useState([]);
  const [chatFile, setChatFile] = useState({});
  const [otherUserId, setOtherUserId] = useState([]);
  const [ownId, setOwnId] = useState([]);
  const {update, setUpdate} = useContext(MainContext);
  const [bothIds, setBothIds] = useState([]);
  const getChatNames = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      // const allTagsArray = allTags.map((item) => item.tag);
      const userIdString = user.user_id.toString();
      // searching all own tags (tags which include your own id, minus buddyprofile tags)
      const commentPostArray = await getFilesByTag(appChatTag);
      console.log('array ', commentPostArray);
    } catch (error) {
      console.log('getchatnames error', error);
    }
  };
  console.log('userOwnTags', userOwnTags);

  const getRightFile = async () => {};

  useEffect(() => {
    getChatNames();
  }, []);

  return (
    <SafeAreaView>
      <Text>Chats</Text>
      <FlatList
        data={getUserInfo}
        style={{marginLeft: 16, marginBottom: 16}}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ChatView', chatFile)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};
OwnChatsComponent.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default OwnChatsComponent;
