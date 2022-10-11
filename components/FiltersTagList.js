import {FlatList} from 'react-native';
import { useTag } from "../hooks/ApiHooks";
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from "react";
import {MainContext} from '../context/MainContext';
import PostTagListItem from "./PostTagListItem";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { applicationTag } from "../utils/variables";
import FilteredTagListItem from "./FilteredTagListItem";

const FiltersTagList = ({}) => {
  const {getAllTags} = useTag();
  const [listOfTags,setListOfTags] = useState();
  const getTags = async (listOfTags) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const allTags = await getAllTags(token);

      const mappedList = allTags.map(item => item.tag);
      const filteredList = [...new Set(mappedList.filter(item => item.startsWith(applicationTag + 'post_tag')))];
      const appIdsRemoved = [];
      for (const filteredListKey in filteredList) {
        const tagPair = {};
        tagPair.key = filteredList[filteredListKey];
        tagPair.value = filteredList[filteredListKey].substring((applicationTag+'post_tag').length,filteredList[filteredListKey].length);
        appIdsRemoved.push(tagPair);
        setListOfTags(appIdsRemoved);
      }
    } catch (error) {
      console.log('getTags error', error);
    }
  };

  useEffect(() => {
     getTags(listOfTags);
  }, []);
  console.log('FilterTagList id', listOfTags );

  // <View style={{flex: 1, backgroundColor: "rgba(0, 255, 255,0.2)", }}></View>
  return (
    <FlatList
      style={{flexDirection: 'row', flex:1, backgroundColor: "rgba(0,0,232,0.5)" }}
      horizontal={true}
      data={listOfTags}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <FilteredTagListItem singleMedia={item} />
      )}
    />
  );
};
// FiltersTagList.propTypes = {
//   singleMedia: PropTypes.object,
// };

export default FiltersTagList;
