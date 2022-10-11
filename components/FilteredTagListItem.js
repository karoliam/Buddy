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

const {height, width} = Dimensions.get('window');

const FilteredTagListItem = ({singleMedia}) => {
  // const tagText = singleMedia.tag.substring((applicationTag+'post_tag').length,singleMedia.tag.length);
  console.log('FilteredTagListItem: ', singleMedia);
  const tagText = singleMedia.value;
  return (
    <TouchableOpacity style={styles.tagBox}>
      <Text style={styles.tagText}>{tagText}</Text>
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
    padding: 3,
    backgroundColor: "rgba(165,171,232,0.5)",
    borderRadius: 16
  },
  tagText: {
    backgroundColor: 'rgba(0,255,255,0)',
    color: "rgba(0,0,0,1)",
    fontSize: 14,

  },
});

FilteredTagListItem.propTypes = {
  singleMedia: PropTypes.object,
};

export default FilteredTagListItem;
