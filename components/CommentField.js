import {Alert, FlatList, Text, TextInput, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {useComments} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';

const CommentField = () => {
  const {postComment, getCommentByFileId} = useComments();
  const route = useRoute();
  const {user} = useContext(MainContext);
  const {file_id} = route.params;
  const [userComments, setUserComments, commentSender, setCommentSender] = useState([]);
  const {
    control,
    handleSubmit,
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
  // const getComment = async () => {
  //     const commentByFileId = await getCommentByFileId(file_id);
  //     setUserComments(commentByFileId);
  //    // const commentParsing = JSON.parse(commentByFileId);
  //    console.log('täällä on usercomments', userComments);
  // };

  const fetchComments = async () => {
    try {
      const commentArray = await getCommentByFileId(file_id);
      const onlyComment = commentArray.map(comments => comments.comment);
      setUserComments(onlyComment);
      // setUserComments(commentArray);
      console.log('comments here', commentArray);
    } catch (error) {
      console.log('fetchComments', error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <View style={{flex: 1}}>
      <Controller
        control={control}
        rules={{
          maxLength: 300,
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View>
            <FlatList
        data={userComments}
        renderItem={({item}) => <Text>{item}</Text>}
      />
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Write a comment"
            />
          </View>
        )}
        name="comment"
      />
      {errors.username?.type === 'required' && <Text>This is required.</Text>}
      {errors.username?.type === 'minLength' && <Text>Min 3 chars!</Text>}

      <TouchableOpacity onPress={handleSubmit(commenting)}>
        <Text>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

CommentField.propTypes = {
  route: PropTypes.object,
};

export default CommentField;
