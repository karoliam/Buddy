// import {useContext, useState} from "react";
// import {Text, View} from "react-native";
// import {TouchableOpacity} from "react-native-gesture-handler";
// import {MainContext} from "../context/MainContext";

// const Filtering = () => {
//   const {update} = useContext(MainContext);
//   // const filtering = async () => {
//   //   try {
//   //     const json = await useTag().getFilesByTag(item);
//   //     json.reverse();
//   //     const allTagData = json.map(async (tagItem) => {
//   //       return await doFetch(apiUrl + 'media/' + tagItem.file_id);
//   //     });
//   //     setTagArray(await Promise.all(allTagData));
//   //   } catch (error) {
//   //     console.log('tag fetch failed', error);
//   //   }
//   // }
//   // useEffect(() => {
//   //   getTags();
//   // }, []);

//   return (
//     <TouchableOpacity
//       onPress={() => {
//         navigation.navigate('Single', singleMedia);
//       }}
//     >
//       <Text>Yay</Text>
//     </TouchableOpacity>
//   );
// };


// // ListItem.propTypes = {
// //   singleMedia: PropTypes.object,
// //   navigation: PropTypes.object,
// //   route: PropTypes.object,
// // };

// export default Filtering;
