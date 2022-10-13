import List from '../components/List';
import PropTypes from 'prop-types';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const MyFiles = ({navigation, myFilesOnly}) => {
  return (
    <>
      <SafeAreaView style={styles.droidSafeArea}>
      <TouchableOpacity onPress={()=> navigation.navigate('Profile')}>
          <FontAwesomeIcon
            icon="fa-solid fa-chevron-left"
            size={32}
            color={'#343434'}
          />
        </TouchableOpacity>
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
