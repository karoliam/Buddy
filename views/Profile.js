import React, {useContext} from 'react';
import {StyleSheet, SafeAreaView, Text, Button} from 'react-native';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image} from '@rneui/themed';

const Profile = () => {
  const {setIsLoggedIn} = useContext(MainContext);
  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image style={{width: 200, height: 200, backgroundColor: 'grey'}}></Image>
      <Image
        style={{
          width: 100,
          height: 100,
          borderRadius: 400 / 2,
          backgroundColor: 'red',
        }}
      />
      <Text>name</Text>
      <Text>bio</Text>
      <Text>location</Text>
      <Text>age</Text>
      <Button title={'Logout'} onPress={logout} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },
});

export default Profile;
