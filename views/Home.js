import {StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
// KAIKKI TÄÄLLÄ ON VAIN PLACEHOLDERIA JOKA KORVATAAN OIKEALLA KOODILLA JOSSAIN VAIHEESSA

const Home = () => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text>Home view</Text>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
