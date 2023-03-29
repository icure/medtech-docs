# Healthcare Professional API

We will use the `healthcareProfessionalApi` to fetch the list of HealthcareProfessional and to share our data with them. We will also use it to fetch HealthcareProfessional that have access to our data.

```typescript title="src/services/healthcareProfessionalApi.ts"
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {guard, medTechApi} from './api';
import {HealthcareProfessional, HealthcareProfessionalFilter} from '@icure/medical-device-sdk';

export const healthcareProfessionalApiRtk = createApi({
    reducerPath: 'healthcareProfessionalApi',
    tagTypes: ['hcp'],
    baseQuery: fetchBaseQuery({
        baseUrl: '/rest/v1/healthcareProfessional',
    }),
    endpoints: builder => ({
        filterHealthcareProfessionals: builder.query<HealthcareProfessional[], { name: string }>({
            async queryFn({name}, {getState}) {
                const {healthcareProfessionalApi} = await medTechApi(getState);
                return guard([healthcareProfessionalApi], async () => {
                    return (
                        await healthcareProfessionalApi.filterHealthcareProfessionalBy(
                            await new HealthcareProfessionalFilter()
                                .byMatches(
                                    name
                                        .toLowerCase()
                                        .normalize('NFD')
                                        .replace(/[ \t\u0300-\u036f]/g, ''),
                                )
                                .build(),
                        )
                    ).rows;
                });
            },
        }),
        getHealthcareProfessional: builder.query<HealthcareProfessional, string>({
            async queryFn(id, {getState}) {
                const {healthcareProfessionalApi} = await medTechApi(getState);
                return guard([healthcareProfessionalApi], () => {
                    return healthcareProfessionalApi.getHealthcareProfessional(id);
                });
            },
            providesTags: ({id}) => [{type: 'hcp', id}],
        }),
    }),
});

export const { useFilterHealthcareProfessionalsQuery, useGetHealthcareProfessionalQuery } = healthcareProfessionalApiRtk;

```

Let's breakdown this code:

``` typescript title="src/services/healthcareProfessionalApi.ts"
//...
        filterHealthcareProfessionals: builder.query<HealthcareProfessional[], { name: string }>({
            async queryFn({name}, {getState}) {
                const {healthcareProfessionalApi} = await medTechApi(getState);
                return guard([healthcareProfessionalApi], async () => {
                    return (
                        await healthcareProfessionalApi.filterHealthcareProfessionalBy(
                            await new HealthcareProfessionalFilter()
                                .byMatches(
                                    name
                                        .toLowerCase()
                                        .normalize('NFD')
                                        .replace(/[ \t\u0300-\u036f]/g, ''),
                                )
                                .build(),
                        )
                    ).rows;
                });
            },
        }),
//...
```

The `filterHealthcareProfessionals` endpoint will allow us to fetch the list of HealthcareProfessional. We will use
the `HealthcareProfessionalFilter` to filter the HealthcareProfessional by name.

``` typescript title="src/services/healthcareProfessionalApi.ts"
//...
        getHealthcareProfessional: builder.query<HealthcareProfessional, string>({
            async queryFn(id, {getState}) {
                const {healthcareProfessionalApi} = await medTechApi(getState);
                return guard([healthcareProfessionalApi], () => {
                    return healthcareProfessionalApi.getHealthcareProfessional(id);
                });
            },
            providesTags: ({id}) => [{type: 'hcp', id}],
        }),
//...
```

The `getHealthcareProfessional` endpoint will allow us to fetch a HealthcareProfessional by its id.

## Store and reducer

Let's add the `healthcareProfessionalApi` to the store and the reducer.

### Store

```typescript title="src/redux/store.ts"
import {configureStore} from '@reduxjs/toolkit';
import {persistedReducer} from './reducer';
import {persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import {dataSampleApiRtk} from '../services/dataSampleApi';
import {patientApiRtk} from '../services/patientApi';
import {userApiRtk} from '../services/userApi';
// highlight-next-line
import {healthcareProfessionalApiRtk} from '../services/healthcareProfessionalApi';

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({serializableCheck: false, immutableCheck: false}).concat(
            thunk,
            dataSampleApiRtk.middleware,
            patientApiRtk.middleware,
            userApiRtk.middleware,
            // highlight-next-line
            healthcareProfessionalApiRtk.middleware,
        ),
});
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
```

### Reducer

```typescript title="src/redux/reducer.ts"
// ...
export const appReducer = combineReducers({
    petra: petra.reducer,
    medTechApi: api.reducer,
    dataSampleApi: dataSampleApiRtk.reducer,
    patientApi: patientApiRtk.reducer,
    userApi: userApiRtk.reducer,
    // highlight-next-line
    healthecareProfessionalApi: healthcareProfessionalApiRtk.reducer,
});
// ...
```
