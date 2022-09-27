/**
 * get register data from register forms
    ->username is also email
    ->to username add app tag

 * get full name and save in context for later for json in media post
 
 */

import {useContext, useState} from 'react';
import {Text, View, Button} from 'react-native';
import {useForm, Controller} from 'react-hook-form';

import {Card} from '@rneui/themed';
import { Input } from '@rneui/base';
import { MainContext } from '../contexts/MainContext';

const RegisterForm = () => {
  const {fullName, setFullName} = useContext(MainContext);
  const [count, setCount] = useState(0);
  const {
    control,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {email: '', password: '', full_name: ''},
    mode: 'onBlur',
  });
  
  const onSubmit = async () =>{
    try {
      setFullName('test')
      console.log(fullName);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={{width:300, marginTop:60}}>
        <Card.Title style={{fontSize: 20}}>Register</Card.Title>
        <Card.Divider />


<Controller
        control={control}
        rules={{
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Full name"
            autoCapitalize="none"
            errorMessage={errors.full_name && <Text>{errors.full_name.message}</Text>}
          />
        )}
        name="full_name"
      />
<Controller
        control={control}
        rules={{
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
  );
};

export default RegisterForm;
