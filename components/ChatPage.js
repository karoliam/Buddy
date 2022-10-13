import PropTypes from 'prop-types';
import {MainContext} from '../context/MainContext';
import {useContext, useEffect, useState} from 'react';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {Text, TextInput} from 'react-native';
import CommentField from './CommentField';
import ChatCommentField from './ChatCommentField';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatPage = ({navigation, route}) => {
  const {user} = useContext(MainContext);
  const {searchMedia} = useMedia();

  const chatParamsObject = route.params;

  const getChatFile = async () => {
    console.log('params', chatParamsObject);
  };

  useEffect(() => {
    getChatFile();
  }, []);
  return (
    <>
      <Text style={{alignSelf: 'center', marginTop: 70}}>
        {chatParamsObject.title}
      </Text>
      <ChatCommentField navigation={navigation} route={route} />
    </>
  );
};
ChatPage.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default ChatPage;
