import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Button,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {MainContext} from '../context/MainContext';
import {useLogin} from '../hooks/ApiHooks';

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
      Alert.alert('Try again', 'E-mail or password wrong', [], undefined);
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
        <Text>Login Form</Text>
        <Controller
          control={control}
          rules={{
            minLength: 3,
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              placeholder="username"
              required
            />
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
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
              placeholder="password"
            />
          )}
          name="password"
        />
        <Button
          title="Sign in!"
          onPress={handleSubmit((data) => {
            console.log(data);
            const addedBuddy = {
              password: data.password,
              username: 'buddy#' + data.username,
            };
            logIn(addedBuddy);
            console.log(addedBuddy);
          })}
        />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export {LoginForm};
