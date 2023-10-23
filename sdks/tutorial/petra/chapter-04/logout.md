# Log out

Final step: log out of the application. This is done through the logout button on the same modal as the `My information`
and `My doctors`.

Let's start by adding the logout logic to the src/services/api.ts file.

```typescript title="src/services/api.ts"
//...
// highlight-start
export const logout = createAsyncThunk('medTechApi/logout', async (payload, {getState, dispatch}) => {
    dispatch(revertAll());
    dispatch(resetCredentials());
});
// highlight-end

export const api = createSlice({
    name: 'medTechApi',
    initialState,
    reducers: {
        setEmail: (state, {payload: {email}}: PayloadAction<{ email: string }>) => {
            state.email = email;
            state.invalidEmail = false;
        },
        setToken: (state, {payload: {token}}: PayloadAction<{ token: string }>) => {
            state.token = token;
            state.invalidToken = false;
        },
        setAuthProcess: (state, {payload: {authProcess}}: PayloadAction<{ authProcess: AuthenticationProcess }>) => {
            state.authProcess = authProcess;
        },
        setUser: (state, {payload: {user}}: PayloadAction<{ user: User }>) => {
            state.user = user;
        },
        setRegistrationInformation: (state, {payload: {firstName, lastName, email}}: PayloadAction<{
            firstName: string;
            lastName: string;
            email: string
        }>) => {
            state.firstName = firstName;
            state.lastName = lastName;
            state.email = email;
        },
        // highlight-start
        resetCredentials(state) {
            state.online = false;
        },
        // highlight-end
        setRecaptcha: (state, {payload: {recaptcha}}: PayloadAction<{ recaptcha: string }>) => {
            state.recaptcha = recaptcha;
        },
    },
    extraReducers: builder => {
        builder.addCase(startAuthentication.fulfilled, (state, {payload: authProcess}) => {
            state.authProcess = authProcess;
        });
        builder.addCase(completeAuthentication.fulfilled, (state, {payload: user}) => {
            state.user = user as User;
            state.online = true;
        });
        builder.addCase(startAuthentication.rejected, (state, {}) => {
            state.invalidEmail = true;
        });
        builder.addCase(completeAuthentication.rejected, (state, {}) => {
            state.invalidToken = true;
        });
        builder.addCase(login.fulfilled, (state, {payload: user}) => {
            state.user = user as User;
            state.online = true;
        });
        builder.addCase(login.rejected, (state, {}) => {
            state.invalidToken = true;
            state.online = false;
        });
    },
});

export const {
    setEmail,
    setToken,
    setAuthProcess,
    setUser,
    setRegistrationInformation,
    // highlight-next-line
    resetCredentials,
    setRecaptcha
} = api.actions;

```

The `logout` action will reset the state of the application to its initial state. This is done by dispatching
the `revertAll` (that we have added in
the [Chapter 2](/{{sdk}}/tutorial/petra/chapter-02/redux-and-storage#state-of-the-application)) and `resetCredentials`
actions.

Now that we have the `logout` action, we can add the logout button to the `My information` and `My doctors` modals.

```tsx title="src/components/EditUserModal/index.tsx"
//...
// highlight-next-line
const dispatch = useAppDispatch();

const handleLogout = () => {
    // highlight-start
    dispatch(logout());
    navigate(routes.login);
    // highlight-end
};

//...
```

That's it! We have now added the logout functionality to the application.
