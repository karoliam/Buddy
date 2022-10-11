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
import {useState} from 'react';

const ListItem = ({singleMedia, navigation}) => {
  // console.log('tässä singlemedia', singleMedia);
  // console.log('tossa ois description', singleMedia.description);
  const singleMediaArray = [singleMedia];
  const data = JSON.parse(singleMedia.description);
  const {location, when, writePost} = data;
  console.log('singlemedia array', singleMediaArray);
  // for (const key in singleMedia){

  //   console.log(`${key}: ${singleMedia[key]}`);
  // }
  // const filtered = singleMedia.filter(item => item.title === 'feedPost' || item.title === 'feedPostTxt');
  // console.log('filtered', filtered);
  //console.log('here is data', JSON.parse(singleMedia));
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
            uri: mediaUrl + singleMedia.thumbnails.w160,
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
      <Text></Text>
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
};

export default ListItem;
