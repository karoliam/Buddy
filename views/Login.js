import React, {useContext, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import {LoginForm} from '../components/LoginForm';

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
      <LoginForm></LoginForm>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;

// import React, { Component } from "react";
// import {
//   Dimensions,
//   Image,
//   ImageBackground,
//   StyleSheet,
//   Text, TextInput, TouchableOpacity,
//   View,
// } from 'react-native';
// import {StatusBar} from 'expo-status-bar';
// let {height, width} = Dimensions.get('window')
//
// const App = () => {
//   return (
//     <>
//       <View style={styles.container}>
//         <ImageBackground
//           source={require("./assets/buddyAlt.png")}
//           resizeMode="cover"
//           style={styles.image3}
//           imageStyle={styles.image3_imageStyle}
//         >
//           <View style={styles.rect2Stack}>
//             <View style={styles.rect2}></View>
//             <Image
//               source={require("./assets/buddyLogoNoBack.png")}
//               resizeMode="contain"
//               style={styles.image4}
//             ></Image>
//           </View>
//           <View style={styles.rect}>
//             <TextInput placeholder="E-mail" style={styles.email}></TextInput>
//           </View>
//           <View style={styles.rect3}>
//             <TextInput placeholder="Password" style={styles.password}></TextInput>
//           </View>
//           <TouchableOpacity style={styles.button}>
//             <Text style={styles.logIn}>Log In</Text>
//           </TouchableOpacity>
//           <View style={styles.rect5Row}>
//             <View style={styles.rect5}></View>
//             <Text style={styles.or2}>OR</Text>
//             <View style={styles.rect4}></View>
//           </View>
//           <TouchableOpacity style={styles.button2}>
//             <View style={styles.dontHaveStaticRow}>
//               <Text style={styles.dontHaveStatic}>
//                 Don&#39;t have an account?
//               </Text>
//               <Text style={styles.signUp}>Sign Up</Text>
//             </View>
//           </TouchableOpacity>
//         </ImageBackground>
//       </View>
//     </>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1
//   },
//   image3: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   image3_imageStyle: {},
//   rect2: {
//     top: 58,
//     left: 10,
//     width: 286,
//     height: 85,
//     position: "absolute",
//     backgroundColor: "rgba(4,4,4,0.65)"
//   },
//   image4: {
//     top: 0,
//     left: 0,
//     width: 304,
//     height: 200,
//     position: "absolute"
//   },
//   rect2Stack: {
//     width: 304,
//     height: 200,
//     marginTop: 71,
//     marginLeft: (width/2) - 152
//   },
//   rect: {
//     width: 285,
//     height: 61,
//     backgroundColor: "rgba(255,255,255,1)",
//     borderWidth: 2,
//     borderColor: "rgba(165,171,232,1)",
//     borderRadius: 14,
//     borderStyle: "solid",
//     marginTop: 74,
//     marginLeft: (width/2) - 142.5
//   },
//   email: {
//     fontFamily: "roboto-regular",
//     color: "#121212",
//     height: 21,
//     width: 260,
//     fontSize: 16,
//     marginTop: 20,
//     marginLeft: 13
//   },
//   rect3: {
//     width: 285,
//     height: 61,
//     backgroundColor: "rgba(255,255,255,1)",
//     borderWidth: 2,
//     borderColor: "rgba(165,171,232,1)",
//     borderRadius: 14,
//     borderStyle: "solid",
//     marginTop: 22,
//     marginLeft: (width/2) - 142.5
//   },
//   password: {
//     fontFamily: "roboto-regular",
//     color: "#121212",
//     height: 21,
//     width: 260,
//     lineHeight: 14,
//     fontSize: 16,
//     marginTop: 19,
//     marginLeft: 12
//   },
//   button: {
//     width: 285,
//     height: 61,
//     backgroundColor: "rgba(0,0,0,0.65)",
//     borderWidth: 2,
//     borderColor: "rgba(255,255,255,1)",
//     borderRadius: 14,
//     borderStyle: "solid",
//     marginTop: 59,
//     marginLeft: (width/2) - 142.5
//   },
//   logIn: {
//     fontFamily: "roboto-regular",
//     color: "rgba(255,255,255,1)",
//     height: 25,
//     width: 58,
//     fontSize: 20,
//     marginTop: 14,
//     marginLeft: 115
//   },
//   rect5: {
//     width: 112,
//     height: 2,
//     backgroundColor: "rgba(255,255,255,1)",
//     marginTop: 9
//   },
//   or2: {
//     fontFamily: "roboto-regular",
//     color: "rgba(255,255,255,1)",
//     height: 17,
//     width: 34,
//     textAlign: "center",
//     fontSize: 16,
//     marginLeft: 13
//   },
//   rect4: {
//     width: 112,
//     height: 2,
//     backgroundColor: "rgba(255,255,255,1)",
//     marginLeft: 14,
//     marginTop: 9
//   },
//   rect5Row: {
//     height: 17,
//     flexDirection: "row",
//     marginTop: 52,
//     marginLeft: (width/2) - 142.5,
//     marginRight: (width/2) - 142.5
//   },
//   button2: {
//     width: 236,
//     height: 41,
//     backgroundColor: "rgba(230,230, 230,0)",
//     flexDirection: "row",
//     marginTop: 36,
//     marginLeft: (width/2) - 118
//   },
//   dontHaveStatic: {
//     fontFamily: "roboto-regular",
//     color: "rgba(255,255,255,1)",
//     height: 22,
//     width: 176,
//     fontSize: 16
//   },
//   signUp: {
//     fontFamily: "roboto-regular",
//     color: "rgba(255,153,0,1)",
//     height: 22,
//     width: 58,
//     fontSize: 16
//   },
//   dontHaveStaticRow: {
//     height: 16,
//     flexDirection: "row",
//     flex: 1,
//     marginLeft: 2,
//     marginTop: 12
//   }
// });
//
// export default App;
