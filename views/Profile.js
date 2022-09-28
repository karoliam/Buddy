import React from 'react';
import {StyleSheet, SafeAreaView, Text} from 'react-native';

// KAIKKI TÄÄLLÄ ON VAIN PLACEHOLDERIA JOKA KORVATAAN OIKEALLA KOODILLA JOSSAIN VAIHEESSA

const Profile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
});

export default Profile;
