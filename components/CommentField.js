import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {useComments} from '../hooks/ApiHooks';
import {useContext} from 'react';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';

const CommentField = () => {
  const {postComment} = useComments();
  const route = useRoute();
  const {user} = useContext(MainContext);
  const {file_id} = route.params;

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
    const formData = new FormData();
    const token = await AsyncStorage.getItem('userToken');
    formData.append('file_id', file_id);
    formData.append('comment', data.comment);

    try {
      const commentResponse = await postComment(token, formData);
      console.log('comment response', commentResponse);
      // const tag = {file_id: commentResponse.file_id, tag: applicationTag};
      // const tagResponse = await postTag(token, tag);
      // console.log(tagResponse);
      Alert.alert(commentResponse.message, '', [
        {
          text: 'OK',
          onPress: () => {
            // setUpdate(!update);
            console.log('jee kommentointi toimii');
            // navigation.navigate('Home');
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
            console.log('hups', data);
          },
        },
      ]);
    }
  };

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
