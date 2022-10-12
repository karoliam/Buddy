import {
  Dimensions,
  Platform,
  SafeAreaView, ScrollView,
  StyleSheet, Text,
  TouchableOpacity,
  View
} from "react-native";
import PropTypes from 'prop-types';
import List from '../components/List';
import {useContext} from 'react';
import {MainContext} from '../context/MainContext';
import { Image } from "@rneui/themed";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import FiltersTagList from "../components/FiltersTagList";
let {height, width} = Dimensions.get('window');

const Home = (props) => {
  const {navigation} = props;
  const {isLoggedIn} = useContext(MainContext);

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Image
            source={require("../assets/buddyBlack.png")}
            resizeMode="contain"
            style={styles.buddyLogo}
          ></Image>
          <TouchableOpacity style={styles.searchIcon}>
            <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" size={32}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messagesIcon}>
            <FontAwesomeIcon icon="fa-solid fa-comment" size={32}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profilePicture}></TouchableOpacity>
        </View>
        <View style={styles.topNavigationBorder}></View>
        <View style={styles.filtersTextRow}>
          <Text style={styles.filtersText}>Filters</Text>
          <View style={styles.locationTextStack}>
            <Text style={styles.locationText}>Espoo</Text>
            <TouchableOpacity style={styles.locationChevron}>
              <FontAwesomeIcon icon="fa-solid fa-chevron-down" size={32}/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.filtersView}>
          <FiltersTagList></FiltersTagList>
        </View>
        <Text style={styles.exploreText}>Explore</Text>
        <ScrollView>
          <List navigation={navigation}></List>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    backgroundColor: "rgba(255, 255, 255,1)",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255,1)",
  },
  buddyLogo: {
    backgroundColor: "rgba(255, 0, 255,0)",
    width: 90,
    height: 59
  },
  searchIcon: {
    backgroundColor: "rgba(255, 0, 255,0)",
    position: 'absolute',
    right: 128,
    width: 32,
    height: 32,
    marginLeft: 87,
    marginTop: 13
  },
  messagesIcon: {
    backgroundColor: "rgba(255, 0, 255,0)",
    position: 'absolute',
    right: 64,
    width: 31,
    height: 31,
    marginLeft: 29,
    marginTop: 14
  },
  profilePicture: {
    position: 'absolute',
    right: 0,
    width: 40,
    height: 40,
    backgroundColor: "rgba(166,166,166,1)",
    borderRadius: 100,
    marginLeft: 21,
    marginTop: 10
  },
  topRow: {
    backgroundColor: "rgba(255, 0, 255,0)",
    height: 59,
    flexDirection: "row",
    marginTop: 8,
    marginLeft: 20,
    marginRight: 25
  },
  topNavigationBorder: {
    width: width - 32,
    height: 2,
    backgroundColor: "rgba(165,171,232,0.5)",
    marginTop: 3,
    alignSelf: "center"
  },
  filtersText: {
    backgroundColor: "rgba(255, 0, 255,0)",
    color: "#121212",
    height: 28,
    width: 90,
    fontSize: 20
  },
  locationText: {
    backgroundColor: "rgba(255, 0, 255,0)",
    top: 0,
    left: 0,
    position: "absolute",
    color: "#121212",
    height: 28,
    width: 90,
    fontSize: 20
  },
  locationChevron: {
    backgroundColor: "rgba(255, 0, 255,0)",
    top: 0,
    left: 65,
    width: 31,
    height: 31,
    position: "absolute",
  },
  locationTextStack: {
    backgroundColor: "rgba(255, 0, 255,0)",
    width: 96,
    height: 31,
    marginLeft: 155
  },
  filtersTextRow: {
    backgroundColor: "rgba(255, 0, 255,0)",
    height: 31,
    flexDirection: "row",
    marginTop: 7,
    marginLeft: 20,
    marginRight: 14
  },
  filtersView: {
    flexDirection: 'row',
    backgroundColor: "rgba(255, 0, 255,0)",
    height: 74,
    width: width - 32,
    marginLeft: 16,
  },
  exploreText: {
    backgroundColor: "rgba(255, 0, 255,0)",
    color: "#121212",
    height: 28,
    width: 90,
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 8
  }
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
