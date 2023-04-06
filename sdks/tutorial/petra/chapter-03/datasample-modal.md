# Input some data

Now that we can display the data, we need to be able to input some data.

The way we will do this is by opening a modal that will allow the user to input the data. As you could see on the
previous section, we have 3 kinds of data: flow level, complaint and notes.

Flow level is an interpretation of the flow level of the patient. It is a measure between 0 and 3. 0 means no flow, 3
means a lot of flow.

Complaints are the complaints of the patient. They are stored as DataSample with proper SNOMED and LOINC tag codes.

Notes are the notes of the patient. They are stored as DataSample with a `stringValue`.

:::caution
In this modal we will handle both creation, update and deletion of the DataSamples.
:::

## Hooks

First, let's import the hooks we will need to create and delete the DataSamples.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
import {useCreateOrUpdateDataSamplesMutation, useDeleteDataSamplesMutation} from '../../services/dataSampleApi';
// ...
const [createOrUpdateDataSamples] = useCreateOrUpdateDataSamplesMutation();
const [deleteDataSamples] = useDeleteDataSamplesMutation();
```

## `handleSave()`

User can save the data by clicking on the save button. We will now edit the `handleSave()` function that will be called
when the user clicks on the save button.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
  const handleSave = () => {
    // highlight-start
    const flowLevelContent = {
        en: new Content({
            measureValue: new Measure({
                value: selectedFlowLevel.flowLevel,
                min: 0,
                max: 3,
            }),
        }),
    };

    const userPeriodDataSample = currentFlowLevelDataSample
        ? new DataSample({
            ...currentFlowLevelDataSample,
            content: flowLevelContent,
        })
        : new DataSample({
            valueDate,
            labels: new Set([new CodingReference({type: 'LOINC', code: '49033-4'})]),
            content: flowLevelContent,
        });

    const getUserComplaintDataSample = (SNOMED_CODE: string) => {
        return new DataSample({
            valueDate,
            codes: new Set([new CodingReference({type: 'SNOMED-CT', code: SNOMED_CODE})]),
            labels: new Set([new CodingReference({type: 'LOINC', code: '75322-8'})]),
        });
    };

    const notesContent = {
        en: new Content({
            stringValue: notes,
        }),
    };

    const userNotesDataSample = currentNotesDataSample
        ? new DataSample({
            ...currentNotesDataSample,
            content: notesContent,
        })
        : new DataSample({
            valueDate,
            content: notesContent,
            labels: new Set([new CodingReference({type: 'LOINC', code: '34109-9'})]),
        });

    const addedComplaints = onlyCheckedComplaints?.filter(item => !selectedComplaintsCodes?.includes(item.SNOMED_CT_CODE));

    const removedComplaints = currentComplaintsDataSamples?.filter(item => {
        const complient = complaintsData.find(complientObj => complientObj.SNOMED_CT_CODE === [...item.codes.values()][0].code);
        return !onlyCheckedComplaints.some(element => element.SNOMED_CT_CODE === complient.SNOMED_CT_CODE);
    });

    deleteDataSamples(removedComplaints);

    if (currentNotesDataSample?.content.en.stringValue && !notes) {
        deleteDataSamples([currentNotesDataSample]);
    } else {
        createOrUpdateDataSamples(notes?.length && currentNotesDataSample?.content.en.stringValue !== notes ? [userNotesDataSample] : []);
    }

    createOrUpdateDataSamples(addedComplaints.map(item => getUserComplaintDataSample(item.SNOMED_CT_CODE)));
    createOrUpdateDataSamples([userPeriodDataSample]);
    // highlight-end

    onSave();
};
```

### Let's break down what we did here.

First, we create the `flowLevelContent` object that will be used to create the `userPeriodDataSample` DataSample.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
const flowLevelContent = {
    en: new Content({
        measureValue: new Measure({
            value: selectedFlowLevel.flowLevel,
            min: 0,
            max: 3,
        }),
    }),
};
```

Then, we create the `userPeriodDataSample` DataSample.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
const userPeriodDataSample = currentFlowLevelDataSample
    ? new DataSample({
        ...currentFlowLevelDataSample,
        content: flowLevelContent,
    })
    : new DataSample({
        valueDate,
        labels: new Set([new CodingReference({type: 'LOINC', code: '49033-4'})]),
        content: flowLevelContent,
    });
```

