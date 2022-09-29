import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import {MainContext} from '../context/MainContext';
import {useLogin} from '../hooks/ApiHooks';
let {height, width} = Dimensions.get('window');

const LoginForm = () => {
  const {isLoggedIn, setIsLoggedIn, setUser} = useContext(MainContext);
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
  const logIn = async (loginCredentials) => {
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
        undefined);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity
        onPress={Keyboard.dismiss}
        style={{flex: 1}}
        activeOpacity={1}
      >
        <Controller
          control={control}
          rules={{
            minLength: 3,
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={styles.fieldBoxUsername}>
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                placeholder="username"
                required
                style={styles.usernameInput}
              />
            </View>
          )}
          name="username"
        />
        {errors.username?.type === 'required' && <Text>This is required.</Text>}
        {errors.username?.type === 'minLength' && <Text>Min 3 chars!</Text>}

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
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  fieldBoxUsername: {
    width: 285,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 30,
    marginLeft: width / 2 - 142.5,
  },
  usernameInput: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    height: 21,
    width: 260,
    fontSize: 16,
    marginTop: 20,
    marginLeft: 13,
  },
  fieldBoxPassword: {
    width: 285,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 22,
    marginLeft: width / 2 - 142.5,
  },
  passwordInput: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    height: 21,
    width: 260,
    lineHeight: 14,
    fontSize: 16,
    marginTop: 19,
    marginLeft: 12,
  },
  buttonSignIn: {
    width: 285,
    height: 61,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 59,
    marginLeft: width / 2 - 142.5,
  },
  signInText: {
    fontFamily: 'roboto-regular',
    color: 'rgba(255,255,255,1)',
    height: 25,
    width: 70,
    fontSize: 20,
    marginTop: 14,
    marginLeft: 103,
  },
});
export {LoginForm};
