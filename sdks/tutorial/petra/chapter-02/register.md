# Register

Now that we have setup Redux and our local storage, we can start to implement the registration of a user.

To do this, we will need first to setup the different things required to be able to use the SDK through Redux/ReactNative.

## State and API cache

We will start by creating our app state and the cache for the API.

``` typescript title="/services/api.ts"
import { AnonymousMedTechApi, MedTechApi, User } from "@icure/medical-device-sdk";
import { AuthenticationProcess } from "@icure/medical-device-sdk/src/models/AuthenticationProcess";

export interface MedTechApiState {
    email?: string;
    token?: string;
    user?: User;
    keyPair?: { publicKey: string; privateKey: string };
    authProcess?: AuthenticationProcess;
    online: boolean;
    invalidEmail: boolean;
    invalidToken: boolean;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: number;
    mobilePhone?: string;
}

const initialState: MedTechApiState = {
    email: undefined,
    token: undefined,
    user: undefined,
    keyPair: undefined,
    authProcess: undefined,
    online: false,
    invalidEmail: false,
    invalidToken: false,
    firstName: undefined,
    lastName: undefined,
    dateOfBirth: undefined,
    mobilePhone: undefined,
};

const apiCache: { [key: string]: MedTechApi | AnonymousMedTechApi } = {};
```

We plan to "cache" the API instances in a Object, since we can't store them in a Redux Store.

## Registration: Start authentication

Here we are, we can start to implement the registration of a user.

The process is quite simple, we will need to create a new `AnonymousMedTechApi` instance, provide the differents variable and implementation (as the storage we created in the previous section) and call the `startAuthentication` method of the `AuthenticationApi`.
This method will return an `AuthenticationProcess` object, that we will store in the state.

``` typescript title="/services/api.ts"
// ...
// highlight-start
import Config from "react-native-config";
import crypto from '@icure/icure-react-native-crypto';
import storage from '../utils/storage';
import {AnonymousMedTechApi, AnonymousMedTechApiBuilder, MedTechApi, MedTechApiBuilder, User, ua2b64} from '@icure/medical-device-sdk';
// highlight-end
// ...

const apiCache: { [key: string]: MedTechApi | AnonymousMedTechApi } = {};

// highlight-start
export const startAuthentication = createAsyncThunk('medTechApi/startAuthentication', async (_payload, {getState}) => {
  const {
    medTechApi: {email, firstName, lastName, recaptcha},
  } = getState() as {medTechApi: MedTechApiState};

  if (!email) {
    throw new Error('No email provided');
  }

  const anonymousApi = await new AnonymousMedTechApiBuilder()
    .withCrypto(crypto)
    .withMsgGwSpecId(Config.EXTERNAL_SERVICES_SPEC_ID!)
    .withAuthProcessByEmailId(Config.EMAIL_AUTHENTICATION_PROCESS_ID!)
    .withStorage(storage)
    .preventCookieUsage()
    .build();

  const authProcess = await anonymousApi.authenticationApi.startAuthentication(
    recaptcha,
    email,
    undefined,
    firstName,
    lastName,
    Config.PARENT_ORGANISATION_ID,
    undefined,
    undefined,
    'friendly-captcha',
  );

  apiCache[`${authProcess.login}/${authProcess.requestId}`] = anonymousApi;

  return authProcess;
});
// highlight-end
```

