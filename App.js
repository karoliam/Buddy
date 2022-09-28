import {StatusBar} from 'expo-status-bar';
import {MainProvider} from './context/MainContext';
import Login from './views/Login';

const App = () => {
  return (
    <>
      <MainProvider>
        <Login />
        <StatusBar style="auto" />
      </MainProvider>
    </>
  );
};

export default App;
