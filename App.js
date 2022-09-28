import {StatusBar} from 'expo-status-bar';
import RegisterUserDataForm from './components/RegisterUserDataForm';
import {MainProvider} from './context/MainContext';

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
