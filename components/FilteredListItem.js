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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext, useEffect} from 'react';
import {MainContext} from '../context/MainContext';

const FilteredListItem = async ({navigation, route}) => {
  const item = route.params;
  const {getFilesByTag} = useTag();
  const {update} = useContext(MainContext);
  const {filteredFiles, setFilteredFiles} = useContext(MainContext);

  const filtering = async () => {
    try {
      const files = await getFilesByTag(item);
      const allFilteredFilesArray = files.map((item) => item.description);
      setFilteredFiles(allFilteredFilesArray);
    } catch (error) {
      console.log('filtering', error);
    }
  };
  useEffect(() => {
    filtering();
  }, [update]);

  console.log('descriptionit on tossa', filteredFiles);

  return (
    <TouchableOpacity
      style={styles.touchable}
      onPress={() => {
        navigation.navigate('Single', filteredFiles);
      }}
    >
      {filteredFiles.title === 'feedPost' ? (
        <Image
          style={styles.image}
          source={{
            uri: mediaUrl + filteredFiles.thumbnails.w160,
          }}
        />
      ) : (
        <Text></Text>
      )}

      <View>
        <Text>{filteredFiles.description.when}</Text>
        <Text>{filteredFiles.description.location}</Text>
        <Text>{filteredFiles.description.writePost}</Text>
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

FilteredListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  route: PropTypes.object,
  filterOn: PropTypes.bool,
};

export default FilteredListItem;
