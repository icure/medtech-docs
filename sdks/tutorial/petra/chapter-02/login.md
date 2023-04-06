# Login

Now that we have the ability to register as a user, we would need now to be able to login as a user.
The process is very similar to the registration process, since we will use the same API methods `startAuthentication`and `completeAuthentication`.

But we have 2 scenarios to handle:

- The user wants to login and will follow more or less the same process as the registration process.
- The user wants to login and there is already a session opened for this user (credentials have been persisted during the last session). In this case, we will just need to retrieve the session information, instantiate a `MedTechApi` and navigate to the main page.

We will handle both scenarios in the same activity, and we will use the `login` method to handle the second case.

## Login async thunk implementation

```typescript title="/services/api.ts"
// ...
// highlight-start
export const login = createAsyncThunk('medTechApi/login', async (_, {getState}) => {
  const {
    medTechApi: {email, token},
  } = getState() as {medTechApi: MedTechApiState};

  if (!email) {
    throw new Error('No email provided');
  }

  if (!token) {
    throw new Error('No token provided');
  }

  const api = await new MedTechApiBuilder()
    .withCrypto(crypto)
    .withICureBaseUrl(`${ICURE_CLOUD_URL}/rest/v1`)
    .withMsgGwUrl(MSG_GW_CLOUD_URL)
    .withMsgGwSpecId(Config.REACT_APP_MSGGW_SPEC_ID!)
    .withAuthProcessByEmailId(Config.REACT_APP_AUTH_PROCESS_BY_EMAIL_ID!)
    .withAuthProcessBySmsId(Config.REACT_APP_AUTH_PROCESS_BY_EMAIL_ID!)
    .withStorage(storage)
    .preventCookieUsage()
    .withUserName(email)
    .withPassword(token)
    .build();
  await api.initUserCrypto();
  const user = await api.userApi.getLoggedUser();

  apiCache[`${user.groupId}/${user.id}`] = api;

  return user?.marshal();
});
// highlight-end

export const api = createSlice({
    name: 'medTechApi',
    initialState,
    reducers: {
        setRegistrationInformation: (state, { payload: { firstName, lastName, email } }: PayloadAction<{ firstName: string; lastName: string; email: string }>) => {
            state.firstName = firstName;
            state.lastName = lastName;
            state.email = email;
        },
        setToken: (state, { payload: { token } }: PayloadAction<{ token: string }>) => {
            state.token = token;
            state.invalidToken = false;
        },
        // highlight-start
        setEmail: (state, {payload: {email}}: PayloadAction<{email: string}>) => {
            state.email = email;
            state.invalidEmail = false;
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
        builder.addCase(completeAuthentication.fulfilled, (state, { payload: user }) => {
            state.user = user as User;
            state.online = true;
        });
        builder.addCase(completeAuthentication.rejected, (state, { }) => {
            state.invalidToken = true;
        });
        // highlight-start
        builder.addCase(login.fulfilled, (state, { payload: user }) => {
            state.user = user as User;
            state.online = true;
        });
        builder.addCase(login.rejected, (state, { }) => {
            state.invalidToken = true;
            state.online = false;
        });
        // highlight-end
    },
});

// highlight-next-line
export const { setRegistrationInformation, setToken, setEmail } = api.actions;
```

## Frontend implementation

Login activity will be the first activity loaded by the application. We will use the `useEffect` hook to check if there is already a session opened for the user. If there is, we will call the `login` method to retrieve the session information and navigate to the main page.

If there is no session opened, we will display the login form and follow the same process as the registration process (without `firstname`/`lastname` input field).

```typescript title="/screens/Login.tsx"
// ...
// highlight-start
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setToken, login, completeAuthentication, startAuthentication } from '../services/api';
// highlight-end

export const Login = () => {
  const [isWaitingForCode, setWaitingForCode] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      userEmail: '',
      userCode: '',
    },
  });

  // highlight-start
  const {online, lsUsername, lsToken} = useAppSelector(state => ({
    ...state.medTechApi,
    lsUsername: state.petra?.savedCredentials?.login,
    lsToken: state.petra?.savedCredentials?.token,
  }));
  // highlight-end

  const navigate = useNavigate();
  // highlight-next-line
  const dispatch = useAppDispatch();

    // highlight-start
  useEffect(() => {
    if (lsUsername && lsToken && dispatch) {
      dispatch(setEmail({email: lsUsername}));
      dispatch(setToken({token: lsToken}));
      dispatch(login());
    }
  }, [navigate, lsUsername, lsToken, dispatch]);

  useEffect(() => {
    if (online) {
      navigate(routes.home);
    }
  }, [online, navigate]);
    // highlight-end

  const onLogin = (data: {userCode: string}) => {
    // highlight-start
    setWaitingForCode(false);
    dispatch(setToken({token: data.userCode}));
    dispatch(completeAuthentication());
    // highlight-end
  };
  const onAskCode = (data: {userEmail: string}) => {
    // highlight-start
    setWaitingForCode(true);
    dispatch(setEmail({email: data.userEmail}));
    dispatch(startAuthentication());
    // highlight-end
  };
  
  // ...
}
```

That should be it for the login process. You can now try to register a new user, and see if it works.
