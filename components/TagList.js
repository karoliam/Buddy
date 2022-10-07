import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {FlatList} from 'react-native-gesture-handler';
import {useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';

const TagList = () => {
  const {getAllTags} = useTag();
  const [listOfTags, setListOfTags] = useState();

  const getTags = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const allTags = await getAllTags(token);
      const mappedList = allTags.map(item => item.tag);
      const filteredList = mappedList.filter(item => item.startsWith('buddytag'));
      const buddyRemoved = filteredList.map((item) => item.split('buddytag'));
      setListOfTags(buddyRemoved.reverse());
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
