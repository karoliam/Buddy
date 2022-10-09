import {mediaUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';


const ListItem = async ({singleMedia, navigation, route}) => {

  const data = JSON.parse(singleMedia.description);
  const {location, when, writePost} = data;
  const item = route.params;


  return (
    <TouchableOpacity
      style={styles.touchable}
      onPress={() => {
        navigation.navigate('Single', singleMedia);
      }}
    >
      {singleMedia.title === 'feedPost' ? (
        <Image
          style={styles.image}
          source={{
            uri:
              mediaUrl + singleMedia.thumbnails.w160

          }}
        />
      ) : (
        <Text></Text>
      )}

      <View>
        <Text>{when}</Text>
        <Text>{location}</Text>
        <Text>{writePost}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ededed',
    marginBottom: '1%',
    padding: '2%',
    width: Dimensions.get('window').width,
  },
  image: {
    width: 300,
    height: 300,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  route: PropTypes.object,
  filterOn: PropTypes.bool,
};

export default ListItem;
