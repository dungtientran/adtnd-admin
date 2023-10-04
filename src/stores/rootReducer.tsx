import { combineReducers } from '@reduxjs/toolkit';

import globalReducer from './global.store';
import tagsViewReducer from './tags-view.store';
import userReducer from './user.store';
import subscriptionsStore from './subscriptions.store';

const rootReducer = combineReducers({
  user: userReducer,
  subsciptions: subscriptionsStore,
  tagsView: tagsViewReducer,
  global: globalReducer,
});

export default rootReducer;
