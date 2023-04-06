# Advanced Calendar

We will now dive into the advanced calendar. This calendar will be used to display the DataSamples input by the patient.
It will be a calendar that will display the DataSamples grouped by day. It will also allow the user to select a date
range to display the DataSamples of that date range. This date range will be from first day of the first day of the
month to the last day of the last day of the month.

First step is to uncomment the TSX code in the `AdvancedCalendar` component.

Make sure however to comment this line, since we will not use it for now.

```typescript title="/components/AdvancedCalendar.tsx"
<DayOfTheMonth
    dayData = {date}
    state = {state}
    flowLevel = {getTodayFlowLevelData(new Date(date.dateString))?.content.en.measureValue.value}
    hasComplaint = {!!getTodayComplaintDatas(new Date(date.dateString))?.length || !!getTodayNotesData(new Date(date.dateString))?.content.en.stringValue}
    // highlight-next-line
    // isPredictedPeriod={isTodayPredictedPeriodDay(new Date(date.dateString))}
/>
```

If you see some red highlighting in your editor, it is because
the `getTodayFlowLevelData`, `getTodayComplaintDatas`, `getTodayNotesData` and `isTodayPredictedPeriodDay` functions are
not defined. We will define most of them in the next step.

Since we will create different DataSamples for each kind of data, we will fetch them separately.

## Hooks

We will use the hooks we created in the previous section to fetch the DataSamples.

```typescript title="/components/AdvancedCalendar/index.tsx"
  const {data: flowLevelComplaintsAndNotesDataSamplesBetween2Dates, isLoading: flowLevelComplaintsAndNotesDataSamplesBetween2DatesIsLoading} = useGetDataSampleBetween2DatesQuery({
    tagCodes: [
        {tagType: 'LOINC', tagCode: '49033-4'},
        {tagType: 'LOINC', tagCode: '75322-8'},
        {tagType: 'LOINC', tagCode: '34109-9'},
    ],
    startDate: currentMonthFirstDate,
    endDate: nextMonthFirstDate,
})
```

Since we have done a single request to fetch all the DataSamples, we will need to filter them to get the DataSamples per category.

```typescript title="/components/AdvancedCalendar/index.tsx"
const [dataSamples, setDataSamples] = useState<{ flowLevel: DataSample[], complaints: DataSample[], notes: DataSample[] }>(undefined)

useEffect(() => {
    if (!!flowLevelComplaintsAndNotesDataSamplesBetween2Dates) {
        const dataSamplesToProcess = flowLevelComplaintsAndNotesDataSamplesBetween2Dates!.rows

        const flowLevelDataSample = dataSamplesToProcess
            .filter(ds => [...ds.labels].some(it => it.type === 'LOINC' && it.code === '49033-4'));

        const complainsDataSample = dataSamplesToProcess
            .filter(ds => [...ds.labels].some(it => it.type === 'LOINC' && it.code === '75322-8'));

        const notesDataSample = dataSamplesToProcess
            .filter(ds => [...ds.labels].some(it => it.type === 'LOINC' && it.code === '34109-9'));

        setDataSamples({ flowLevel: flowLevelDataSample, complaints: complainsDataSample, notes: notesDataSample })
    }
}, [flowLevelComplaintsAndNotesDataSamplesBetween2Dates])
```

We will go much in the details of the tagType and tagCode in the next section. But as you can see, we are fetching the
DataSamples for the FlowLevel, the Complaints and the Notes. We are not using *magic* values for that. We use proper
LOINC Codes to tag the DataSamples. Which allows us to fetch them easily.

## `getTodayFlowLevelData`

We will now create the `getTodayFlowLevelData` function. This function will return the FlowLevel DataSample of the given
date.

```typescript title="/components/AdvancedCalendar/index.tsx"
const getTodayFlowLevelData = (currentDay: Date) => {
    if (!!dataSamples) {
        return dataSamples.flowLevel.find(item => item.valueDate === getDayInNumberFormat(currentDay));
    }
};
```

## `getTodayComplaintDatas`

We will now create the `getTodayComplaintDatas` function. This function will return the Complaints DataSamples of the
given date.

```typescript title="/components/AdvancedCalendar/index.tsx"
const getTodayComplaintDatas = (currentDay: Date) => {
    if (!!dataSamples) {
        return dataSamples.complaints.filter(item => item.valueDate === getDayInNumberFormat(currentDay));
    }
};
```

## `getTodayNotesData`

We will now create the `getTodayNotesData` function. This function will return the Notes DataSample of the given date.

```typescript title="/components/AdvancedCalendar/index.tsx"
const getTodayNotesData = (currentDay: Date) => {
    if (!!dataSamples) {
        return dataSamples.notes.find(item => item.valueDate === getDayInNumberFormat(currentDay));
    }
};
```

----

That's it for now. We will continue in the next section to create DataSamples.
