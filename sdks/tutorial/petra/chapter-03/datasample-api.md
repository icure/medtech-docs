# DataSample API

So, we are able to register a user and log in. But we can't do anything else yet. We need to create a `DataSample` and fetching them afterward. Let's do that now.

We will start by creating a service that will handle the API calls. We will create a file called `services/dataSampleApi.ts` and add the following code:

```typescript title="/services/dataSampleApi.ts"
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const dataSampleApiRtk = createApi({
  reducerPath: 'dataSampleApi',
  tagTypes: ['DataSample'],
  baseQuery: fetchBaseQuery({
    baseUrl: '/rest/v1/dataSample',
  }),
  endpoints: builder => ({

  }),
});

export const {  } = dataSampleApiRtk;
```

## Get DataSamples

We will start by creating a `getDataSamples` endpoint. This endpoint will take a list of `DataSample` ids and return a list of `DataSample` objects.

In order to do that, we will need to create a `DataSampleFilter` object. This object will be used to filter the `DataSample` objects. We will create a `DataSampleFilter` object that will filter the `DataSample` objects by their ids.

```typescript title="/services/dataSampleApi.ts"
export const dataSampleApiRtk = createApi({
    reducerPath: 'dataSampleApi',
    tagTypes: ['DataSample'],
    baseQuery: fetchBaseQuery({
        baseUrl: '/rest/v1/dataSample',
    }),
    endpoints: builder => ({
        // highlight-start
        getDataSamples: builder.query<PaginatedListDataSample, {ids: string[]; nextDataSampleId?: string; limit: number}>({
            async queryFn({ids, nextDataSampleId = undefined, limit = 1000}, {getState}) {
                const {dataSampleApi, dataOwnerApi} = await medTechApi(getState);
                const user = currentUser(getState);
                return guard([dataSampleApi, dataOwnerApi], async () => {
                    const dataOwner = dataOwnerApi.getDataOwnerIdOf(user);
                    return await dataSampleApi.filterDataSample(await new DataSampleFilter().forDataOwner(dataOwner).byIds(ids).build(), nextDataSampleId, limit);
                });
            },
            providesTags: tagsByIdsPaginated('DataSample', 'all'),
        }),
        // highlight-end
    }),
});

// highlight-next-line
export const { useGetDataSamplesQuery } = dataSampleApiRtk;
```

We will also create a `useGetDataSamplesQuery` hook that will be used to call the `getDataSamples` endpoint.

## Create or update DataSample

We will now create a `createOrUpdateDataSample` endpoint. This endpoint will take a `DataSample` object and create or update it.

```typescript title="/services/dataSampleApi.ts"
createOrUpdateDataSample: builder.mutation<DataSample, DataSample>({
  async queryFn(dataSample, {getState}) {
    const {dataSampleApi, dataOwnerApi} = await medTechApi(getState);
    const user = currentUser(getState);
    return guard([dataSampleApi, dataOwnerApi], () => {
      const dataOwner = dataOwnerApi.getDataOwnerIdOf(user);
      return dataSampleApi.createOrModifyDataSampleFor(dataOwner, dataSample);
    });
  },
  invalidatesTags: ({id}) => [{type: 'DataSample', id}],
}),
```

We will also create a `useCreateOrUpdateDataSampleMutation` hook that will be used to call the `createOrUpdateDataSample` endpoint.

## Create or update DataSamples

We will now create a `createOrUpdateDataSamples` endpoint. This endpoint will take a list of `DataSample` objects and create or update them.

```typescript title="/services/dataSampleApi.ts"
createOrUpdateDataSamples: builder.mutation<DataSample[], DataSample[]>({
  async queryFn(dataSamples, {getState}) {
    const {dataSampleApi, dataOwnerApi} = await medTechApi(getState);
    const user = currentUser(getState);
    return guard([dataSampleApi, dataOwnerApi], () => {
      const dataOwner = dataOwnerApi.getDataOwnerIdOf(user);
      return dataSampleApi.createOrModifyDataSamplesFor(dataOwner, dataSamples);
    });
  },
  invalidatesTags: tagsByIds('DataSample', 'all'),
}),
```

We will also create a `useCreateOrUpdateDataSamplesMutation` hook that will be used to call the `createOrUpdateDataSamples` endpoint.

## Delete DataSamples

We will now create a `deleteDataSamples` endpoint. This endpoint will take a list of `DataSample` ids and delete them.

In order to do that, we will need to group the `DataSample` ids by `batchId`. This is because the `deleteDataSamples` endpoint only accepts a list of `DataSample` ids that belong to the same `batchId`.

