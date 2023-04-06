# Sharing data

We will now focus on the second tab of our modal `My doctors`. This tab will allow us to share our data with other
users, in our case, the others users are HealthcareProfessional.

The process to share data with other users is the following:

* We will fetch the list of HealthcareProfessional using the `HealthcareProfessionalApi` searching by name.
* We will select the HealthcareProfessional we want to share our data with.

Then, to delete the sharing of our data with other users, we will:

* Click on the cross button on the HealthcareProfessional we want to stop sharing our data with.

## Share data with a HealthcareProfessional

```tsx title="src/components/EditUserModal/index.tsx"
const {user} = useAppSelector(state => ({
    ...state.medTechApi,
    user: state.medTechApi.user,
}));

const {
    data: hcpListSearchResult,
    isFetching: isHcpSearchFetching
} = useFilterHealthcareProfessionalsQuery({name: searchQuery}, {skip: !searchQuery?.length});

const filteredHcpList = hcpListSearchResult?.filter(item => !user?.sharingDataWith?.medicalInformation || ![...user?.sharingDataWith?.medicalInformation].includes(item.id));
```

We will use the `useFilterHealthcareProfessionalsQuery` to fetch the HealthcareProfessional. We will use the `searchQuery` as a filter to search by name.

We will also filter the HealthcareProfessional we already share our data with.

Now, we have to handle the behavior of the DoctorCard component when we click on the `Share` button.

```tsx title="src/components/DoctorCard/index.tsx"
export const DoctorCardAdd: React.FC<DoctorCardAddProps> = ({name, id}) => {
    const [showConfirmationWindow, setShowConfirmationWindow] = useState(false);
    // highlight-next-line
    const [shareDataWithDoctor] = useShareDataWithMutation();
    const handleAdd = () => {
        // highlight-next-line
        shareDataWithDoctor({ids: [id]});
        setShowConfirmationWindow(false);
    };
//...
```

We will use the `useShareDataWithMutation` to share newly created data with the HealthcareProfessional. We will pass the `id` of the HealthcareProfessional as a parameter.

## Stop sharing data with a HealthcareProfessional

```tsx title="src/components/DoctorCard/index.tsx"
export const DoctorCardRemove: React.FC<DoctorCardRemoveProps> = ({id}) => {
    const [showConfirmationWindow, setShowConfirmationWindow] = useState(false);
    // highlight-next-line
    const {data: hcp} = useGetHealthcareProfessionalQuery(id, {skip: !id});

    // highlight-next-line
    const [stopSharingDataWithDoctor] = useStopSharingWithMutation();

    const handleRevome = () => {
        // highlight-next-line
        stopSharingDataWithDoctor({ids: [id]});
        setShowConfirmationWindow(false);
    };

    return (
        <>
            <View style={styles.doctorCard}>
                <View style={styles.doctorsTitle}>
                    <View style={styles.doctorIcnContainer}>
                        <Image style={styles.doctorIcn} source={require('../../assets/images/stethoscope.png')}/>
                    </View>
                    // highlight-next-line
                    <Text style={globalStyles.baseText}>{hcp?.lastName + ' ' + hcp?.firstName}</Text>
                </View>
                //...
```

The `DoctorCardRemove` components will display the HealthcareProfessionals we currently share data with. We will use the `useGetHealthcareProfessionalQuery` to fetch the HealthcareProfessional.

If our user want to stop sharing data with them, they will be able to remove the auto-delegation. We will use the `useStopSharingWithMutation` to stop sharing data with the HealthcareProfessional. We will pass the `id` of the HealthcareProfessional as a parameter.
