import {SafeAreaView} from 'react-native-safe-area-context';
import CreatePostForm from '../components/CreatePostForm';
import PropTypes from 'prop-types';
import {Platform, StyleSheet, View} from 'react-native';

const CreatePost = (props) => {
  const {navigation} = props;
  return (
    <View style={styles.droidSafeArea}>
      <CreatePostForm navigation={navigation}></CreatePostForm>
    </View>
  );
};

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1
  },
});

CreatePost.propTypes = {
  navigation: PropTypes.object,
};
export default CreatePost;