```typescript title="/services/dataSampleApi.ts"
deleteDataSamples: builder.mutation<string[], DataSample[]>({
  async queryFn(dataSamples, {getState}) {
    const {dataSampleApi, dataOwnerApi} = await medTechApi(getState);
    return guard([dataSampleApi, dataOwnerApi], async () => {
      const groupedDataSamples: {[batchId: string]: string[]} = dataSamples.reduce((acc, dataSample) => {
        if (dataSample.batchId && dataSample.id) {
          acc[dataSample.batchId] = [...(acc[dataSample.batchId] ?? []), dataSample.id];
        }
        return acc;
      }, {} as {[batchId: string]: string[]});
      return (await Promise.all(Object.values(groupedDataSamples).map(ids => dataSampleApi.deleteDataSamples(ids)))).flatMap(x => x);
    });
  },
  invalidatesTags: () => [{type: 'DataSample', id: 'all'}],
}),
```

We will also create a `useDeleteDataSamplesMutation` hook that will be used to call the `deleteDataSamples` endpoint.

## Get DataSamples between dates

We will now create a `getDataSampleBetween2Dates` endpoint. This endpoint will take a `tagType`, a `tagCode`, a `startDate` and an `endDate` and return a paginated list of `DataSample` objects that match the given criteria.

```typescript title="/services/dataSampleApi.ts"
getDataSampleBetween2Dates: builder.query<
  PaginatedListDataSample,
  {tagType: string; tagCode: string; startDate: number; endDate: number; nextDataSampleId?: string; limit?: number}
>({
  async queryFn({tagType, tagCode, startDate, endDate, nextDataSampleId = undefined, limit = 1000}, {getState}) {
    const {dataSampleApi, dataOwnerApi} = await medTechApi(getState);
    const user = currentUser(getState);
    return guard([dataSampleApi, dataOwnerApi], async () => {
      const dataOwner = dataOwnerApi.getDataOwnerIdOf(user);
      return await dataSampleApi.filterDataSample(
        await new DataSampleFilter().forDataOwner(dataOwner).byLabelCodeFilter(tagType, tagCode, undefined, undefined, startDate, endDate).build(),
        nextDataSampleId,
        limit,
      );
    });
  },
  providesTags: tagsByIdsPaginated('DataSample', 'all'),
}),
```

We will also create a `useGetDataSampleBetween2DatesQuery` hook that will be used to call the `getDataSampleBetween2Dates` endpoint.

## Get DataSamples by label code and label type

We will now create a `getDataSampleByTagType` endpoint. This endpoint will take a `tagType`, a `tagCode`, a `nextDataSampleId` and a `limit` and return a paginated list of `DataSample` objects that match the given criteria.

```typescript title="/services/dataSampleApi.ts"
getDataSampleByTagType: builder.query<PaginatedListDataSample, {tagType: string; tagCode: string; nextDataSampleId?: string; limit?: number}>({
  async queryFn({tagType, tagCode, nextDataSampleId = undefined, limit = 1000}, {getState}) {
    const {dataSampleApi, dataOwnerApi} = await medTechApi(getState);
    const user = currentUser(getState);
    return guard([dataSampleApi, dataOwnerApi], async () => {
      const dataOwner = dataOwnerApi.getDataOwnerIdOf(user);
      return await dataSampleApi.filterDataSample(
        await new DataSampleFilter().forDataOwner(dataOwner).byLabelCodeFilter(tagType, tagCode, undefined, undefined, undefined, undefined).build(),
        nextDataSampleId,
        limit,
      );
    });
  },
  providesTags: tagsByIdsPaginated('DataSample', 'all'),
}),
```

We will also create a `useGetDataSampleByTagTypeQuery` hook that will be used to call the `getDataSampleByTagType` endpoint.

## Update app reducer

We will now update the `appReducer` to add the `dataSampleApi` endpoints.

```typescript title="/redux/reducer.ts"
import { combineReducers } from '@reduxjs/toolkit';
import { persistConfig, petra } from '../config/PetraState';
import { persistReducer } from 'redux-persist';
import { api } from '../services/api';
// highlight-next-line
import { dataSampleApiRtk } from '../services/dataSampleApi';

export const appReducer = combineReducers({
  petra: petra.reducer,
  medTechApi: api.reducer,
    // highlight-next-line
  dataSampleApi: dataSampleApiRtk.reducer,
});

export const persistedReducer = persistReducer(persistConfig, appReducer);

export type AppState = ReturnType<typeof appReducer>;
```

## Update app store

We will now update the `appStore` to add the `dataSampleApi` endpoints.

```typescript title="/redux/store.ts"
import {configureStore} from '@reduxjs/toolkit';
import {persistedReducer} from './reducer';
import {persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
// highlight-next-line
import { dataSampleApiRtk } from '../services/dataSampleApi';

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false, immutableCheck: false}).concat(
      thunk,
        // highlight-next-line
      dataSampleApiRtk.middleware,
    ),
});
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
```

----

That's it for the `DataSample` endpoints. We will now work on the frontend.
