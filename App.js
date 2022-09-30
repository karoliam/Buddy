import {StatusBar} from 'expo-status-bar';
import {View} from 'react-native';
import RegisterForm from './components/RegisterForm';
import RegisterUserDataForm from './components/RegisterUserDataForm';
import {MainProvider} from './context/MainContext';
import Navigator from './navigators/Navigator';
import RegisterChecker from './views/RegisterChecker';

const App = () => {
  return (
    <>
      <MainProvider>
        <Navigator></Navigator>
      </MainProvider>
    </>
  );
};

export default App;
