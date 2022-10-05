/**
 * täällä tapahtuu monenlaisia
 * haen profiilin kaikki media yhtenä pötkönä
 * erittelen median titlen mukaisesti kolmeen kategoriaan (näille vois tyylii tehä jonkun yhteisen muuttujan)
 * -> profile_pic on porfiilikuva
 * -> profile_background on profiilin taustakuva
 * -> profile_data on profiilin bio, ikä, nimi sekä sijainti
 *  HUOM enkelikissa on placeholderi
 */

import React, {useContext} from 'react';
import {View} from 'react-native';
import EditProfileForms from '../components/EditProfileForms';

import ProfileForms from '../components/ProfileForms';
import {MainContext} from '../context/MainContext';

const Profile = () => {
  const {showEditProfile} = useContext(MainContext);
  return <>{showEditProfile ? <EditProfileForms /> : <ProfileForms />}</>;
};

export default Profile;
