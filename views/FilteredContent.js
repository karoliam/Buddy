import {Platform, SafeAreaView, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import List from '../components/List';

const FilteredContent = ({navigation}) => {
  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <List navigation={navigation} filterOn={true} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});

FilteredContent.propTypes = {
  navigation: PropTypes.object,
};

export default FilteredContent;
