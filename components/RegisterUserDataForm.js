import { View } from "react-native";

const RegisterUserDataForm = () =>{


  return (
    <View>
      {image && (
        <Image source={{uri: image}} style={{width: 400, height: 400}} />
      )}
    </View>
  );
}



export default RegisterUserDataForm;