Then, we create the `getUserComplaintDataSample` function that will be used to create the `addedComplaints`
and `removedComplaints` objects.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
const getUserComplaintDataSample = (SNOMED_CODE: string) => {
    return new DataSample({
        valueDate,
        codes: new Set([new CodingReference({type: 'SNOMED-CT', code: SNOMED_CODE})]),
        labels: new Set([new CodingReference({type: 'LOINC', code: '75322-8'})]),
    });
};
```

Then, we create the `notesContent` Content that will be used to create the `userNotesDataSample` DataSample.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
const notesContent = {
    en: new Content({
        stringValue: notes,
    }),
};
```

Then, we create the `userNotesDataSample` DataSample.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
const userNotesDataSample = currentNotesDataSample
? new DataSample({
    ...currentNotesDataSample,
    content: notesContent,
})
: new DataSample({
    valueDate,
    content: notesContent,
    labels: new Set([new CodingReference({type: 'LOINC', code: '34109-9'})]),
});
```

Then, we create the `addedComplaints` DataSamples.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
const addedComplaints = onlyCheckedComplaints?.filter(item => !selectedComplaintsCodes?.includes(item.SNOMED_CT_CODE));
```

Then, we create the `removedComplaints` DataSample array. We do this by filtering the `currentComplaintsDataSamples`
array and checking if the `SNOMED_CT_CODE` of the `complaintsData` array is not in the `onlyCheckedComplaints` array.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
const removedComplaints = currentComplaintsDataSamples?.filter(item => {
    const complient = complaintsData.find(complientObj => complientObj.SNOMED_CT_CODE === [...item.codes.values()][0].code);
    return !onlyCheckedComplaints.some(element => element.SNOMED_CT_CODE === complient.SNOMED_CT_CODE);
});
```

Then, we delete the `removedComplaints` DataSamples.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
deleteDataSamples(removedComplaints);
```

Then, we create or update the `userNotesDataSample`. We do this by checking if the `currentNotesDataSample` has
a `content.en.stringValue` and if the `notes` is empty. If both are true, we delete the `currentNotesDataSample`. If
not, we create or update the `userNotesDataSample`.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
if (currentNotesDataSample?.content.en.stringValue && !notes) {
    deleteDataSamples([currentNotesDataSample]);
} else {
    createOrUpdateDataSamples(notes?.length && currentNotesDataSample?.content.en.stringValue !== notes ? [userNotesDataSample] : []);
}
```

Then, we create the `addedComplaints` DataSample array.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
createOrUpdateDataSamples(addedComplaints.map(item => getUserComplaintDataSample(item.SNOMED_CT_CODE)));
```

Then, we create or update the `userPeriodDataSample`.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
createOrUpdateDataSamples([userPeriodDataSample]);
```

Then, we call the `onSave` function. This function is passed from the parent component and is used to close the modal.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
onSave();
```

## `handleDelete()`

Deletion of the DataSample is handled by the `handleDelete()` function.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
const handleDelete = () => {
    // highlight-start
    const dataSamplesToDelete = [currentFlowLevelDataSample, ...currentComplaintsDataSamples, currentNotesDataSample].filter(item => !!item);
    deleteDataSamples(dataSamplesToDelete);
    // highlight-end
    onDelete();
};
```

### Let's break down what we did here.

First, we create the `dataSamplesToDelete` array. We do this by filtering the `currentFlowLevelDataSample`, `currentComplaintsDataSamples` and `currentNotesDataSample` arrays and checking if the item is not `undefined`.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
const dataSamplesToDelete = [currentFlowLevelDataSample, ...currentComplaintsDataSamples, currentNotesDataSample].filter(item => !!item);
```

Then, we delete the `dataSamplesToDelete` DataSamples.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
deleteDataSamples(dataSamplesToDelete);
```

Then, we call the `onDelete` function. This function is passed from the parent component and is used to close the modal.

```typescript title="/components/AddUserDataSampleModal/index.tsx"
onDelete();
```

----

You should now be able to create a DataSample and delete it. It should display in the `AdvancedCalendar` component we did in the previous section.
