import OwnChatsComponent from "../components/OwnChatsComponent";
import PropTypes from 'prop-types';


const OwnChats = ({navigation, route}) => {
  return (
      <OwnChatsComponent navigation={navigation} route={route}></OwnChatsComponent>
  );
};
OwnChats.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default OwnChats;
