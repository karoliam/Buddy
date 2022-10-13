import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {useComments, useMedia, userMedia, useUser} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Controller, useForm} from 'react-hook-form';
import {Button, Image} from '@rneui/themed';
import {mediaUrl} from '../utils/variables';
import moment from 'moment';
const {height, width} = Dimensions.get('window');

const ChatCommentField = ({route}) => {
  const {postComment, getCommentByFileId} = useComments();
  const {update, setUpdate} = useContext(MainContext);
  const {paramsObject, file_id} = route.params;
  const [userComments, setUserComments] = useState();
  const {getUserById} = useUser();
  const {userProfilePostData} = userMedia();
  const WAIT_TIME = 10000;
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      file_id: file_id,
      comment: '',
    },
  });

  const commenting = async (data) => {
    const token = await AsyncStorage.getItem('userToken');

    try {
      const commentResponse = await postComment(token, data);
      console.log('comment response', commentResponse);
      Alert.alert(commentResponse.message, '', [
        {
          text: 'OK',
          onPress: () => {
            setUpdate(!update);
            resetCommentInput();
            console.log('jee kommentointi toimii');
          },
        },
      ]);
    } catch (error) {
      console.error('onSubmit upload failed', error);
      Alert.alert('paskaks meni', '', [
        {
          text: 'OK',
          onPress: () => {
            console.log(error);
            console.log('CommentField.js Commenting()', data);
          },
        },
      ]);
    }
  };

  const resetCommentInput = () => {
    setValue('comment', '');
  };

  const fetchComments = async () => {
    try {
      // fetching comments
      const token = await AsyncStorage.getItem('userToken');
      const commentArrayR = await getCommentByFileId(file_id);
      console.log('commentArray', commentArray);
      const commentArray = commentArrayR.reverse();
      for (const commentArrayKey in commentArray) {
        const userUploads = await userProfilePostData(
          commentArray[commentArrayKey].user_id
        );
        console.log('userUploads', userUploads);
        let userProfileData;
        let userProfilePic;
        for (let userUploadsKey in userUploads) {
          console.log(
            'forloop' + userUploadsKey,
            userUploads[userUploadsKey].title
          );
          if (userUploads[userUploadsKey].title == 'profile_data') {
            userProfileData = userUploads[userUploadsKey].description;
          }
          if (userUploads[userUploadsKey].title == 'profile_pic') {
            userProfilePic = userUploads[userUploadsKey];
          }
        }

        const userDescription = JSON.parse(userProfileData);
        const userFullname = {user_name: userDescription.full_name};
        commentArray[commentArrayKey].user_name = userFullname.user_name;
        commentArray[commentArrayKey].profile_pic = userProfilePic;
        console.log('userProfileData', userProfileData);
        console.log('userDescription', userDescription);
        console.log('tyypin kuva', userProfilePic);
      }
      console.log('commentArray with names', commentArray);
      setUserComments(commentArray);

      //const onlyComment = commentArray.map((comments) => comments.comment);
      //setUserComments(onlyComment);
      // console.log('commentArray', commentArray);
      // fetching the sender of a comment
      const userID = commentArray.map((comments) => comments.user_id);
      userID.forEach(async (item) => {
        let userProfilePic;
        for (let userUploadsKey in userUploads) {
          console.log(
            'forloop' + userUploadsKey,
            userUploads[userUploadsKey].title
          );
          if (userUploads[userUploadsKey].title == 'profile_pic') {
            userProfilePic = userUploads[userUploadsKey];
          }
        }
        console.log('userProfilePic', userProfilePic);
      });

      console.log('tossa userID', userID);
      userID.forEach((commentArray) => {
        console.log('array', commentArray);
      });
      console.log('userid', userID);
      userID.forEach(async (user_id) => {
        const gettingUsers = await getUserById(token, userID);
        //console.log('getting users', gettingUsers);
      });

      // console.log('comment senders', userById);
      // setCommentSender(userById.full_name);
      // setUserComments(commentArray);
      //console.log('comments here', commentArray);
    } catch (error) {
      console.log('fetchComments', error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [update]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('moi');
      fetchComments();
    }, WAIT_TIME);
    return () => clearInterval(interval);
  }, []);
  return (
    <View style={[styles.container, {height: height - 318}]}>
      <FlatList
        data={userComments}
        style={{marginLeft: 16, marginBottom: 16}}
        renderItem={({item}) => (
          <>
            <View style={styles.commentContainer}>
              <View style={styles.userAvatarContainer}>
                <Image
                  source={{uri: mediaUrl + item.profile_pic.filename}}
                  style={styles.userAvatarImage}
                />
              </View>
              <View>
                <Text style={styles.userNameText}>{item.user_name}</Text>
                <Text style={styles.commentText}>{item.comment}</Text>
                <Text style={styles.timeStampText}>
                  {moment(item.time_added)
                    .utcOffset('+0300')
                    .startOf('minute')
                    .fromNow()}
                </Text>
              </View>
            </View>
          </>
        )}
      />

      <View>
        <Controller
          control={control}
          rules={{
            maxLength: 300,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={styles.inputAndSend}>
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Write a comment"
                style={styles.commentInput}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSubmit(commenting)}
              >
                <Text>Send</Text>
              </TouchableOpacity>
            </View>
          )}
          name="comment"
        />
      </View>
    </View>
  );
};

ChatCommentField.propTypes = {
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    alignContent: 'space-between',
    flexDirection: 'column',
    height: height - 100,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: '#00ff0000',
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  commentInput: {
    marginLeft: 32,
    backgroundColor: 'white',
    padding: 8,
    width: '70%',
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgba(165,171,232,0.5)',
  },
  userAvatarContainer: {
    marginRight: 8,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 255, 0,0.3)',
    borderRadius: 100,
    marginLeft: 16,
  },
  userAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  userNameText: {
    fontSize: 14,
    color: 'rgba(124,124,124,1)',
  },
  commentText: {
    backgroundColor: 'rgba(0, 0, 255,0)',
    width: width - 92,
    fontSize: 16,
  },
  timeStampText: {
    backgroundColor: 'rgba(0, 0, 255,0)',
    color: 'rgba(124,124,124,1)',
    fontSize: 12,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: 'rgba(165,171,232,0.5)',
    padding: 8,
    borderRadius: 8,
  },
  inputAndSend: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
});

export default ChatCommentField;
