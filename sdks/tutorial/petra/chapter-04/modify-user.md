# Update the user

Now that we have the API setup, we can implement the update user functionality. We will use the `createOrUpdatePatient` endpoint that we created in the previous step.

First step is to uncomment the **JSX** code of `src/components/EditUserDataModal/index.tsx`

Second step is to add the logic to update the user. We will use the `createOrUpdatePatient` endpoint that we created in the previous step.

```typescript title="src/components/EditUserDataModal/index.tsx"
//...
// highlight-start
const {data: patient, isFetching} = useCurrentPatientQuery();
const [createOrUpdatePatient] = useCreateOrUpdatePatientMutation();
// highlight-end
//...

const handleSave = (data: {
    firstName: string;
    lastName: string;
    email: string;
    mobilePhone: string;
    dateOfBirth: number
}) => {
    const {firstName, lastName, email, mobilePhone, dateOfBirth} = data;

    // highlight-start
    const address = new Address({
        addressType: 'home',
        telecoms: [
            new Telecom({
                telecomType: 'email',
                telecomNumber: email,
            }),
            new Telecom({
                telecomType: 'mobile',
                telecomNumber: mobilePhone,
            }),
        ],
    });

    createOrUpdatePatient(new Patient({...patient, firstName, lastName, dateOfBirth, addresses: [address]}));
    // highlight-end

    onSave();
};
//...

```

We fetch the current user with the `useCurrentPatientQuery` hook. Then, we export the `createOrUpdatePatient` mutation to be able to update the user.

Once our user will save the form, we will create a new `Patient` object with the new data and call the `createOrUpdatePatient` mutation.

Now, we can test our application. If we go to the `My information` modal, we can update the user data and save it. If we go back to the `Home` activity, we can see that the user data has been updated on the header.
