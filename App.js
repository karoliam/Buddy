import {StyleSheet, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import RegisterChecker from './views/RegisterChecker';
import {MainProvider} from './contexts/MainContext';

const App = () => {
  return (
    <>
      <MainProvider>
        <View style={styles.container}>
          <RegisterChecker />
        </View>
      </MainProvider>
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
