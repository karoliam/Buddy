import {StatusBar} from 'expo-status-bar';
import {MainProvider} from './context/MainContext';
import Navigator from './navigators/Navigator';

const App = () => {
  return (
    <>
      <MainProvider>
        <Navigator></Navigator>
        <StatusBar style="auto" />
      </MainProvider>
    </>
  );
};

export default App;
