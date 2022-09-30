/* eslint-disable spaced-comment */
/** Elikkäs mitä tämä hölmä paikka tekee
 * luo käyttäjän annetuilla arvoilla, username on sähköposti jonka eteen tulee appId joka on buddy ja se erotetaan sähköpostista # merkillä
 * kirjautuu bäkkäriin tiedoilla ja saa usertokenin sekä id:n (id ei ole tallentumassa atm mihinkään) sieltä
 * full name tallennetaan contextiin jota käytetään RegisterUserDataForm sisällä

 */

import React, {useContext} from 'react';
import {Text, View, Button} from 'react-native';
import {useForm, Controller} from 'react-hook-form';

import {Card} from '@rneui/themed';
import {Input} from '@rneui/base';
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
      setFullName(data.full_name);
      const userData = await postUser(registerCredentials);
      if (userData) {
        const userLoginData = await postLogin(loginCredentials);
        await AsyncStorage.setItem('userToken', userLoginData.token);
        //await AsyncStorage.setItem('userId', userLoginData.user_id);
        if ((await AsyncStorage.getItem('userToken')) != null) {
          navigation.navigate('RegisterUserDataForm');
        }
      }
    } catch (error) {
      console.log('RegisterForm onSubmit ' + error);
    }
  };

  return (
    <View>
      <View style={{width: 300, marginTop: 60}}>
        <Card.Title style={{fontSize: 20}}>Register</Card.Title>
        <Card.Divider />

        <Controller
          control={control}
          rules={{}}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Full name"
              autoCapitalize="none"
              errorMessage={
                errors.full_name && <Text>{errors.full_name.message}</Text>
              }
            />
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
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Email"
              autoCapitalize="none"
              errorMessage={errors.email && <Text>{errors.email.message}</Text>}
            />
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
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
              placeholder="Password"
              errorMessage={
                errors.password && <Text>{errors.password.message}</Text>
              }
            />
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
            <Input
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
          )}
          name="confirmPassword"
        />
        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      </View>
      <Button
        title="To login page"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

export default RegisterForm;
