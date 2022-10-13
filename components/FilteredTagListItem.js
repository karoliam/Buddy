import { applicationTag, mediaUrl } from "../utils/variables";
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions, ScrollView
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../context/MainContext";


const {height, width} = Dimensions.get('window');

const FilteredTagListItem = ({singleMedia}) => {
  const [isActive, setIsActive] = useState(false);
  const [localLock, setlocalLock] = useState(false);
  const {
    update,
    setUpdate,
    filterTags,
    setFilterTags,
    filterLock,
    setFilterLock,
  } = useContext(MainContext);

  const handleClick = () => {
    if (isActive === false && filterLock === false) {
      setIsActive(true);
      setFilterTags(singleMedia.key);
      setFilterLock(true);
      setlocalLock(filterLock);
    } else if (isActive === true) {
      setIsActive(false);
      setFilterTags(null);
      setFilterLock(false);
      setlocalLock(filterLock);
    }
    setUpdate(!update);
    console.log('potaattipataatti', filterTags)
  };


  // const tagText = singleMedia.tag.substring((applicationTag+'post_tag').length,singleMedia.tag.length);
  console.log('FilteredTagListItem: ', singleMedia);
  const tagText = singleMedia.value;
  return (
    <TouchableOpacity
      onPress={handleClick}
      style={isActive ? styles.tagBoxOn : filterLock ? styles.tagBoxLocked : styles.tagBox }>
      <Text style={isActive ? styles.tagText : filterLock ? styles.tagTextLock : styles.tagText }>{tagText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tagBox: {
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 4,
    marginRight: 8,
    top: 4,
    left: 7,
    alignSelf: 'flex-start',
    padding: 5,
    backgroundColor: "rgba(165,171,232,0.5)",
    borderRadius: 16
  },
  tagBoxOn: {
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 4,
    marginRight: 8,
    top: 4,
    left: 7,
    alignSelf: 'flex-start',
    padding: 5,
    backgroundColor: "rgba(165,171,232,1)",
    borderRadius: 16
  },
  tagBoxLocked: {
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 4,
    marginRight: 8,
    top: 4,
    left: 7,
    alignSelf: 'flex-start',
    padding: 5,
    backgroundColor: "rgba(165,171,232,0.01)",
    borderRadius: 16
  },
  tagText: {
    backgroundColor: 'rgba(0,255,255,0)',
    color: "rgba(0,0,0,1)",
    fontSize: 18,
  },
  tagTextLock: {
    backgroundColor: 'rgba(0,255,255,0)',
    color: "rgba(0,0,0,0.1)",
    fontSize: 18,
  },
});

FilteredTagListItem.propTypes = {
  singleMedia: PropTypes.object,
};

export default FilteredTagListItem;