/**
 * Tällä formilla otetaan vastaan käyttäjän sähköposti ja salasana kirjautumista
 * varten.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useState } from "react";
import {Controller, useForm} from 'react-hook-form';
import {
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import {MainContext} from '../context/MainContext';
import {useLogin} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
let {width} = Dimensions.get('window');

const LoginForm = () => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {postLogin} = useLogin();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const LoginAlertCheck = (loginCredentials) =>{

  };

  const logIn = async (loginCredentials) => {
    const emailArr = loginCredentials.username.split('#');
    let showAlert;
    let alertTitle;
    let alertMessage;
    if (emailArr[1].length < 1) {
      alertTitle = 'E-mail';
      alertMessage = 'E-mail is required!';
      showAlert = true;
    } else if (emailArr[1].length < 3) {
      alertTitle = 'E-mail';
      alertMessage = 'E-mail must be atleas 3 characters!';
      showAlert = true;
    } else if (loginCredentials.password < 1) {
      alertTitle = 'Password';
      alertMessage = 'Password is required!';
      showAlert = true;
    }
    if (showAlert === true) {
      Alert.alert(
        `${alertTitle}`,
        `${alertMessage}`,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: true })
    } else {
      try {
        const userData = await postLogin(loginCredentials);
        await AsyncStorage.setItem('userToken', userData.token);
        setUser(userData.user);
        console.log('here is userdata', userData);
        // splitting the application tag from the username
        const usernameSplit = await userData.user.username.split('#');
        console.log('usernamesplit', usernameSplit);
        const usernameAppTag = usernameSplit[0];
        if (usernameAppTag === 'buddy') {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log('Login - logIn', error);
        Alert.alert(
          'Try again',
          'E-mail or password wrong',
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        );
      }
    }

  };

  return (
    <View style={{flex: 1}}>
      <Controller
        control={control}
        rules={{
          // minLength: 3,
          // required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.fieldBoxUsername}>
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              placeholder="e-mail"
              style={styles.usernameInput}
            />
          </View>
        )}
        name="username"
      />
      {/* {errors.username?.type === 'required' && <Text>This is required.</Text>} */}
      {/* {errors.username?.type === 'minLength' && <Text>Min 3 chars!</Text>} */}

      <Controller
        control={control}
        rules={{
          maxLength: 100,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.fieldBoxPassword}>
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
              placeholder="password"
              style={styles.passwordInput}
            />
          </View>
        )}
        name="password"
      />
      <TouchableOpacity
        style={styles.buttonSignIn}
        onPress={handleSubmit((data) => {
          const addedBuddy = {
            password: data.password,
            username: 'buddy#' + data.username,
          };
          logIn(addedBuddy);
          console.log(addedBuddy);
        })}
      >
        <Text style={styles.signInText}>Sign in!</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  fieldBoxUsername: {
    width: width - 128,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 32,
    marginLeft: 64
  },
  usernameInput: {
    flex: 1,
    textAlignVertical: 'center',
    color: '#121212',
    backgroundColor: 'rgba(255,0,0,0)',
    fontSize: 16,
    marginLeft: 12,
    marginRight: 12
  },
  fieldBoxPassword: {
    width: width - 128,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 16,
    marginLeft: 64
  },
  passwordInput: {
    flex: 1,
    textAlignVertical: 'center',
    color: '#121212',
    backgroundColor: 'rgba(255,0,0,0)',
    fontSize: 16,
    marginLeft: 12,
    marginRight: 12
  },
  buttonSignIn: {
    position: "absolute",
    bottom: 0,
    width: width - 128,
    height: 61,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginBottom: 64,
    marginLeft: 64,
    alignContent: 'center',

  },
  signInText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'rgba(255,0,0,0)',
    color: 'rgba(255,255,255,1)',
    fontSize: 20,
  },
});

LoginForm.propTypes = {
  navigation: PropTypes.object,
};

export {LoginForm};
