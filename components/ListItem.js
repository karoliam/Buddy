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
import {useTag} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../context/MainContext';

const ListItem = ({singleMedia, navigation, route}) => {
  // console.log('tässä singlemedia', singleMedia);
  // console.log('tossa ois description', singleMedia.description);
  const data = JSON.parse(singleMedia.description);
  const {location, when, writePost} = data;
  const {getFilesByTag} = useTag();
  const item = route.params;
  const [filteredFiles, setFilteredFiles] = useState({});
  const {filterOn} = useContext(MainContext);

  console.log('filtered files', filteredFiles);
  const getByTag = async () => {
    if (item !== null) {
      try {
        const filesByTag = await getFilesByTag('buddytag' + item);
        //console.log('files HERE', filesByTag);
        // setFilteredFiles(filesByTag);
        //console.log('filesbytag', filteredFiles);
      } catch (error) {
        console.log('getByTag error', error);
      }
    }
  };
  const filtering = (files) => {
    const filterDesc = files.map((item) => item.description);
    console.log('filtered', filterDesc);
    const filterFilename = files.map((item) => item.filename);
    console.log('filenames', filterFilename);
  }
  // const descriptionJSON = JSON.parse(filteredDescription);
  // const filteredWhen = filteredDescription.map((item) => item.when);
  //onsole.log('tuosa',filteredDescription);
  getByTag();
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
};

export default ListItem;
