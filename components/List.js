import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {MainContext} from '../context/MainContext';
import TagList from './TagList';

const List = ({navigation, myFilesOnly, route}) => {
  const {update} = useContext(MainContext);
  const {mediaArray} = useMedia(update, myFilesOnly);
  return (
    <>
    <TagList navigation={navigation} route={route}></TagList>
    <FlatList
      data={mediaArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem
          singleMedia={item}
          navigation={navigation}
          myFilesOnly={myFilesOnly}
        />
      )}
    />
    </>
  );
};
List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
  route: PropTypes.object,
};
export default List;
