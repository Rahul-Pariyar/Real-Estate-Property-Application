import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage as default
import authReducer from '../features/auth/authSlice.js';

const persistConfig = {
  key: 'root',
  storage, // default storage is localStorage, but we could choose sessionStorage or another
  whitelist: ['isLogged',], // Persist only 'auth' slice (we'll control which parts of state persist)
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer, // persisted auth slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck:{
        ignoreActions:['persist/PERSIST','persist/REHYDRATE'],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };