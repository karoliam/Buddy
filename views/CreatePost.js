import {SafeAreaView} from 'react-native-safe-area-context';
import CreatePostForm from '../components/CreatePostForm';
import PropTypes from 'prop-types';
import {Platform, StyleSheet} from 'react-native';

const CreatePost = (props) => {
  const {navigation} = props;
  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <CreatePostForm navigation={navigation}></CreatePostForm>
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

CreatePost.propTypes = {
  navigation: PropTypes.object,
};
export default CreatePost;
