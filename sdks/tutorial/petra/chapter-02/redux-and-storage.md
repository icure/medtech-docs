# Redux and local storage

In this section, we will see how to use Redux to query and mutate the data and local storage to store the keys of our patients.

One of the key features of iCure is that it allows you to store data in a secure way. This means that you can store data in a way that only the user can access it. This is done by encrypting the data with the user's public key. This way, only the user can decrypt the data with his private key.

And to keep this key private, we will store it in the local storage of the device.

:::info
iCure MedTech SDK allows you to redefine how the keys will be stored, by default the implementation of the SDK uses the local storage of the browser. Since we are using React Native, there's no implementation of local storage, so we will need to implement it ourselves using [MMKV](https://github.com/Tencent/MMKV) and provide this custom implementation to the SDK. 
:::

## Custom implementation of the key storage

As we said, we will use MMKV to store the keys. We will create a class that will implement the `StorageFacade` interface from the SDK.
    
```typescript title="/utils/storage.ts"
import {StorageFacade} from '@icure/medical-device-sdk';
import {MMKV} from 'react-native-mmkv';

export class AsyncStorageImpl implements StorageFacade<string> {
  storage = new MMKV();
  setItem = (key: string, value: string) => {
    return new Promise(resolve => resolve(this.storage.set(key, value))) as Promise<void>;
  };
  getItem = (key: string) => {
    return new Promise(resolve => resolve(this.storage.getString(key))) as Promise<string | undefined>;
  };
  removeItem = (key: string) => {
    return new Promise(resolve => resolve(this.storage.delete(key))) as Promise<void>;
  };
}

export default new AsyncStorageImpl();
```

Keep this class warm, we will need it for the persistor of Redux and the instantiation of the `MedTechApi`.

## Redux initialization

### State of the application

We will start by creating a "root" level state that will keep the user credentials to make it possible to query data on our API.

```typescript title="/config/PetraState.ts"
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import storage from '../utils/storage';

// Configuration object for data persistence with Redux Persist
export const persistConfig = {
  key: 'petra',
  storage: storage,
  whitelist: ['petra'],
};

export interface PetraState {
  cache: string;
  savedCredentials?: {
    tokenTimestamp: number;
    login: string;
    token: string;
  };
}

const initialState = {} as PetraState;

export const petra = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSavedCredentials(state, {payload: savedCredentials}: PayloadAction<{login: string; token: string; tokenTimestamp: number} | undefined>) {
      state.savedCredentials = savedCredentials;
    },
    revertAll() {
      return initialState;
    },
  },
});

export const {setSavedCredentials, revertAll} = petra.actions;
```

### Reducer

One of the first principle of Redux is to have a single source of truth. This means that the state of the application should be stored in a single place. This is done by using a reducer. A reducer is a function that takes the current state and an action as parameters and returns the new state of the application.

So let's create a reducer that will combine all the reducers of the application.

```typescript title="/redux/reducer.ts"
import {combineReducers} from '@reduxjs/toolkit';
import {persistConfig, petra} from '../config/PetraState';
import {persistReducer} from 'redux-persist';

export const appReducer = combineReducers({
    petra: petra.reducer,
});

export const persistedReducer = persistReducer(persistConfig, appReducer);

export type AppState = ReturnType<typeof appReducer>;
```

### Store

The store is the object that will hold the state of the application. It will be used by the components of the application to access the state and dispatch actions.

```typescript title="/redux/store.ts"
import {configureStore} from '@reduxjs/toolkit';
import {persistedReducer} from './reducer';
import {persistStore} from 'redux-persist';
import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false, immutableCheck: false}).concat(
      thunk,
    ),
});
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
```

### Hooks

To make it easier to access the state of the application, we will create some hooks that will return the state and the dispatch function.

```typescript title="/redux/hooks.ts"
import {AppDispatch} from './store';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppState} from './reducer';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
```

## Provider

Now that we have our store, we need to provide it to the components of the application. This is done by using a provider.

```typescript title="/App.tsx"
// ...
// highlight-start
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { Text } from 'react-native';
// highlight-end

// ...

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: '#FFFDFE',
    flex: 1,
  };

  return (
    // highlight-start
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<Text>Loading...</Text>}>
    // highlight-end
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
          <Router />
        </ScrollView>
    // highlight-start
      </PersistGate>
    </Provider>
    // highlight-end
  );
};

export default App;
```
