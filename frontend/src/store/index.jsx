// src/store/index.js

import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Domyślne storage (localStorage)
import { combineReducers } from 'redux';
import userReducer from './userReducer';

const persistConfig = {
  key: 'root', // klucz, który będziemy używać w localStorage
  storage, // storage z redux-persist
};

const rootReducer = combineReducers({
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
