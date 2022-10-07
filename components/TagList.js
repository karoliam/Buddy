import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {FlatList} from 'react-native-gesture-handler';
import {useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../context/MainContext';

const TagList = ({navigation}) => {
  const {getAllTags} = useTag();
  const {listOfTags,setListOfTags} = useContext(MainContext);

  const getTags = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const allTags = await getAllTags(token);

      const mappedList = allTags.map(item => item.tag);
      const filteredList = mappedList.filter(item => item.startsWith('buddytag'));
      const buddyRemoved = filteredList.map((item) => item.split('buddytag'));
      const hyphensRemoved = buddyRemoved.flat().filter(item => item !== "");

      const getOccurrence = (array, value) => {
        let count = 0;
        array.forEach((v) => (v === value && count++));
        return count;
    }
      const countedArray = hyphensRemoved.filter(item => getOccurrence(hyphensRemoved, item) > 3)
      let unique = [...new Set(countedArray)];
      console.log('counted', countedArray)
      setListOfTags(unique.reverse());
    } catch (error) {
      console.log('getTags error', error);
    }
  };
  useEffect(() => {
    getTags();
  }, []);
  return (
    <FlatList
      style={{height: 70}}
      horizontal={true}
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
            justifyContent: 'center',
          }}
          onPress={() => navigation.navigate('TagView')}
        >
          <Text style={{alignSelf: 'center'}}>{item}</Text>
        </TouchableOpacity>
      )}
    ></FlatList>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

TagList.propTypes = {
  navigation: PropTypes.object,
};

export default TagList;
