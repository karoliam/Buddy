import {
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import {applicationTag, mediaUrl, appChatTag} from '../utils/variables';
import {Button, Image} from '@rneui/themed';
import {useRoute} from '@react-navigation/native';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../context/MainContext';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import KeyboardAvoidingComponent from './KeyboardAvoidingComponent';
import CommentField from './CommentField';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
const {height, width} = Dimensions.get('window');

const SinglePost = ({navigation, route}) => {
  // const route = useRoute();
  const {filename, title, description, user_id, file_id} = route.params;
  const [userFullName, setUserFullName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [posterAvatar, setPosterAvatar] = useState('');
  const descriptionObject = JSON.parse(description);
  const {getFilesByTag} = useTag();
  const {getUserById} = useUser();
  const {postTag} = useTag();
  const {postMedia, searchMedia} = useMedia();
  const {
    user,
    showEditPost,
    setShowEditPost,
    update,
    setUpdate,

    updateChatProfiles,

    setUpdateChatProfiles,

    setUserIdForProfilePage,
    setShowAnotherUserProfile,
    showAnotherUserProfile,
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
      const profilePicTag = await getFilesByTag(
        applicationTag + 'profile_pic' + user_id
      );
      console.log('profilePicTag ', profilePicTag);
      console.log('profilePicTag0 ', mediaUrl + profilePicTag[0].filename);
      if (profilePicTag[0].filename != undefined) {
        setPosterAvatar(mediaUrl + profilePicTag[0].filename);
      }
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

  const checkUser = () => {
    setUserIdForProfilePage(user_id);
    setShowAnotherUserProfile(!showAnotherUserProfile);
  };

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
    const currentIdString = user.user_id.toString();
    const otherIdString = user_id.toString();
    const usersIdChatTitle = currentIdString + '#' + otherIdString;
    const usersIdChatTitleReverse = otherIdString + '#' + currentIdString;
    formData.append('title', usersIdChatTitle);
    const searchData = {
      title: usersIdChatTitle,
    };
    const searchDataReverse = {
      title: usersIdChatTitleReverse,
    };
    try {
      const checkChatMedia = await searchMedia(token, searchData);
      const checkChatMediaReverse = await searchMedia(token, searchDataReverse);
      if (checkChatMedia.length == 0 && checkChatMediaReverse.length == 0) {
        const chatMediaResponse = await postMedia(token, formData);
        const appTag = {file_id: chatMediaResponse.file_id, tag: appChatTag};
        const appTagResponse = await postTag(token, appTag);
        setUpdateChatProfiles(!updateChatProfiles);

        navigation.navigate('ChatView', chatMediaResponse);

        //navigation.navigate('ChatView', chatParamsObject);
      } else {
        if (checkChatMedia.length == 0) {
          const fil = checkChatMediaReverse.pop();
          navigation.navigate('ChatView', fil);
        } else {
          const fil = checkChatMedia.pop();
          navigation.navigate('ChatView', fil);
        }
        console.log('chätti on jo luotu');
      }
    } catch (error) {
      console.log('creating chat file error', error);
    }
  };

  useEffect(() => {
    showEditPostFunction();
  }, [update]);

  return (
    <KeyboardAwareScrollView style={styles.droidSafeArea}>
              <TouchableOpacity style={{marginTop: 16, marginBottom: 16}}onPress={()=> navigation.navigate('Home')}>
          <FontAwesomeIcon
            icon="fa-solid fa-chevron-left"
            size={32}
            color={'#343434'}
          />
        </TouchableOpacity>
      {title === 'feedPost' ? (
        <View style={styles.inner}>
          <View style={styles.postImageContainer}>
            <Image
              source={{uri: mediaUrl + filename}}
              PlaceholderContent={<ActivityIndicator />}
              style={styles.postImage}
            />
          </View>
          <View style={styles.postEditDeleteRow}>
            <View style={styles.postEditIconContainer}>
              {showEditPost ? (
                <TouchableOpacity
                  style={styles.editPostButton}
                  onPress={() => {
                    navigation.navigate('EditPost', paramsObject);
                  }}
                >
                  <Text style={styles.editPostText}>
                  Edit post
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text></Text>
              )}
            </View>
          </View>
          <View style={styles.postTopRow}>
            <View style={styles.chatButtonStack}>
              <TouchableOpacity style={styles.chatButton}>
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.postTextRow}>
            <TouchableOpacity
              style={styles.userAvatarContainer}
              onPress={checkUser}
            >
              <Image
                style={styles.userAvatarImage}
                source={{
                  uri: posterAvatar,
                }}
              />
              <Text style={styles.posterNameText}>{userFullName}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.postLocationTimeRow}>
            <Text style={styles.whenPlainText}>When</Text>
            <Text style={styles.postWhenText}>{descriptionObject.when}</Text>
            <Text style={styles.postLocationText}>
              {descriptionObject.location}
            </Text>
          </View>
          <Text style={styles.postText}>{descriptionObject.writePost}</Text>

          <View style={styles.postBottomBorder}></View>
          <CommentField navigation={navigation} route={route}></CommentField>
        </View>
      ) : (
        <View style={styles.inner}>
          <View style={styles.postEditDeleteRow}>
            <View style={styles.postEditIconContainer}>
              {showEditPost ? (
                <TouchableOpacity
                  style={styles.editPostButton}
                  onPress={() => {
                    navigation.navigate('EditPost', paramsObject);
                  }}
                >
                  <Text style={styles.editPostText}>Edit post</Text>
                </TouchableOpacity>
              ) : (
                <Text></Text>
              )}
            </View>
          </View>
          <View style={styles.postTopRow}>
            <View style={styles.chatButtonStack}>
              <TouchableOpacity style={styles.chatButton}>
                <Text
                  onPress={() => createChatFile()}
                  style={styles.chatButtonText}
                >Chat</Text>
              </TouchableOpacity>
            </View>

          </View>
          <View style={styles.postTextRow}>
            <TouchableOpacity
              style={styles.userAvatarContainer}
              onPress={checkUser}
            >
              <Image
                style={styles.userAvatarImage}
                source={{
                  uri: posterAvatar,
                }}
              />
              <Text style={styles.posterNameText}>{userFullName}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.postLocationTimeRow}>
            <Text style={styles.whenPlainText}>When</Text>
            <Text style={styles.postWhenText}>{descriptionObject.when}</Text>
            <Text style={styles.postLocationText}>
              {descriptionObject.location}
            </Text>
          </View>
          <Text style={styles.postText}>{descriptionObject.writePost}</Text>
          <View style={[styles.postBottomBorder]}></View>
          <CommentField navigation={navigation} route={route}></CommentField>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    height: height,
    backgroundColor: 'white'
  },
  postImageContainer: {
    width: width - 64,
    marginLeft: 32,
    height: 0.75 * (width - 64),
    borderRadius: 8,
  },
  postImage: {
    width: width - 64,
    height: 0.75 * (width - 64),
    borderRadius: 8,
  },
  postEditIconContainer: {
    marginTop: 16,
    marginRight: 8,
  },
  postEditDeleteRow: {
    width: width - 64,
    height: 26,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 0,0)',
    marginLeft: 32,
  },
  posterNameText: {
    width: width - 125,
    fontSize: 16,
    marginLeft: 8,
    color: 'rgba(0, 0, 0,0.5)',
    top: 8,
  },
  chatButton: {
    width: 60,
    height: 32,
    position: 'absolute',
    alignContent: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
  },
  chatButtonText: {
    backgroundColor: 'rgba(0,0,255,0)',
    top: 3,
    color: 'rgba(83,134,234,1)',
    fontSize: 16,
    textAlign: 'center',
  },
  chatButtonStack: {
    position: 'absolute',
    right: 88,
    backgroundColor: 'rgba(255,0,0,0)',
    width: 60,
    height: 32,
    right: 0
  },
  attendButton: {
    width: 80,
    height: 32,
    position: 'absolute',
    alignContent: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
  },
  attendButtonText: {
    backgroundColor: 'rgba(0,0,255,0)',
    top: 3,
    color: 'rgba(83,134,234,1)',
    fontSize: 16,
    textAlign: 'center',
  },
  attendButtonStack: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'rgba(255,0,0,0)',
    width: 80,
    height: 32,
    marginLeft: 16,
  },
  postTopRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 255, 0,0)',
    width: width - 64,
    height: 32,
    marginLeft: 32,
  },
  userAvatarContainer: {
    left: 0,
    top: 8,
    width: 52,
    height: 52,
    backgroundColor: 'rgba(0, 255, 0,0.3)',
    borderRadius: 100,
    flexDirection: 'row',
  },
  userAvatarImage: {
    width: 52,
    height: 52,
    borderRadius: 100,
  },
  postText: {
    //left: 8,
    fontSize: 16,
    width: width - 124,
    marginTop: 16,
    backgroundColor: 'rgba(0, 255, 255,0)',
    alignSelf: 'flex-start',
    marginLeft: 32,
  },
  postTextRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 0,0)',
    width: width - 64,
    marginLeft: 32,
  },

  postLocationText: {
    position: 'absolute',
    right: 0,
    fontSize: 16,
    color: 'rgba(0, 0, 0,0.5)',
  },
  postLocationTimeRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 255,0)',
    width: width - 64,
    marginLeft: 32,
    height: 32,
    marginTop: 16,
  },
  postBottomBorder: {
    width: width - 64,
    height: 2,
    backgroundColor: 'rgba(165,171,232,0.5)',
    marginTop: 3,
    alignSelf: 'center',
  },
  whenPlainText: {
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
  },
  postWhenText: {
    fontSize: 16,
  },
  editPostButton: {
    height: 30,
    backgroundColor: 'rgba(246,203,100,1)',
    borderRadius: 10,
    width: 80,
    marginTop: 12,
  },
  editPostText: {
    textAlign: 'center',
    top: 5
  },

});

SinglePost.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default SinglePost;
