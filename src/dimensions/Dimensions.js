//Dimensions.js
import {Dimensions} from 'react-native';
const {height} = Dimensions.get('window');

const actualDimensions =  {
  height: height,
  width: "100%" 
};

export default actualDimensions;