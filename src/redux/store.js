import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './slices/courseSlice';

const store = configureStore({
    reducer: {
        course: courseReducer,
    },
});

export default store;
