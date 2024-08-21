import { configureStore } from "@reduxjs/toolkit";
import Modal from "./Modal";
import loginReducer from "./loginSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { createTransform } from "redux-persist";

// Create a transform to handle non-serializable values
const nonSerializableTransform = createTransform(
  (inboundState) => {
    // Transform the state before it is saved to storage
    return inboundState;
  },
  (outboundState) => {
    // Transform the state when it is rehydrated
    return outboundState;
  },
  { whitelist: ["login"] } // Apply this transform only to the login state
);

const persistConfig = {
  key: "root",
  storage,
  transforms: [nonSerializableTransform], // Add the transform here
};

const persistedLoginReducer = persistReducer(persistConfig, loginReducer);

const store = configureStore({
  reducer: {
    modal: Modal,
    login: persistedLoginReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // Ignore the persist action
        ignoredPaths: ["login"], // Ignore the login state for serialization checks
      },
    }),
});

export const persistor = persistStore(store);
export default store;
