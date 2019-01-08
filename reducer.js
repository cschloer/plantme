import { combineReducers } from 'redux';
import loginReducer from './reducers/login';
import userPlantReducer from './reducers/userPlant';
import userPlantImageReducer from './reducers/userPlantImage';

import treeReducer from './reducers/tree';
import speciesReducer from './reducers/species';
import treeImageReducer from './reducers/treeImage';

export default combineReducers({
  login: loginReducer,
  userPlant: userPlantReducer,
  userPlantImage: userPlantImageReducer,
  tree: treeReducer,
  species: speciesReducer,
  treeImage: treeImageReducer,
});
