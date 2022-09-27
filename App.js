import {StyleSheet, Text, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import RegisterChecker from './views/RegisterChecker';

const App = () => {
  return (
    <>
      <View style={styles.container}>
        <RegisterChecker/>
      </View>
      <StatusBar style="auto" />
    </>
  );
};
// testing lol
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;

