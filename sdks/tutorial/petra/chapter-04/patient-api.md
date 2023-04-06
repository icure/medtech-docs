# Patient API

Now that we can add, view, edit and delete data through DataSamples, we will explore features in this chapter to edit the attributes of our Patient (our user) and allow them to potentially share their data with their doctors.

First step is to create the so called `PatientApi` that will allow us to interact with the Patient API. This API will allow us to fetch our current patient.

```typescript title="src/services/patient-api.ts"
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Patient} from '@icure/medical-device-sdk';
import {currentUser, guard, medTechApi} from './api';

export const patientApiRtk = createApi({
  reducerPath: 'patientApi',
  tagTypes: ['Patient'],
  baseQuery: fetchBaseQuery({
    baseUrl: '/rest/v1/patient',
  }),
  endpoints: builder => ({
    currentPatient: builder.query<Patient, void>({
      async queryFn(_, {getState}) {
        const {patientApi, dataOwnerApi} = await medTechApi(getState);
        const user = currentUser(getState);
        return guard([patientApi, dataOwnerApi], () => {
          const dataOwner = dataOwnerApi.getDataOwnerIdOf(user);
          return patientApi.getPatient(dataOwner);
        });
      },
      providesTags: ({id}) => [{type: 'Patient', id}],
    }),
  }),
});

export const {useCurrentPatientQuery} = patientApiRtk;
```

In our case, the `Patient` is the current user. We will use the `DataOwnerApi` to get the `DataOwnerId` of the current user and then use the `PatientApi` to get the `Patient` associated to this `DataOwnerId`.

Then, we will create an endpoint to update the `Patient`:

```typescript title="src/services/patient-api.ts"
export const patientApiRtk = createApi({
    reducerPath: 'patientApi',
    tagTypes: ['Patient'],
    baseQuery: fetchBaseQuery({
        baseUrl: '/rest/v1/patient',
    }),
    endpoints: builder => ({
        currentPatient: builder.query<Patient, void>({
            async queryFn(_, {getState}) {
                const {patientApi, dataOwnerApi} = await medTechApi(getState);
                const user = currentUser(getState);
                return guard([patientApi, dataOwnerApi], () => {
                    const dataOwner = dataOwnerApi.getDataOwnerIdOf(user);
                    return patientApi.getPatient(dataOwner);
                });
            },
            providesTags: ({id}) => [{type: 'Patient', id}],
        }),
        // highlight-start
        createOrUpdatePatient: builder.mutation<Patient, Patient>({
            async queryFn(patient, { getState }) {
                const { patientApi } = await medTechApi(getState);
                return guard([patientApi], () => {
                    return patientApi.createOrModifyPatient(patient);
                });
            },
            invalidatesTags: ({ id }) => [{ type: 'Patient', id }],
        }),
        // highlight-end
    }),
});

```

This endpoint will allow us to update the `Patient` by calling the `createOrModifyPatient` method of the `PatientApi`.

## Store and reducer

Now that we have our `PatientApi`, we will to add a store and a reducer to our app store and app reducer.

```typescript title="src/redux/store.ts"
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false, immutableCheck: false}).concat(
      thunk,
      dataSampleApiRtk.middleware,
    // highlight-next-line
      patientApiRtk.middleware,
    ),
});
```

```typescript title="src/redux/reducer.ts"
export const appReducer = combineReducers({
  petra: petra.reducer,
  medTechApi: api.reducer,
  dataSampleApi: dataSampleApiRtk.reducer,
    // highlight-next-line
  patientApi: patientApiRtk.reducer,
});
```
