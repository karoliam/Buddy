import {FlatList, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {useContext, useState} from 'react';
import {MainContext} from '../context/MainContext';

const TagViewList = ({navigation, route}) => {
  const {listOfTags, update, setUpdate} = useContext(MainContext);

  const onClick = (item) => {
    navigation.navigate('FilteredFeed', item);
    setUpdate(!update);
  }

  return (
    <FlatList
      style={{height: 70}}
      data={listOfTags}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <TouchableOpacity
          style={{
            backgroundColor: 'pink',
            padding: 10,
            flexGrow: 1,
            borderRadius: 8,
            marginLeft: 8,
            height: 40,
            margin: 8,
            justifyContent: 'center',
          }}
          onPress={() => onClick(item)}
        >
          <Text style={{alignSelf: 'center'}}>{item}</Text>
        </TouchableOpacity>
      )}
    ></FlatList>
  );
};

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});

TagViewList.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default TagViewList;
