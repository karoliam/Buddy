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
import React, {useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useLogin, useMedia, useTag, useUser} from '../hooks/ApiHooks';
import { appId, applicationTag, kissalinkki } from "../utils/variables";

import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
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
    defaultValues: {email: '', password: '', full_name: '', confirmPassword: ''},
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    console.log("tämmöstä koodii: ", data);
    let showAlert;
    let alertTitle;
    let alertMessage;
    if (data.full_name < 1) {
      alertTitle = 'Full name';
      alertMessage = 'Name is required!';
      showAlert = true;
    } else if (data.email.length < 1) {
      alertTitle = 'E-mail';
      alertMessage = 'E-mail is required!';
      showAlert = true;
    } else if (!data.email.match(/^[a-z0-9.]{1,128}@[a-z0-9.]{5,128}/i)) {
      alertTitle = 'E-mail';
      alertMessage = 'Must be valid E-mail!';
      showAlert = true;
    } else if (data.password.length < 1) {
      alertTitle = 'Password';
      alertMessage = 'Password is required!';
      showAlert = true;
    } else if (data.password.length < 5) {
      alertTitle = 'Password';
      alertMessage = 'Password min length is 5 characters!';
      showAlert = true;
    } else if (data.password !== data.confirmPassword) {
      alertTitle = 'Password';
      alertMessage = 'Passwords do not match!';
      showAlert = true;
    }
    if (showAlert === true) {
      Alert.alert(
        `${alertTitle}`,
        `${alertMessage}`,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: true })
    } else {
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
      const profileData = new FormData();
      profileData.append('title', 'profile_data');
      profileData.append('file', {
        uri: kissalinkki,
        name: 'single_pixel.jpeg',
        type: 'image/jpeg',
      });
      const profileDataDescription = {
        full_name: data.full_name,
        age: '',
        location: '',
        bio: '',
      };
      profileData.append('description', JSON.stringify(profileDataDescription));
      try {
        const userData = await postUser(registerCredentials);
        if (userData) {
          const userLoginData = await postLogin(loginCredentials);
          await AsyncStorage.setItem('userToken', userLoginData.token);
          //await AsyncStorage.setItem('userId', userLoginData.user_id);
          if ((await AsyncStorage.getItem('userToken')) != null) {
            // navigation.navigate('RegisterChecker', {name: 'RegisterChecker'}); // TODO fix navigation to userDataForm
            setUser(userLoginData.user);
            setShowRegisterUserDataForm(!showRegisterUserDataForm);
            console.log(userLoginData.user);
            const pData = await postMedia(userLoginData.token, profileData);
            //etsi userid tägiä varten
            const profileDataTag = {
              file_id: pData.file_id,
              tag: applicationTag + 'profile_data' + userLoginData.user.user_id,
            };
            setProfileDId(pData.file_id);
            const dataTag = await postTag(userLoginData.token, profileDataTag);
          }
        }
      } catch (error) {
        console.log('RegisterForm onSubmit ' + error);
      }
    }
  };

  return (
    <KeyboardAwareScrollView>
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
              // errorMessage={
              //   errors.full_name && <Text>{errors.full_name.message}</Text>
              // }
            />
          </View>
        )}
        name="full_name"
      />
      <Controller
        control={control}
        rules={{
          // required: {value: true, message: 'This is required.'},
          // pattern: {
          //   value: /^[a-z0-9.]{1,128}@[a-z0-9.]{5,128}/i,
          //   message: 'Must be valid email.',
          // },
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
              // errorMessage={errors.email && <Text>{errors.email.message}</Text>}
            />
          </View>
        )}
        name="email"
      />

      <Controller
        control={control}
        rules={{
          // required: {value: true, message: 'Required'},
          // minLength: {value: 5, message: 'Min length 5 chars.'},
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
              // errorMessage={
              //   errors.password && <Text>{errors.password.message}</Text>
              // }
            />
          </View>
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          // validate: (value) => {
          //   if (value === getValues('password')) {
          //     return true;
          //   } else {
          //     return 'Does not match to password.';
          //   }
          // },
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
              // errorMessage={
              //   errors.confirmPassword && (
              //     <Text>{errors.confirmPassword.message}</Text>
              //   )
              // }
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
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  fullNameInputBox: {
    width: width - 128,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 8,
    marginLeft: 64,
  },
  fullNameInputField: {
    flex: 1,
    textAlignVertical: 'center',
    color: '#121212',
    backgroundColor: 'rgba(255,0,0,0)',
    fontSize: 16,
    marginLeft: 12,
    marginRight: 12,
  },
  emailInputBox: {
    width: width - 128,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 16,
    marginLeft: 64,
  },
  emailInputField: {
    flex: 1,
    textAlignVertical: 'center',
    color: '#121212',
    backgroundColor: 'rgba(255,0,0,0)',
    fontSize: 16,
    marginLeft: 12,
    marginRight: 12,
  },
  passwordInputBox: {
    width: width - 128,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 16,
    marginLeft: 64,
  },
  passwordInputField: {
    flex: 1,
    textAlignVertical: 'center',
    color: '#121212',
    backgroundColor: 'rgba(255,0,0,0)',
    fontSize: 16,
    marginLeft: 12,
    marginRight: 12,
  },
  passwordCheckInputBox: {
    width: width - 128,
    height: 61,
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderColor: 'rgba(165,171,232,0.5)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 16,
    marginLeft: 64,
  },
  passwordCheckInputField: {
    flex: 1,
    textAlignVertical: 'center',
    color: '#121212',
    backgroundColor: 'rgba(255,0,0,0)',
    fontSize: 16,
    marginLeft: 12,
    marginRight: 12,
  },
  buttonSignUp: {
    width: width - 128,
    height: 61,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,1)',
    borderRadius: 14,
    borderStyle: 'solid',
    marginTop: 16,
    marginLeft: 64,
  },
  signUpButtonText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(255,255,255,1)',
    backgroundColor: 'rgba(255,0,0,0)',
    fontSize: 20,
    marginLeft: 12,
    marginRight: 12,
    marginTop: Platform.OS === 'ios' ? 14 : 0,
  },
});

RegisterForm.propTypes = {
  navigation: PropTypes.object,
};

export default RegisterForm;
