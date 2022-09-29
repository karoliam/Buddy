import {StatusBar} from 'expo-status-bar';
import {View} from 'react-native';
import RegisterForm from './components/RegisterForm';
import RegisterUserDataForm from './components/RegisterUserDataForm';
import {MainProvider} from './context/MainContext';
import Navigator from './navigators/Navigator';

const App = () => {
  return (
    <>
      <MainProvider>
        <View>
          <RegisterUserDataForm />
        </View>
      </MainProvider>
    </>
  );
};

export default App;
