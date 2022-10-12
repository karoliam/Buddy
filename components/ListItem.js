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
const {height, width} = Dimensions.get('window');
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
const ListItem = ({singleMedia, navigation}) => {
  // console.log('tässä singlemedia', singleMedia);
  // console.log('tossa ois description', singleMedia.description);
  const {getFilesByTag} = useTag();
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

  useEffect(() => {
    getProfileData(singleMedia.user_id);
  }, []);

  const data = JSON.parse(singleMedia.description);
  const {location, when, writePost} = data;
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
    top: 16,
    right: 16,
    fontSize: 20,
  },
  postTopRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 255, 0,0)',
    width: width - 64,
    height: 64,
  },
  postTimeLocationRow: {
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
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
