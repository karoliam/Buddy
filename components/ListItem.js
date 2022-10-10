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
import {useTag} from '../hooks/ApiHooks';
import { MainContext } from "../context/MainContext";
import List from "./List";
import PostTagList from "./PostTagList";
const {height, width} = Dimensions.get('window');

const ListItem = ({singleMedia, navigation}) => {
  const {postFileId, setPostFileId} = useContext(MainContext);
  // console.log('tässä singlemedia', singleMedia);
  // console.log('tossa ois description', singleMedia.description);
  const {getFilesByTag, getTagsByFileId} = useTag();
  const [posterAvatar, setPosterAvatar] = useState('');
  const [posterName, setPosterName] = useState('');
  console.log('sinkku media: ', singleMedia.file_id)
  setPostFileId(singleMedia.file_id);
  const getProfileData = async (user_id) => {
    try {
      const profilePicTag = await getFilesByTag(applicationTag + 'profile_pic' + user_id);
      console.log('profilePicTag ', profilePicTag);
      console.log('profilePicTag0 ', mediaUrl + profilePicTag[0].filename);
      if (profilePicTag[0].filename != undefined) {
        setPosterAvatar(mediaUrl + profilePicTag[0].filename);
      }
      const profileDataTag = await getFilesByTag(
        applicationTag + 'profile_data' + user_id
      );
      console.log('profileDataTag ', profileDataTag);
      console.log('profileDataTag0 ', (JSON.parse(profileDataTag[0].description).full_name));
      if (profileDataTag[0].description != undefined) {
        setPosterName(JSON.parse(profileDataTag[0].description).full_name);
      }
    } catch (error) {
      console.log('List.js getProfileData ' + error);
    }
  };

  const getPostTagsData = async (file_id) => {
    try {
      console.log('sinkku media file_id & context id: ', {postFileId});
      const postTagsArray = await getTagsByFileId(file_id);
      console.log('sinkku media tagArray: ', postTagsArray);
      const postFilteringTags = [];
      for (const postTagsArrayKey in postTagsArray) {
        if (postTagsArray[postTagsArrayKey].tag.includes(applicationTag + 'post_tag')) {
          console.log('tag content: ', postTagsArray[postTagsArrayKey]);
          postFilteringTags.push(postTagsArray[postTagsArrayKey]);
        }
      }
      console.log('postFilteringTagsContent: ', postFilteringTags);
      singleMedia.filter_tags = postFilteringTags;
      console.log('adding to media: ', singleMedia);
    } catch (error) {
    console.log('List.js getProfileData ' + error);
    }
  };
  // const passToPostTagList = {singleMedia};

  useEffect(() => {
    getProfileData(singleMedia.user_id);
    getPostTagsData(singleMedia.file_id);
  }, []);

  const data = JSON.parse(singleMedia.description);
  const {location, when, writePost} = data;
  console.log('tilte',singleMedia.title);
  //console.log('here is data', JSON.parse(singleMedia));
  return (
    <TouchableOpacity
      style={styles.touchable}
      onPress={() => {
        navigation.navigate('Single', singleMedia);
      }}
    >
      {singleMedia.title === 'feedPost' ? (
        <Image
          style={styles.image}
          source={{
            uri: mediaUrl + singleMedia.thumbnails.w160,
          }}
        />
      ) : (
        <Text></Text>
      )}
      <View style={styles.postTopRow}>
        <View style={styles.userAvatarContainer}>
          <Image
            style={styles.userAvatarImage}
            source={{
            uri: posterAvatar,
            }}/>
        </View>
        <View style={styles.tagsScroll}>
          <PostTagList singleMedia={singleMedia}></PostTagList>
        </View>
        {/* <Text style={styles.posterNameText}>{posterName}</Text> */}
      </View>
      <View style={styles.postTimeLocationRow}>
        <Text style={styles.whenText}>When</Text>
        <Text style={styles.whenTimeText}>{when}</Text>
        <Text style={styles.locationText}>{location}</Text>
      </View>
      <View style={styles.postMessageTextBox}>
        <Text style={styles.postMessageText}
        numberOfLines={0}>{writePost}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 32,
    width: width - 64,
    backgroundColor: "rgba(165, 171, 232,0.13)",
    borderRadius: 8,
  },
  image: {
    width: width - 64,
    height: 0.75 * (width - 64),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  userAvatarContainer: {
    marginRight: 8,
    left: 16,
    top: 8,
    width: 52,
    height: 52,
    backgroundColor: "rgba(0, 255, 0,0.3)",
    borderRadius: 100
  },
  userAvatarImage: {
    width: 52,
    height: 52,
    borderRadius: 100
  },
  posterNameText: {
    position: 'absolute',
    top: 16,
    right: 16,
    fontSize: 20,
  },
  postTopRow: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 255, 0,0)",
    width: width - 64,
    height: 64,
  },
  tagsScroll: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'row',
    backgroundColor: "rgba(255, 0, 255,0)",

  },
  postTimeLocationRow: {
    width: width - 64,
    height: 32,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 255,0)",
  },
  whenText: {
    marginLeft: 16,
    marginRight: 8,
    height: 32,
    textAlign: 'left',
    fontSize: 16,
    paddingTop: 4
  },
  whenTimeText: {
    height: 32,
    fontSize: 16,
    paddingTop: 4,
  },
  locationText: {
    position: 'absolute',
    right: 16,
    height: 32,
    fontSize: 16,
    paddingTop: 4,
    color: "rgba(0, 0, 0,0.5)",
  },
  postMessageTextBox: {
    marginTop: 8,
    marginBottom: 32,
  },
  postMessageText: {
    width: width - 64,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "rgba(0, 255, 0,0)",

  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
