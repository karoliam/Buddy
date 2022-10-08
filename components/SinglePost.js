import {
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity, StyleSheet, View, Dimensions
} from "react-native";
import {mediaUrl} from '../utils/variables';
import {Button, Image} from '@rneui/themed';
import {useRoute} from '@react-navigation/native';
import {useUser} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../context/MainContext';
import PropTypes from 'prop-types';
const {height, width} = Dimensions.get('window');

const SinglePost = ({navigation, route}) => {
  // const route = useRoute();
  const {filename, title, description, user_id, file_id} = route.params;
  const [userFullName, setUserFullName] = useState('');
  const descriptionObject = JSON.parse(description);
  const {getUserById} = useUser();
  const {user, showEditPost, setShowEditPost, update, setUpdate} = useContext(MainContext);

  const paramsObject = {
    filename: filename,
    title: title,
    description: description,
    user_id: user_id,
    file_id: file_id,
  };
  console.log('params', paramsObject);
  const getFullName = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await getUserById(token, user_id);
      //console.log('userData', userData);
      const fullName = userData.full_name;
      setUserFullName(fullName);
    } catch (error) {
      console.log('getFullName error', error);
    }
  };
  getFullName(descriptionObject.token);

  console.log('current user', user.user_id, 'post user', user_id);
  const showEditPostFunction = () => {
    if (user_id !== user.user_id) {
      setShowEditPost(false);
    } else {
      setShowEditPost(true);
    }
  }


  useEffect(() => {
    showEditPostFunction()
  }, [update]);


  return (
    <View style={styles.container}>
      <View style={styles.postImageContainer}>
        <Image
          source={{uri: mediaUrl + filename}}
          PlaceholderContent={<ActivityIndicator />}
          style={styles.postImage}
        />
      </View>
      <View style={styles.postEditDeleteRow}>
        <View style={styles.postEditIconContainer}>
          {showEditPost ? (
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                navigation.navigate('EditPost', paramsObject);
              }}
            >
              <Text>edit</Text>
            </TouchableOpacity>
          ) : (
            <Text></Text>
          )}
        </View>
      </View>
      <View style={styles.postTopRow}>
        <Text style={styles.posterNameText}>{userFullName}</Text>
      </View>
      <View style={styles.postTextRow}>
        <View style={styles.userAvatarContainer}>

        </View>
        <Text style={styles.postText}>{descriptionObject.writePost}</Text>
      </View>
      <View style={styles.postLocationTimeRow}>
        <Text>{descriptionObject.when}</Text>
        <Text>{descriptionObject.location}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,0,0,0.3)'
  },
  postImageContainer: {
    width: width - 64,
    marginLeft: 32,
    height: 0.75 * (width - 64),
    borderRadius: 8,
  },
  postImage: {
    width: width - 64,
    height: 0.75 * (width - 64),
    borderRadius: 8,
  },
  postEditIconContainer: {
    height: 22,
    width: 22,
    top: 2,
    left: 16,
    marginRight: 8,
    backgroundColor: "rgba(255, 0, 255,0.3)",
  },
  postEditDeleteRow: {
    width: width - 64,
    height: 26,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 0,0.3)",
    marginLeft: 32,

  },
  posterNameText: {
    top: 0,
    left: 0,
    fontSize: 20,
  },
  postTopRow: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 255, 0,0.3)",
    width: width - 64,
    height: 32,
    marginLeft: 32,
  },
  userAvatarContainer: {
    left: 0,
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
  postText: {
    left: 8,
    fontSize: 16,
    width: width - 124,
    backgroundColor: "rgba(0, 255, 255,0.3)",
  },
  postTextRow: {
    flexDirection: 'row',
    backgroundColor: "rgba(255, 255, 0,0.3)",
    width: width - 64,
    marginLeft: 32,
  },
  postLocationTimeRow: {
    flexDirection: 'row',
    backgroundColor: "rgba(0, 0, 255,0.3)",
    width: width - 64,
    height: 26,
    marginLeft: 32,
  },
});

SinglePost.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default SinglePost;
