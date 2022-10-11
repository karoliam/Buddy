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
      const allTags = await getAllTags(token);
          // const allTagsArray = allTags.map((item) => item.tag);
    const userIdString = user.user_id.toString();
    // searching all own tags (tags which include your own id, minus buddyprofile tags)
    const ownTags = allTags.filter((item) => item.tag.includes(userIdString) && !item.tag.includes('buddyprofile'));
    const ownTagsMap = ownTags.map((item) => item.tag);
    console.log('own', ownTagsMap);
    setUserOwnTags(ownTagsMap);
    const idArray = [];
    ownTagsMap.forEach((item) => {
      const splitted = item.split('#');
      idArray.push(splitted);
      //setBothIds(idArray);
      console.log('item', splitted);
    });

    const senderId = idArray.flat()[0].toString().slice(9)
    console.log('sender', senderId)
    const receiverId = idArray.flat()[1].toString().slice(11);
    console.log('receiver', receiverId);

    const otherId = [];
    if(senderId !== user.user_id) {
      otherId.push(receiverId);
    } else if (senderId === user.user_id) {
      otherId.push(senderId);
    }
    console.log('otheruserid', otherId);
    console.log('ownid',user.user_id);

    const userNameArray = [];
    otherId.forEach(async (item) => {
      try {
        const getUser = await getUserById(token, item);
        console.log('fullname', getUser.full_name);
        userNameArray.push(getUser.full_name);
        setGetUserInfo(userNameArray);
      } catch (error) {
        console.log('otherIdArray error', error)
      }
    });
  } catch (error) {
      console.log('getchatnames error', error);
    }
  };
  console.log('userOwnTags', userOwnTags);
  const getRightFile = async () => {
    const fileArray = [];
    userOwnTags.forEach(async (item) => {
      try {
        console.log('item', item);
        const file = await getFilesByTag(item);
        console.log('file',file)
        fileArray.push(file);
        setChatFile(fileArray);
      } catch (error) {
        console.log('getRightFile error', error);
            }
    })
  };

  useEffect(() => {
    getChatNames();
    getRightFile();
  }, []);

  return (
    <SafeAreaView>
      <Text>Chats</Text>
      <FlatList
        data={getUserInfo}
        style={{marginLeft: 16, marginBottom: 16}}
        renderItem={({item}) => <TouchableOpacity onPress={() => navigation.navigate('ChatView', chatFile)}><Text>{item}</Text></TouchableOpacity>}
      />
    </SafeAreaView>
  );
};
OwnChatsComponent.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default OwnChatsComponent;
