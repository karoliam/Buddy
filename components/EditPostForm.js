import {Input, Button, Text, Card} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {Alert, View} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../context/MainContext';
import {mediaUrl} from '../utils/variables';
import SelectList from 'react-native-dropdown-select-list';
import cityNames from '../utils/cityNames';

const EditPostForm = ({navigation, route}) => {
  const paramsObject = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const {putMedia, deleteMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const [city, setCity] = useState('');
  const cityData = cityNames;
  const paramsObjectDescription = JSON.parse(paramsObject.description);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      location: paramsObjectDescription.location,
      when: paramsObjectDescription.when,
      writePost: paramsObjectDescription.writePost,
      title: 'feedPost',
    },
  });


  const updatePost = async (data) => {
    setIsLoading(true);
    delete data.title;
    const stringData = JSON.stringify(data);
    const descriptionString = "description";
    const doubleStringData = JSON.stringify(stringData);
    const finalData = ('{"' + descriptionString + '"' + ':' + doubleStringData + '}');
      console.log('tuosa', finalData);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await putMedia(token, finalData, paramsObject.file_id);
      console.log('response', response);
      Alert.alert(response.message, '', [
        {
          text: 'Ok',
          onPress: () => {
            setUpdate(!update);
             navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error('onSubmit modify file failed', error);
      Alert.alert('Editing failed', 'Try again', [
        {
          text: 'Ok'
        }
      ])
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (e) => {
    console.log(cityData[e].value);
    setCity(cityData[e].value);
  };

  const deletePost = () => {
    const deleting = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        await deleteMedia(token, paramsObject.file_id);
      } catch (error) {
        console.log('deleting error', error);
      }
    }
         Alert.alert('Are you sure?', 'Do you want to delete your post?', [
      {
        text: 'Yes, delete',
        onPress: () => {
          deleting();
          Alert.alert('Deleted successfully!', '', [
            {
              text: 'Ok',
              onPress:() => {
                setUpdate(!update);
              }
            }
          ]);
           navigation.navigate('Home');
        },
      },
      { text: "Cancel", onPress: () => console.log('cancel pressed') }
    ]);
  }

  useEffect(() => {
  }, [update]);

  return (
    <Card>
      <Card.Image source={{uri: mediaUrl + paramsObject.filename}} />
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <View>
            <SelectList
              setSelected={handleSelect}
              data={cityData}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              search={false}
              // placeholder={paramsObjectDescription.location}
            />
          </View>
        )}
        name="location"
      />

      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            // placeholder={paramsObjectDescription.when}
          />
        )}
        name="when"
      />
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            // placeholder={paramsObjectDescription.writePost}
          />
        )}
        name="writePost"
      />

      <Button
        title="Update"
        loading={isLoading}
        onPress={handleSubmit(updatePost)}
      />
      <Button
      title='Delete'
      onPress={handleSubmit(deletePost)}></Button>
    </Card>
  );
};

EditPostForm.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default EditPostForm;
