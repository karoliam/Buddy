import {Platform, SafeAreaView, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import SinglePost from '../components/SinglePost';
import CommentField from '../components/CommentField';

const Single = (props) => {
  const {navigation} = props;
  const {route} = props;
  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <SinglePost navigation={navigation} route={route}></SinglePost>
      <CommentField navigation={navigation} route={route}></CommentField>
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

Single.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Single;
