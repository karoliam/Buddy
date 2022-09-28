/* eslint-disable no-undef */
import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

import RegisterForm from '../components/RegisterForm';

const RegisterChecker = () => {
  return (
    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      style={{flex: 1}}
      activeOpacity={1}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'padding' : 'height'}
      >
        <View>
          <RegisterForm />
        </View>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

export default RegisterChecker;
