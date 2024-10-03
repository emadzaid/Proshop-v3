// Entry point of redux

import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import cartSliceReducer from './slices/cartSlice';
import authSliceReducer from './slices/authSlice';

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        cart: cartSliceReducer,
        auth: authSliceReducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
})

export default store;



// Redux Toolkit Notes

// 1- Configure Store (store.js file in frontend/src/store.js)
// 2- Provide the store to the entire app in main.jsx using <Provider store={store}>
// 3- Create Slices - Api Slice is going to be main slice using createAPI and provide baseQuery, tagTypes array, and endpoints: (builder) => ({})
// 4- Create proudctsSlice and use inject endpoints on apiSlice 
// 5- Create cartSlice 