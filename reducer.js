import { combineReducers } from 'redux';
import loginReducer from './reducers/login';
import userPlantReducer from './reducers/userPlant';
import userPlantImageReducer from './reducers/userPlantImage';

export default combineReducers({
  login: loginReducer,
  userPlant: userPlantReducer,
  userPlantImage: userPlantImageReducer,
});
