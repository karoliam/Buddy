import List from '../components/List';
import PropTypes from 'prop-types';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet, Text} from 'react-native';

const MyFiles = ({navigation, myFilesOnly}) => {
  return (
    <>
      <SafeAreaView style={styles.droidSafeArea}>
      <Text style={styles.title}>Own posts</Text>
      <List navigation={navigation} myFilesOnly={true} />
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
MyFiles.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};
export default MyFiles;
