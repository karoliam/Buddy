import ChatPage from '../components/ChatPage';
import PropTypes from 'prop-types';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../context/MainContext';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {appChatPostTitle, appChatTag, applicationTag} from '../utils/variables';

const OwnChatsComponent = ({navigation, route}) => {
  const {
    user,
    updateChatProfiles,
    updateCommentFieldList,
    setUpdateCommentFieldList,
  } = useContext(MainContext);
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
  const {searchMedia} = useMedia();
  const WAIT_TIME = 10000;
  const getChatNames = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      // const allTagsArray = allTags.map((item) => item.tag);
      const userIdString = user.user_id.toString();
      // searching all own tags (tags which include your own id, minus buddyprofile tags)
      const commentPostArray = await getFilesByTag(appChatTag);
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
        //TODO vaihda toi tägityyli oikeaksi
        const user = await getFilesByTag(applicationTag + 'profile_data' + id);
        userList.push(user[0]);
        setGetUserInfo(userList);
      } catch (error) {
        console.log('OwnCharComponenst.js getOtherUserNames ', error.message);
      }
    });
  };
  const openChat = async (otherUserId) => {
    const token = await AsyncStorage.getItem('userToken');
    const usersIdChatTitle = otherUserId + '#' + user.user_id;
    const usersIdChatTitleReverse = user.user_id + '#' + otherUserId;
    const searchData = {
      title: usersIdChatTitle,
    };
    const searchDataReverse = {
      title: usersIdChatTitleReverse,
    };
    try {
      const chatFile = await searchMedia(token, searchData);
      const chatFileReverse = await searchMedia(token, searchDataReverse);

      if (chatFile.length == 0) {
        const fil = chatFileReverse.pop();
        navigation.navigate('ChatView', fil);
      } else {
        const fil = chatFile.pop();
        navigation.navigate('ChatView', fil);
      }
    } catch (error) {
      console.log('OwnChatsComponent.js openChat', error.message);
    }
  };
  useEffect(() => {
    getChatNames();
  }, []);
  //timer or wather
  useEffect(() => {
    const interval = setInterval(() => {
      getChatNames();
    }, WAIT_TIME);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getChatNames();
  }, [updateChatProfiles]);

  return (
    <SafeAreaView>
      <Text style={styles.chatText}>Chats</Text>
      <FlatList
        data={getUserInfo}
        style={{marginLeft: 16, marginBottom: 16}}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => openChat(item.user_id)}>
            <Text style ={styles.fullName}>{JSON.parse(item.description).full_name}</Text>
            <View style={styles.divider}></View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  fullName: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: '500'
  },
  chatText: {
    marginBottom: 30,
    marginTop: 16,
    fontSize: 30,
    alignSelf: 'center'
  },
  divider: {
    height: 2,
    backgroundColor: 'rgba(165,171,232,0.5)',
    marginTop: 8,
    marginBottom: 8

  }
})


OwnChatsComponent.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default OwnChatsComponent;
