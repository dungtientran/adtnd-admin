import { combineReducers } from '@reduxjs/toolkit';

import globalReducer from './global.store';
import tagsViewReducer from './tags-view.store';
import userReducer from './user.store';
import subscriptionsStore from './subscriptions.store';
import groupsStore from './group/groups.store';

const rootReducer = combineReducers({
  user: userReducer,
  group: groupsStore,
  subsciptions: subscriptionsStore,
  tagsView: tagsViewReducer,
  global: globalReducer,
});

export default rootReducer;
