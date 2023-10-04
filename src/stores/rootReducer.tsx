import { combineReducers } from '@reduxjs/toolkit';

import globalReducer from './global.store';
import sockReducer from './reducers/stock.store';
import tagsViewReducer from './tags-view.store';
import userReducer from './user.store';

const rootReducer = combineReducers({
  user: userReducer,
  tagsView: tagsViewReducer,
  global: globalReducer,
  stocks: sockReducer,
});

export default rootReducer;
