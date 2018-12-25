import { combineReducers } from 'redux';
import loginReducer from './reducers/login';
import userPlantReducer from './reducers/user_plant';

export default combineReducers({
  login: loginReducer,
  userPlant: userPlantReducer,
});
