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

export default App;
