import {applicationTag, kissalinkki, mediaUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  LogBox,
} from 'react-native';
import {useEffect, useState} from 'react';
import {useTag} from '../hooks/ApiHooks';
import moment from 'moment';
import PostTagList from "./PostTagList";
const {height, width} = Dimensions.get('window');
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const ListItem = ({singleMedia, navigation}) => {
  // console.log('tässä singlemedia', singleMedia);
  // console.log('tossa ois description', singleMedia.description);
  const {getFilesByTag, getTagsByFileId} = useTag();
  const [posterAvatar, setPosterAvatar] = useState('');
  const [posterName, setPosterName] = useState('');
  const getProfileData = async (user_id) => {
    try {
      const profilePicTag = await getFilesByTag(
        applicationTag + 'profile_pic' + user_id
      );

      if (profilePicTag[0].filename != undefined) {
        setPosterAvatar(mediaUrl + profilePicTag[0].filename);
      }
      const profileDataTag = await getFilesByTag(
        applicationTag + 'profile_data' + user_id
      );
      if (profileDataTag[0].description != undefined) {
        setPosterName(JSON.parse(profileDataTag[0].description).full_name);
      }
    } catch (error) {
      console.log('List.js getProfileData ' + error);
    }
  };

  const getPostTagsData = async (file_id) => {
    try {
      console.log('sinkku media file_id & context id: ', file_id);
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

  // useEffect(() => {
  getProfileData(singleMedia.user_id);
  getPostTagsData(singleMedia.file_id);
  // }, []);

  const data = JSON.parse(singleMedia.description);
  const {location, when, writePost} = data;
  //console.log('here is data', JSON.parse(singleMedia));
  return (
    <TouchableOpacity
      style={[styles.touchable]}
      onPress={() => {
        navigation.navigate('Single', singleMedia);
      }}
    >
      {singleMedia.title === 'feedPost' ? (
        <Image
          style={styles.image}
          source={
            singleMedia
              ? {
                uri: mediaUrl + singleMedia.thumbnails.w160,
              }
              : {
                uri: kissalinkki,
              }
          }
        />
      ) : (
        <Text></Text>
      )}
      <View style={styles.postTopRow}>
        <View style={styles.userAvatarContainer}>
          <Image
            style={styles.userAvatarImage}
            source={
              posterAvatar
                ? {
                  uri: posterAvatar,
                }
                : {uri: kissalinkki}
            }
          />
        </View>
        <Text style={styles.posterNameText}>{posterName}</Text>
        <Text style={styles.timeText}>{
          moment(singleMedia.time_added).utcOffset('+0300').startOf('minute').fromNow()}</Text>
      </View>
      <View style={styles.postTimeLocationRow}>
        <Text style={styles.whenText}>When</Text>
        <Text style={styles.whenTimeText}>{when}</Text>
        <Text style={styles.locationText}>{location}</Text>
      </View>
      <View style={styles.postMessageTextBox}>
        <Text style={styles.postMessageText} numberOfLines={0}>
          {writePost}
        </Text>
      </View>
      <View style={styles.tagsScroll}>
        <PostTagList singleMedia={singleMedia}></PostTagList>
      </View>
      <Text></Text>
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
    backgroundColor: 'rgba(165, 171, 232,0.13)',
    borderRadius: 8,
  },
  image: {
    width: width - 64,
    height: 0.75 * (width - 64),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  userAvatarContainer: {
    left: 16,
    top: 8,
    width: 52,
    height: 52,
    backgroundColor: 'rgba(0, 255, 0,0.3)',
    borderRadius: 100,
  },
  userAvatarImage: {
    width: 52,
    height: 52,
    borderRadius: 100,
  },
  posterNameText: {
    position: 'absolute',
    marginLeft: 74,
    marginTop: 14,
    fontSize: 16,
    color: "rgba(0, 0, 0,0.5)"
  },
  tagsScroll: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'row',
    backgroundColor: "rgba(255, 0, 255,0.1)",
  },
  postTopRow: {
    flexDirection: "row",
    backgroundColor: "#00ff0000",
    width: width - 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  postTimeLocationRow: {
    marginTop: 8,
    width: width - 64,
    height: 32,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 255,0)',
  },
  whenText: {
    marginLeft: 16,
    marginRight: 8,
    height: 32,
    textAlign: 'left',
    fontSize: 16,
    paddingTop: 4,
    fontWeight: 'bold',
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
    color: 'rgba(0, 0, 0,0.5)',
  },
  postMessageTextBox: {
    marginTop: 8,
    marginBottom: 32,
  },
  postMessageText: {
    width: width - 64,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: 'rgba(0, 255, 0,0)',
  },
  timeText: {
    marginRight: 16,
    color: 'rgba(0, 0, 0,0.5)'

  }

});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
