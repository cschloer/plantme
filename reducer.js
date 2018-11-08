import { combineReducers } from 'redux';
import loginReducer from './reducers/login';

export default combineReducers({
  login: loginReducer, 
})
