import {FlatList, View} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {MainContext} from '../context/MainContext';
import TagList from './TagViewList';
import FilteredListItem from './FilteredListItem';

const FilteredList = ({navigation, route}) => {
  const {update, filteredFiles} = useContext(MainContext);
  return (
    <View>
    {/* <TagList navigation={navigation} route={route}></TagList> */}

    <FlatList
      data={filteredFiles}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <FilteredListItem
          navigation={navigation}
        />
      )}
    />
</View>
  );
};
FilteredList.propTypes = {
  navigation: PropTypes.object,
};
export default FilteredList;
