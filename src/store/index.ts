import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
});

export const store = configureStore({
    reducer: rootReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;