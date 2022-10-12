/**
 * Tähän Containeriin nestataan LoginForm.js ja RegisterForm.js
 */
import React, {useState} from 'react';
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
let {height, width} = Dimensions.get('window');

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
      source={require("../assets/images/buddybackgroundNew.png")}
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
          <View style={styles.bottomTextContainer}>
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
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backGroundImage: {
    width: width,
    height: 1.1 * height,
    flex: 1,
    justifyContent: 'center',
  },
  backGroundImage_imageStyle: {},
  logoBackground: {
    bottom: 0,
    width: width - 126,
    height: 85,
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.65)",
    marginBottom: 32,
    marginLeft: 63,
    justifyContent: 'center'
  },
  imageLogoBuddy: {
    width: width - 107,
    height: width - 211,
    position: "absolute",
    alignSelf: 'center'
  },
  logoBackgroundStack: {
    height: 0.3 * height
  },
  loginFormContainer: {
    height: 0.5 * height
  },
  bottomLineAndSwitchContainer: {
    height: 0.2 * height
  },
  lineOrLeft: {
    width: width - 301,
    height: 2,
    backgroundColor: "rgba(255,255,255,1)",
    marginTop: 9
  },
  lineOrText: {
    color: "rgba(255,255,255,1)",
    width: 34,
    textAlign: "center",
    fontSize: 16,
    marginLeft: 14
  },
  // 112
  lineOrRight: {
    width: width - 301,
    height: 2,
    backgroundColor: "rgba(255,255,255,1)",
    marginLeft: 14,
    marginTop: 9,
  },
  lineOrContainer: {
    backgroundColor: "rgba(255,0,0,0)",
    width: width - 128,
    height: 17,
    flexDirection: "row",
    marginTop: 8,
    // marginLeft: 64,
    alignSelf: 'center'
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
    fontSize: 16,
    right: 16

  },
  signUpText: {
    color: "rgba(255,153,0,1)",
    height: 30,
    width: 80,
    fontSize: 16,
    right: 16
  },
  signUpTextContainer: {
    paddingTop: 12,
    flexDirection: "row",
  },
  bottomTextContainer: {
    marginLeft:20
  }

});

LoginMainViewContainer.propTypes = {
  navigation: PropTypes.object,
};

export default LoginMainViewContainer;
