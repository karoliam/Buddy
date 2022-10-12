import {Alert, FlatList, Text, TextInput, View} from 'react-native';
import PropTypes from 'prop-types';
import {useComments, userMedia, useUser} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Controller, useForm} from 'react-hook-form';
import {Button, Image} from '@rneui/themed';
import {mediaUrl} from '../utils/variables';

const ChatCommentField = ({route}) => {
  const {postComment, getCommentByFileId} = useComments();
  const {update,setUpdate} = useContext(MainContext);
  const {paramsObject, file_id} = route.params;
  const [userComments, setUserComments] = useState();
  const {getUserById} = useUser();
  const {userProfilePostData} = userMedia();
  console.log('chatmedia', paramsObject);

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
    setValue('comment', '')
  };

  const fetchComments = async () => {
    try {
      // fetching comments
      const token = await AsyncStorage.getItem('userToken');
      const commentArray = await getCommentByFileId(file_id);
      console.log('commentArray', commentArray);

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

  return (
    <View style={{flex: 4, marginBottom: 100}}>
      <FlatList
        data={userComments}
        style={{marginLeft: 16, marginBottom: 16}}
        renderItem={({item}) => (
          <>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={{uri: mediaUrl + item.profile_pic.filename}}
                style={{width: 25, height: 25, borderRadius: 100}}
              />
              <Text style={{color: 'grey'}}>{item.user_name}</Text>
            </View>
            <Text>{item.time_added}</Text>

            <Text>{item.comment}</Text>
            {/* <Text>{item.user_name}</Text> */}
          </>
        )}
      />
      <Controller
        control={control}
        rules={{
          maxLength: 300,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View>
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Write a comment"
              style={{marginLeft: 16}}
            />
          </View>
        )}
        name="comment"
      />

      <Button
        style={{width: 100, marginTop: 16, marginLeft: 16}}
        onPress={handleSubmit(commenting)}
        title="Send"
      ></Button>
    </View>
  );
};

ChatCommentField.propTypes = {
  route: PropTypes.object,
};

export default ChatCommentField;