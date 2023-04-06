# Home header

Now that we have the required endpoints, we can start implementing the frontend.

## 1. Uncomment the Header component

In the `src/screen/Home.tsx` file, uncomment the `Header` component section.

```tsx title="src/screen/Home.tsx"
<ScrollView contentContainerStyle={styles.homeScreen}>
  <View style={styles.contentTopBlock}>
    // highlight-next-line
    <Header userName={patient?.firstName || patient?.lastName ? `${patient.firstName} ${patient.lastName}` : 'Dear User'} />
    <Image style={styles.logo} source={require('../assets/images/logo-with-pod.png')} />
    <TouchableOpacity style={styles.infoIcnContainer} onPress={() => setSymbolsExplanationModalVisible(true)}>
      <Image style={styles.infoIcn} source={require('../assets/images/info.png')} />
    </TouchableOpacity>
  </View>
  <AdvancedCalendar />
  <CyclesHistory />
  <Modal
    animationType="slide"
    transparent={true}
    visible={symbolsExplanationmodalVisible}
    onRequestClose={() => {
      setSymbolsExplanationModalVisible(!symbolsExplanationmodalVisible);
    }}>
    <SymbolsExplanationModal onClose={() => setSymbolsExplanationModalVisible(!symbolsExplanationmodalVisible)} />
  </Modal>
</ScrollView>
```

This will display the `Header` component at the top of the screen.

## 2. Fetch the current parient

In the `src/screen/Home.tsx` file, add the following code to fetch the current patient.

```tsx title="src/screen/Home.tsx"
  const {data: patient} = useCurrentPatientQuery();
```

So now we have the header that displays the first and last name of our patient. There is also a button that the patient can press to edit their profile, share their data and log out.
