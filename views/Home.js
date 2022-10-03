import {Platform, SafeAreaView, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import List from '../components/List';
import {useContext} from 'react';
import {MainContext} from '../context/MainContext';

const Home = (props) => {
  const {navigation} = props;
  const {isLoggedIn} = useContext(MainContext);
  console.log(isLoggedIn);

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      {/* <List navigation={navigation}></List> */}
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

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
