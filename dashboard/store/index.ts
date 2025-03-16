import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { weatherApi } from './api/weatherApi';
import { newsApi } from './api/newsApi';
import { financeApi } from './api/financeApi';
import { geoDbApi } from './api/geoDbApi'; // Add this
import { githubApi } from './api/githubApi';
import notificationReducer from "./notificationSlice"

export const store = configureStore({
  reducer: {
    [weatherApi.reducerPath]: weatherApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [financeApi.reducerPath]: financeApi.reducer,
    [geoDbApi.reducerPath]: geoDbApi.reducer, // Add this
    [githubApi.reducerPath]: githubApi.reducer,
    notifications: notificationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      weatherApi.middleware,
      newsApi.middleware,
      financeApi.middleware,
      geoDbApi.middleware, // Add this
      githubApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;