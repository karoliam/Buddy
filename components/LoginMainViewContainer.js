import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ImageBackground,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {LoginForm} from './LoginForm';
import RegisterForm from './RegisterForm';
let {width} = Dimensions.get('window')

const LoginMainViewContainer = () => {
  const [showRegForm, setShowRegForm] = useState(false);
  const [showLoginText, setShowLoginText] = useState(false);
  const [showLoginText2, setShowLoginText2] = useState(false);
  const loginText11 = 'Don\'t have an account?';
  const loginText12 = 'Do You have an account?';
  const loginText21 = 'Sign Up';
  const loginText22 = 'Login';

  return (
      <ImageBackground
        source={require("../assets/buddyAlt.png")}
        resizeMode="cover"
        style={styles.backGroundImage}
        imageStyle={styles.backGroundImage_imageStyle}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity
            onPress={Keyboard.dismiss}
            activeOpacity={1}
          >
            <View style={styles.logoBackgroundStack}>
              <View source={require("../assets/blackBox.jpg")}
                style={styles.logoBackground}></View>
              <Image
                source={require("../assets/buddyLogoNoBack.png")}
                resizeMode="contain"
                style={styles.imageLogoBuddy}
              ></Image>
            </View>
            <View style={styles.loginFormContainer}>
              {showRegForm ? <RegisterForm /> : <LoginForm />}
            </View>
            <View style={styles.lineOrContainer}>
              <View style={styles.lineOrLeft}></View>
              <Text style={styles.lineOrText}>OR</Text>
              <View style={styles.lineOrRight}></View>
            </View>
            <TouchableOpacity
              style={styles.buttonSignUp}
              onPress={() => {
                setShowRegForm(!showRegForm);
                setShowLoginText(!showLoginText);
                setShowLoginText2(!showLoginText2);
              }}
            >
              <View style={styles.signUpTextContainer}>
                <Text style={styles.dontHaveText}>
                  {showLoginText ? loginText12 : loginText11}
                </Text>
                <Text style={styles.signUpText}>{showLoginText ? loginText22 : loginText21}</Text>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backGroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  backGroundImage_imageStyle: {},
  logoBackground: {
    top: 58,
    left: 10,
    width: 286,
    height: 85,
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  imageLogoBuddy: {
    top: 0,
    left: 0,
    width: 304,
    height: 200,
    position: "absolute"
  },
  logoBackgroundStack: {
    width: 304,
    height: 200,
    marginTop: 0,
    marginLeft: (width/2) - 152
  },
  loginFormContainer: {
    height: 300,
  },
  lineOrLeft: {
    width: 112,
    height: 2,
    backgroundColor: "rgba(255,255,255,1)",
    marginTop: 9
  },
  lineOrText: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    height: 17,
    width: 34,
    textAlign: "center",
    fontSize: 16,
    marginLeft: 13
  },
  lineOrRight: {
    width: 112,
    height: 2,
    backgroundColor: "rgba(255,255,255,1)",
    marginLeft: 14,
    marginTop: 9
  },
  lineOrContainer: {
    height: 17,
    flexDirection: "row",
    marginTop: 40,
    marginLeft: (width/2) - 142.5,
    marginRight: (width/2) - 142.5
  },
  buttonSignUp: {
    width: 236,
    height: 41,
    backgroundColor: "rgba(230,230, 230,0)",
    flexDirection: "row",
    marginTop: 36,
    marginLeft: (width/2) - 118
  },
  dontHaveText: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    height: 22,
    width: 176,
    fontSize: 16
  },
  signUpText: {
    fontFamily: "roboto-regular",
    color: "rgba(255,153,0,1)",
    height: 22,
    width: 58,
    fontSize: 16
  },
  signUpTextContainer: {
    height: 16,
    flexDirection: "row",
    flex: 1,
    marginLeft: 2,
    marginTop: 12
  }
});

LoginMainViewContainer.propTypes = {
  navigation: PropTypes.object,
};

export default LoginMainViewContainer;
