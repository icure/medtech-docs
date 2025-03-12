# User API

In order to interact with the user, we will use the `UserApi`. This API will allow us to update the current user, manage
the delegations of our user and log out.

First step is to create the so called `UserApi` that will allow us to interact with the User API.

```typescript title="src/services/userApi.ts"
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {User} from '@icure/medical-device-sdk';
import {guard, medTechApi, currentUser, setUser} from './api';

export const userApiRtk = createApi({
    reducerPath: 'userApi',
    tagTypes: ['User'],
    baseQuery: fetchBaseQuery({
        baseUrl: '/rest/v1/user',
    }),
    endpoints: builder => ({
        shareDataWith: builder.mutation<User, { ids: string[] }>({
            async queryFn({ids}, {getState, dispatch}) {
                const {userApi} = await medTechApi(getState);
                return guard([userApi], async () => {
                    const updatedUser = await userApi.shareAllFutureDataWith(ids, 'medicalInformation');
                    dispatch(setUser({user: updatedUser.marshal() as User}));
                    return updatedUser;
                });
            },
            invalidatesTags: [{type: 'User', id: 'all'}],
        }),
        stopSharingWith: builder.mutation<User, { ids: string[] }>({
            async queryFn({ids}, {getState, dispatch}) {
                const {userApi} = await medTechApi(getState);
                return guard([userApi], async () => {
                    const updatedUser = await userApi.stopSharingDataWith(ids, 'medicalInformation');
                    dispatch(setUser({user: updatedUser.marshal() as User}));
                    return updatedUser;
                });
            },
            invalidatesTags: [{type: 'User', id: 'all'}],
        }),
    }),
});

export const {useCreateOrModifyUserMutation, useShareDataWithMutation, useStopSharingWithMutation} = userApiRtk;
```

Let's take a look at the `shareDataWith` endpoint will allow us to share the data of the current user with other users. We will use
the `UserApi` to share the data and then we will update the current user in the store.

:::caution

Sharing data with/Adding auto-delegations to other users is not retroactive. It means that if you share your data with
another user, the data that wasn't shared before will not be shared with the new user. It only concerns the data that
will be created after the sharing.

:::

```typescript title="src/services/userApi.ts"

export const userApiRtk = createApi({
    reducerPath: 'userApi',
    tagTypes: ['User'],
    baseQuery: fetchBaseQuery({
        baseUrl: '/rest/v1/user',
    }),
    endpoints: builder => ({
        shareDataWith: builder.mutation<User, { ids: string[] }>({
            async queryFn({ids}, {getState, dispatch}) {
                const {userApi} = await medTechApi(getState);
                return guard([userApi], async () => {
                    const updatedUser = await userApi.shareAllFutureDataWith(ids, 'medicalInformation');
                    dispatch(setUser({user: updatedUser.marshal() as User}));
                    return updatedUser;
                });
            },
            invalidatesTags: [{type: 'User', id: 'all'}],
        }),
        // ...
    }),
});
```

The `stopSharingWith` endpoint will allow us to stop sharing the data of the current user with other users. We will use
the `UserApi` to stop sharing the data and then we will update the current user in the store.

:::caution

Same principle for the `stopSharingWith` endpoint. It will only stop sharing the data that will be created after the
call.

:::

```typescript title="src/services/userApi.ts"

export const userApiRtk = createApi({
    reducerPath: 'userApi',
    tagTypes: ['User'],
    baseQuery: fetchBaseQuery({
        baseUrl: '/rest/v1/user',
    }),
    endpoints: builder => ({
        // ...
        stopSharingWith: builder.mutation<User, { ids: string[] }>({
            async queryFn({ids}, {getState, dispatch}) {
                const {userApi} = await medTechApi(getState);
                return guard([userApi], async () => {
                    const updatedUser = await userApi.stopSharingDataWith(ids, 'medicalInformation');
                    dispatch(setUser({user: updatedUser.marshal() as User}));
                    return updatedUser;
                });
            },
            invalidatesTags: [{type: 'User', id: 'all'}],
        }),
    }),
});
```

:::info

There's others way to share data with other users. You can check the [Sharing data](../../../how-to/how-to-share-data/index.md)
guide.

:::

## Store and reducer

Now that we have our `UserApi`, we will to add a store and a reducer to our app store and app reducer.

```typescript title="src/store.ts"
export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({serializableCheck: false, immutableCheck: false}).concat(
            thunk,
            dataSampleApiRtk.middleware,
            patientApiRtk.middleware,
            // highlight-next-line
            userApiRtk.middleware,
        ),
});
```

```typescript title="src/reducers.ts"
export const appReducer = combineReducers({
    petra: petra.reducer,
    medTechApi: api.reducer,
    dataSampleApi: dataSampleApiRtk.reducer,
    patientApi: patientApiRtk.reducer,
    // highlight-next-line
    userApi: userApiRtk.reducer,
});
```
