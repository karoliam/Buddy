import {StatusBar} from 'expo-status-bar';
import {MainProvider} from './context/MainContext';
import Navigator from './navigators/Navigator';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

const App = () => {
  library.add(fas)
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