:::info
The `crypto` import is a custom implementation of the `WebCrypto` API, it emulates the [WebCrypto](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) from the browser directly to ReactNative, you can check the implementation of it [here](https://github.com/bspokeit/react-native-icure-crypto). 
:::

To be able to set the `email` and `firstName`/`lastName` in the state, we will need to create a reducer. Also, we will need to add `startAuthentication` callbacks to the reducer, to be able to set the `authProcess` in the state. 

``` typescript title="/services/api.ts"
// ...
// highlight-start
export const api = createSlice({
    name: 'medTechApi',
    initialState,
    reducers: {
        setRegistrationInformation: (state, { payload: { firstName, lastName, email } }: PayloadAction<{ firstName: string; lastName: string; email: string }>) => {
            state.firstName = firstName;
            state.lastName = lastName;
            state.email = email;
        },
    },
    extraReducers: builder => {
        builder.addCase(startAuthentication.fulfilled, (state, { payload: authProcess }) => {
            state.authProcess = authProcess;
        });
        builder.addCase(startAuthentication.rejected, (state, { }) => {
            state.invalidEmail = true;
        });
    },
});

export const { setRegistrationInformation } = api.actions;
// highlight-end
```

To make the reducer available in the Redux Store, we will need to add it to the `appReducer`:

``` typescript title="/redux/reducer.ts"
// ...
// highlight-next-line
import { api } from '../services/api';

export const appReducer = combineReducers({
  petra: petra.reducer,
  // highlight-next-line
  medTechApi: api.reducer,
});
//...
```

### Frontend

Now that we have the first step of the registration process implemented, we can start to implement the frontend.

```typescript title="/screens/Register.tsx"
// highlight-start
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setRegistrationInformation, startAuthentication } from '../services/api';
// highlight-end

export const Register = (): JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm({
        defaultValues: {
            userFirstName: '',
            userLastName: '',
            userEmail: '',
            userCode: '',
        },
    });
    const navigate = useNavigate();
    // highlight-next-line
    const dispatch = useAppDispatch();

    const [isWaitingForCode, setWaitingForCode] = useState(false);

    const onAskCode = (data: { userEmail: string; userFirstName: string; userLastName: string }) => {
        // highlight-start
        setWaitingForCode(true);
        dispatch(setRegistrationInformation({
            email: data.userEmail,
            firstName: data.userFirstName,
            lastName: data.userLastName
        }));
        dispatch(startAuthentication());
        // highlight-end
    };

    const onRegister = (data: { userEmail: string; userFirstName: string; userLastName: string; userCode: string }) => {
        // TODO
    };
    // ...
}
```

This will allow us to set the `email`, `firstName` and `lastName` in the state, and to start the authentication process when the user press the button.

## Registration: Complete authentication

Now that we have started the authentication process, we can implement the second step of the registration process.

The process is quite simple, we need to call the `completeAuthentication` method of the `AuthenticationApi` with the `authProcess` and the `token` that we received from the email.
This will return a `MedTechApi` instance, that we will need to store in the cache.

To be able to set the `online` state, we will need to add `completeAuthentication` callbacks to the reducer, to be able to set the `online` state . 

```typescript title="/services/api.ts"
// ...
// highlight-start
export const completeAuthentication = createAsyncThunk('medTechApi/completeAuthentication', async (_payload, {getState, dispatch}) => {
  const {
    medTechApi: {authProcess, token},
  } = getState() as {medTechApi: MedTechApiState};

  if (!authProcess) {
    throw new Error('No authProcess provided');
  }

  if (!token) {
    throw new Error('No token provided');
  }

  const anonymousApi = apiCache[`${authProcess.login}/${authProcess.requestId}`] as AnonymousMedTechApi;
  const result = await anonymousApi.authenticationApi.completeAuthentication(authProcess, token);
  const api = result.medTechApi;
  const user = await api.userApi.getLoggedUser();

  apiCache[`${result.groupId}/${result.userId}`] = api;
  delete apiCache[`${authProcess.login}/${authProcess.requestId}`];

  dispatch(setSavedCredentials({login: `${result.groupId}/${result.userId}`, token: result.token, tokenTimestamp: +Date.now()}));

  return user?.marshal();
});
// highlight-end

// ...

export const api = createSlice({
    name: 'medTechApi',
    initialState,
    reducers: {
        setRegistrationInformation: (state, { payload: { firstName, lastName, email } }: PayloadAction<{ firstName: string; lastName: string; email: string }>) => {
            state.firstName = firstName;
            state.lastName = lastName;
            state.email = email;
        },
        // highlight-start
        setToken: (state, {payload: {token}}: PayloadAction<{token: string}>) => {
            state.token = token;
            state.invalidToken = false;
        },
        // highlight-end
    },
    extraReducers: builder => {
        builder.addCase(startAuthentication.fulfilled, (state, { payload: authProcess }) => {
            state.authProcess = authProcess;
        });
        builder.addCase(startAuthentication.rejected, (state, { }) => {
            state.invalidEmail = true;
        });
        // highlight-start
        builder.addCase(completeAuthentication.fulfilled, (state, { payload: user }) => {
            state.user = user as User;
            state.online = true;
        });
        builder.addCase(completeAuthentication.rejected, (state, { }) => {
            state.invalidToken = true;
        });
        // highlight-end
    },
});

// highlight-next-line
export const { setRegistrationInformation, setToken } = api.actions;
```

### Frontend

Now that we have the `completeAuthentication` method implemented, we can implement the frontend.

We will add a `useEffect` that will check if the user is online, and if it is, we will redirect him to the home activity.

```typescript title="/screens/Register.tsx"
// ...
// highlight-next-line
import {completeAuthentication, setRegistrationInformation, setToken, startAuthentication} from '../services/api';
// ...

export const Register = (): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      userFirstName: '',
      userLastName: '',
      userEmail: '',
      userCode: '',
    },
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // highlight-start
  const {online} = useAppSelector(state => ({
    ...state.medTechApi,
  }));

  useEffect(() => {
    if (online) {
      navigate(routes.home);
    }
  }, [online, navigate]);
  // highlight-end

  const [isWaitingForCode, setWaitingForCode] = useState(false);

  const onAskCode = (data: {userEmail: string; userFirstName: string; userLastName: string}) => {
    setWaitingForCode(true);
    dispatch(setRegistrationInformation({email: data.userEmail, firstName: data.userFirstName, lastName: data.userLastName}));
    dispatch(startAuthentication());
  };

  const onRegister = (data: {userCode: string}) => {
    // highlight-start
    setWaitingForCode(false);
    dispatch(setToken({token: data.userCode}));
    dispatch(completeAuthentication());
    // highlight-end
  };
  // ...
}
```

That should be it for the registration process. You can now try to register a new user, and see if it works.

:::tip
If you encounter any issue, make sur that your environment variables are correctly set.
:::

Finally, go to Cockpit and check the [patient list of your solution](https://cockpit.icure.dev/patients). You should now see your newly registered patient. 