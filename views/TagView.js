import {Platform, SafeAreaView, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import TagViewList from '../components/TagViewList';


const TagView = ({navigation, route}) => {
  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <TagViewList navigation={navigation} route={route}></TagViewList>
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

TagView.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default TagView;