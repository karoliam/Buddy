/* eslint-disable spaced-comment */
/**
 * get register data from register forms
 ->username is also email
 ->to username add app tag
 * get full name and save in context for later json in media post
 */
/** Elikkäs mitä tämä hölmä paikka tekee
 * luo käyttäjän annetuilla arvoilla, username on sähköposti jonka eteen tulee appId joka on buddy ja se erotetaan sähköpostista # merkillä
 * kirjautuu bäkkäriin tiedoilla ja saa usertokenin sekä id:n (id ei ole tallentumassa atm mihinkään) sieltä
 * full name tallennetaan contextiin jota käytetään RegisterUserDataForm sisällä
 */
// TODO alerts don't show up at all
import React, {useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useLogin, useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {appId, kissalinkki} from '../utils/variables';

import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
let {width} = Dimensions.get('window');

const RegisterForm = () => {
  const {
    setFullName,
    fullName,
    user,
    setUser,
    showRegisterUserDataForm,
    setShowRegisterUserDataForm,
    setProfileDId,
  } = useContext(MainContext);
  const {postUser} = useUser();
  const {postTag} = useTag();
  const {postMedia} = useMedia();
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
      full_name: data.full_name,
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
      if (userData) {
        const userLoginData = await postLogin(loginCredentials);
        await AsyncStorage.setItem('userToken', userLoginData.token);
        //await AsyncStorage.setItem('userId', userLoginData.user_id);
        if ((await AsyncStorage.getItem('userToken')) != null) {
          // navigation.navigate('RegisterChecker', {name: 'RegisterChecker'}); // TODO fix navigation to userDataForm
          setUser(userLoginData.user);
          console.log('RegisterForm onSubmit ', userLoginData.user);
          setShowRegisterUserDataForm(!showRegisterUserDataForm);

          const profileData = new FormData();
          profileData.append('title', 'profile_data');
          profileData.append('file', {
            uri: kissalinkki,
            name: 'single_pixel.jpeg',
            type: 'image/jpeg',
          });
          const profileDataDescription = {
            full_name: data.fullName,
            age: '',
            location: '',
            bio: '',
          };
          profileData.append(
            'description',
            JSON.stringify(profileDataDescription)
          );
          const pData = await postMedia(userLoginData.token, profileData);
          //etsi userid tägiä varten
          const profileDataTag = {
            file_id: pData.file_id,
            tag: 'buddyprofile_Data' + userLoginData.user.user_id,
          };
          setProfileDId(pData.file_id);
          const dataTag = await postTag(userLoginData.token, profileDataTag);
          console.log(dataTag);
        }
      }
    } catch (error) {
      console.log('RegisterForm onSubmit ' + error);
    }
  };

  return (
    <View style={{flex: 1}}>
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
              style={styles.passwordCheckInputField}
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
  fullNameInputBox: {
    width: 285,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 8,
    marginLeft: width / 2 - 142.5,
  },
  fullNameInputField: {
    color: '#121212',
    height: 30,
    width: 260,
    lineHeight: 14,
    fontSize: 16,
    marginTop: 15,
    marginLeft: 12,
  },
  emailInputBox: {
    width: 285,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 16,
    marginLeft: width / 2 - 142.5,
  },
  emailInputField: {
    color: '#121212',
    height: 30,
    width: 260,
    lineHeight: 14,
    fontSize: 16,
    marginTop: 15,
    marginLeft: 12,
  },
  passwordInputBox: {
    width: 285,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 16,
    marginLeft: width / 2 - 142.5,
  },
  passwordInputField: {
    color: '#121212',
    height: 30,
    width: 260,
    lineHeight: 14,
    fontSize: 16,
    marginTop: 15,
    marginLeft: 12,
  },
  passwordCheckInputBox: {
    width: 285,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 16,
    marginLeft: width / 2 - 142.5,
  },
  passwordCheckInputField: {
    color: '#121212',
    height: 30,
    width: 260,
    lineHeight: 14,
    fontSize: 16,
    marginTop: 15,
    marginLeft: 12,
  },
  buttonSignUp: {
    position: 'absolute',
    bottom: 0,
    width: 285,
    height: 61,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginBottom: 32,
    marginLeft: width / 2 - 142.5,
  },
  signUpButtonText: {
    color: 'rgba(255,255,255,1)',
    height: 25,
    width: 70,
    fontSize: 20,
    marginTop: 14,
    marginLeft: 103,
  },
});

RegisterForm.propTypes = {
  navigation: PropTypes.object,
};

export default RegisterForm;
