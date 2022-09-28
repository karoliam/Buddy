import {StatusBar} from 'expo-status-bar';
import RegisterUserDataForm from './components/RegisterUserDataForm';

const App = () => {
  return (
    <>
      <MainProvider>
        <View style={styles.container}>
          <RegisterUserDataForm />
        </View>
      </MainProvider>
      <StatusBar style="auto" />
    </>
  );
};

export default App;
