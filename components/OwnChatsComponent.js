import ChatPage from '../components/ChatPage';
import PropTypes from 'prop-types';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../context/MainContext';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {appChatPostTitle, appChatTag, applicationTag} from '../utils/variables';

const OwnChatsComponent = ({navigation, route}) => {
  const {user, updateChatProfiles, setUpdateChatProfiles} =
    useContext(MainContext);
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
      let otherId = [];
      let idsProcessed = 0;
      commentPostArray.forEach((file) => {
        const usersId = file.title.split('#');
        if (usersId[0] == user.user_id) {
          otherId.push(usersId[1]);
          idsProcessed++;
        } else if (usersId[1] == user.user_id) {
          otherId.push(usersId[0]);
          idsProcessed++;
        } else {
          idsProcessed++;
        }
        if (idsProcessed == commentPostArray.length) {
          getOtherUsersNames(otherId);
        }
      });
    } catch (error) {
      console.log('getchatnames error', error);
    }
  };
  const getOtherUsersNames = async (idList) => {
    let userList = [];
    idList.forEach(async (id) => {
      try {
        console.log(id);
        //TODO vaihda toi tägityyli oikeaksi
        const user = await getFilesByTag(applicationTag + 'profile_data' + id);
        userList.push(JSON.parse(user[0].description).full_name);
        setGetUserInfo(userList);
      } catch (error) {
        console.log('OwnCharComponenst.js getOtherUserNames ', error.message);
      }
    });
  };
  useEffect(() => {
    getChatNames();
  }, []);
  useEffect(() => {
    getChatNames();
  }, [updateChatProfiles]);

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
