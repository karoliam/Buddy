/**
 * Tähän viewiin nestataan LoginMainViewContainer.js ja RegisterUserDataForm.js
 */

import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import RegisterUserDataForm from '../components/RegisterUserDataForm';
import LoginMainViewContainer from '../components/LoginMainViewContainer';

const Login = () => {
  const {showRegisterUserDataForm} = useContext(MainContext);
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();

  const checkToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      if (userToken != null) {
        const userData = await getUserByToken(userToken);
        setIsLoggedIn(true);
        setUser(userData);
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
      {showRegisterUserDataForm ? <RegisterUserDataForm /> : <LoginMainViewContainer />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
