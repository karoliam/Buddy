import {FlatList, View} from 'react-native';
import {loadTags, useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {MainContext} from '../context/MainContext';
import TagList from './TagList';
import Filtering from './Filtering';

const List = ({navigation, route, filterOn}) => {
  const {update, tagItem} = useContext(MainContext);
  const item = route.params;
  const {mediaArray} = useMedia(update, filterOn, item);
  console.log('tagitem', item)

  return (
    <View>
    <TagList navigation={navigation} route={route}></TagList>

    <FlatList
      data={mediaArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem singleMedia={item} navigation={navigation} route={route} filterOn={filterOn}/>
      )}
    />
</View>
  );
};
List.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  filterOn: PropTypes.bool,
};
export default List;
