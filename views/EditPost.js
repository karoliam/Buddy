import {Platform, SafeAreaView, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import List from '../components/List';
import {useContext} from 'react';
import {MainContext} from '../context/MainContext';
import EditPostForm from '../components/EditPostForm';

const EditPost = ({navigation, route}) => {

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <EditPostForm navigation={navigation} route={route}></EditPostForm>
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

EditPost.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default EditPost;
