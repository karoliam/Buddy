import PropTypes from 'prop-types';
import {MainContext} from '../context/MainContext';
import {useContext, useEffect, useState} from 'react';
import {useTag} from '../hooks/ApiHooks';
import {TextInput} from 'react-native';
import CommentField from './CommentField';

const ChatPage = ({navigation, route}) => {
  const {user} = useContext(MainContext);
  const chatParamsObject = route.params;
  const {getFilesByTag} = useTag();
  const idConcat = route.params;
  const stringIdConcat = idConcat.toString();
  const userIdString = user.user_id.toString()
  const checkIfIncludes = stringIdConcat.includes(userIdString);


  const getChatFile = async () => {
    const chatFile = getFilesByTag(idConcat);
  }

  useEffect(() => {
    getChatFile();
  }, []);
  return (
    <>
    {checkIfIncludes ? <CommentField /> : <Text>Something went wrong</Text>}
    </>
  )

};
ChatPage.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default ChatPage;
