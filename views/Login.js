import React, {useContext, useEffect} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet, Text, TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import {LoginForm} from '../components/LoginForm';
let {height, width} = Dimensions.get('window')

const Login = () => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();

  const checkToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      if (userToken != null) {
        const userData = await getUserByToken(userToken);
        setIsLoggedIn(true);
        setUser(userData);
      }
    } catch (error) {
      console.error('login - checkToken', error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/buddyAlt.png")}
        resizeMode="cover"
        style={styles.backGroundImage}
        imageStyle={styles.backGroundImage_imageStyle}
      >
        <View style={styles.logoBackgroundStack}>
          <View style={styles.logoBackground}></View>
          <Image
            source={require("../assets/buddyLogoNoBack.png")}
            resizeMode="contain"
            style={styles.imageLogoBuddy}
          ></Image>
        </View>
        <View style={styles.loginFormContainer}>
          <LoginForm></LoginForm>
        </View>
        <View style={styles.lineOrContainer}>
          <View style={styles.lineOrLeft}></View>
          <Text style={styles.lineOrText}>OR</Text>
          <View style={styles.lineOrRight}></View>
        </View>
        <TouchableOpacity style={styles.buttonSignUp}>
          <View style={styles.signUpTextContainer}>
            <Text style={styles.dontHaveText}>
              Don&#39;t have an account?
            </Text>
            <Text style={styles.signUpText}>Sign Up</Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    backgroundColor: "rgba(4,4,4,0.65)"
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
    width: 380,
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

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
