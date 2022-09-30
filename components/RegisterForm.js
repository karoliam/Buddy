/* eslint-disable spaced-comment */
/**
 * get register data from register forms
 ->username is also email
 ->to username add app tag
 * get full name and save in context for later json in media post
 */

import React, {useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useLogin, useUser} from '../hooks/ApiHooks';
import {appId} from '../utils/variables';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterForm = ({navigation}) => {
  const {setFullName} = useContext(MainContext);
  const {postUser} = useUser();
  const {postLogin} = useLogin();
  const {
    control,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {email: '', password: '', full_name: ''},
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    setFullName(data.full_name);
    const registerCredentials = {
      username: appId + data.email,
      password: data.password,
      email: data.email,
    };
    const loginCredentials = {
      username: appId + data.email,
      password: data.password,
    };
    try {
      console.log(registerCredentials);
      setFullName(data.full_name);
      const userData = await postUser(registerCredentials);
      console.log(userData.message);
      console.log('reg');
    } catch (error) {
      console.log('RegisterForm onSubmit ' + error);
    }
  };

  return (
    <View>
      <Controller
        control={control}
        rules={{}}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.fullNameInputBox}>
            <TextInput
              style={styles.fullNameInputField}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Full name"
              autoCapitalize="none"
              errorMessage={
                errors.full_name && <Text>{errors.full_name.message}</Text>
              }
            />
          </View>
        )}
        name="full_name"
      />
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          pattern: {
            value: /^[a-z0-9.]{1,128}@[a-z0-9.]{5,128}/i,
            message: 'Must be valid email.',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.emailInputBox}>
            <TextInput
              style={styles.emailInputField}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Email"
              autoCapitalize="none"
              errorMessage={errors.email && <Text>{errors.email.message}</Text>}
            />
          </View>
        )}
        name="email"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Required'},
          minLength: {value: 5, message: 'Min length 5 chars.'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.passwordInputBox}>
            <TextInput
              style={styles.passwordInputField}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
              placeholder="Password"
              errorMessage={
                errors.password && <Text>{errors.password.message}</Text>
              }
            />
          </View>
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          validate: (value) => {
            if (value === getValues('password')) {
              return true;
            } else {
              return 'Does not match to password.';
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.passwordCheckInputBox}>
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
              placeholder="Confirm password"
              errorMessage={
                errors.confirmPassword && (
                  <Text>{errors.confirmPassword.message}</Text>
                )
              }
            />
          </View>
        )}
        name="confirmPassword"
      />
      <TouchableOpacity
        style={styles.buttonSignUp}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.signUpButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  registerFormContainer: {
    top: 0,
    left: 0,
    width: 375,
    height: 415,
    position: "absolute",
    backgroundColor: "rgba(230,230, 230,1)",
    opacity: 0
  },
  fullNameInputBox: {
    top: 13,
    left: 45,
    width: 285,
    height: 61,
    position: "absolute",
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 2,
    borderColor: "rgba(165,171,232,1)",
    borderRadius: 14,
    borderStyle: "solid"
  },
  fullNameInputField: {
    fontFamily: "roboto-regular",
    color: "#121212",
    height: 21,
    width: 260,
    fontSize: 16,
    lineHeight: 16,
    marginTop: 20,
    marginLeft: 13
  },
  emailInputBox: {
    top: 94,
    left: 46,
    width: 285,
    height: 61,
    position: "absolute",
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 2,
    borderColor: "rgba(165,171,232,1)",
    borderRadius: 14,
    borderStyle: "solid"
  },
  emailInputField: {
    fontFamily: "roboto-regular",
    color: "#121212",
    height: 21,
    width: 260,
    lineHeight: 16,
    fontSize: 16,
    marginTop: 19,
    marginLeft: 12
  },
  passwordInputBox: {
    top: 174,
    left: 45,
    width: 285,
    height: 61,
    position: "absolute",
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 2,
    borderColor: "rgba(165,171,232,1)",
    borderRadius: 14,
    borderStyle: "solid"
  },
  passwordInputField: {
    fontFamily: "roboto-regular",
    color: "#121212",
    height: 21,
    width: 260,
    lineHeight: 14,
    fontSize: 16,
    marginTop: 20,
    marginLeft: 12
  },
  passwordCheckInputBox: {
    width: 285,
    height: 61,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 2,
    borderColor: "rgba(165,171,232,1)",
    borderRadius: 14,
    borderStyle: "solid",
    marginTop: 254,
    marginLeft: 45
  },
  passwordCheckInputField: {
    fontFamily: "roboto-regular",
    color: "#121212",
    height: 21,
    width: 260,
    lineHeight: 14,
    fontSize: 16,
    marginTop: 20,
    marginLeft: 12
  },
  buttonSignUp: {
    top: 355,
    left: 46,
    width: 285,
    height: 61,
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.65)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,1)",
    borderRadius: 14,
    borderStyle: "solid"
  },
  signUpButtonText: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    height: 25,
    width: 75,
    fontSize: 20,
    marginTop: 5,
    marginLeft: 105
  },
  registerFormContainerStack: {
    width: 375,
    height: 416,
    marginTop: 1
  },
});

export default RegisterForm;