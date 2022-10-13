import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import { useContext, useEffect } from "react";
import {MainContext} from '../context/MainContext';
import PostTagListItem from "./PostTagListItem";

const PostTagList = ({singleMedia}) => {
  // const {update} = useContext(MainContext);
  let tagsArray = [];
  console.log('PostTagList id', singleMedia.filter_tags);
  if (singleMedia.filter_tags !== undefined) {
    tagsArray = singleMedia.filter_tags;
  }
  return (
    <FlatList
      style={{flexDirection: 'row'}}
      data={tagsArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <PostTagListItem singleMedia={item} />
      )}
    />
  );
};
PostTagList.propTypes = {
  singleMedia: PropTypes.object,
};

export default PostTagList;