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
let {height, width} = Dimensions.get('window')

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
          style={{flex: 1}}
        >
          <TouchableOpacity
            onPress={Keyboard.dismiss}
            activeOpacity={1}
            style={{flex: 1}}
          >
            <View style={styles.logoBackgroundStack}>
              <View
                source={require("../assets/blackBox.jpg")}
                style={styles.logoBackground}>
                <Image
                  source={require("../assets/buddyLogoNoBack.png")}
                  resizeMode="contain"
                  style={styles.imageLogoBuddy}
                />
              </View>
            </View>
            <View style={styles.loginFormContainer}>
              {showRegForm ? <RegisterForm /> : <LoginForm />}
            </View>
            <View style={styles.bottomLineAndSwitchContainer}>
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
            </View>
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
    bottom: 0,
    width: 286,
    height: 85,
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.65)",
    marginBottom: 32,
    marginLeft: (width/2) - 143
  },
  imageLogoBuddy: {
    top: -57,
    left: -9,
    width: 304,
    height: 200,
    position: "absolute",
  },
  logoBackgroundStack: {
    height: (height/100) * 30
  },
  loginFormContainer: {
    height: (height/100) * 55
  },
  bottomLineAndSwitchContainer: {
    height: (height/100) * 15
  },
  lineOrLeft: {
    width: 112,
    height: 2,
    backgroundColor: "rgba(255,255,255,1)",
    marginTop: 9
  },
  lineOrText: {
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
    marginTop: 8,
    marginLeft: (width/2) - 142.5,
    marginRight: (width/2) - 142.5
  },
  buttonSignUp: {
    width: 280,
    height: 50,
    flexDirection: "row",
    marginTop: 36,
    marginLeft: (width/2) - 140
  },
  dontHaveText: {
    textAlign: "right",
    paddingRight: 8,
    color: "rgba(255,255,255,1)",
    height: 30,
    width: 200,
    fontSize: 16
  },
  signUpText: {
    color: "rgba(255,153,0,1)",
    height: 30,
    width: 80,
    fontSize: 16
  },
  signUpTextContainer: {
    paddingTop: 12,
    flexDirection: "row",
  }
});

LoginMainViewContainer.propTypes = {
  navigation: PropTypes.object,
};

export default LoginMainViewContainer;
