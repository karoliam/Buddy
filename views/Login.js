import React, {useContext, useEffect} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  // props is needed for navigation
  const {isLoggedIn, setIsLoggedIn} = useContext(MainContext);
  const logIn = async () => {
    console.log('Button pressed');
    setIsLoggedIn(true);
    await AsyncStorage.setItem('userToken', 'abc');
  };

  const checkToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      if (userToken != null) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('login - checkToken', error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <Button title="Sign in!" onPress={logIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
