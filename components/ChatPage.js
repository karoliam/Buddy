import PropTypes from 'prop-types';
import {MainContext} from '../context/MainContext';
import {useContext, useEffect, useState} from 'react';
import {useTag} from '../hooks/ApiHooks';
import {Text, TextInput} from 'react-native';
import CommentField from './CommentField';
import ChatCommentField from './ChatCommentField';

const ChatPage = ({navigation, route}) => {
  const {user} = useContext(MainContext);
  const chatParamsObject = route.params;
  const {getFilesByTag} = useTag();
  const userChatTag = route.params;



  const getChatFile = async () => {
    const chatFile = getFilesByTag(userChatTag);
  }

  useEffect(() => {
    getChatFile();
  }, []);
  return (
    <>
    <ChatCommentField navigation={navigation} route={route} />
    </>
  )

};
ChatPage.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default ChatPage;
