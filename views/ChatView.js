import ChatPage from '../components/ChatPage';
import PropTypes from 'prop-types';

const ChatView = ({navigation, route}) => {
  return (
      <ChatPage navigation={navigation} route={route}></ChatPage>
  );
};
ChatView.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default ChatView;
