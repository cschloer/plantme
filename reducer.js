import { combineReducers } from 'redux';
import loginReducer from './reducers/login';
import userPlantReducer from './reducers/userPlant';
import userPlantImageReducer from './reducers/userPlantImage';

import treeReducer from './reducers/tree';
import speciesReducer from './reducers/species';
import treeImageReducer from './reducers/treeImage';
import treeSpeciesVoteReducer from './reducers/treeSpeciesVote';
import postReducer from './reducers/post';

export default combineReducers({
  login: loginReducer,
  userPlant: userPlantReducer,
  userPlantImage: userPlantImageReducer,
  tree: treeReducer,
  species: speciesReducer,
  treeImage: treeImageReducer,
  treeSpeciesVote: treeSpeciesVoteReducer,
  post: postReducer,
});
