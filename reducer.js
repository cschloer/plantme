import { combineReducers } from 'redux';
import loginReducer from './reducers/login';
import userPlantReducer from './reducers/userPlant';
import userPlantImageReducer from './reducers/userPlantImage';

import treeReducer from './reducers/tree';

export default combineReducers({
  login: loginReducer,
  userPlant: userPlantReducer,
  userPlantImage: userPlantImageReducer,
  tree: treeReducer,
});
