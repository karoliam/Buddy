import PropTypes from 'prop-types';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet, Text} from 'react-native';
import FilteredList from '../components/FilteredList';

const FilteredFeed = ({navigation}) => {
  return (
    <>
      <SafeAreaView style={styles.droidSafeArea}>
      <FilteredList navigation={navigation} />
    </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 24
  }
});
FilteredFeed.propTypes = {
  navigation: PropTypes.object,
};
export default FilteredFeed;
