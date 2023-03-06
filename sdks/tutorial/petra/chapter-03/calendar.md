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
flowLevel = {getTodayFlowLevelData(new Date(date.dateString)
)?.
content.en.measureValue.value
}
hasComplaint = {!!
getTodayComplaintDatas(new Date(date.dateString))?.length || !!getTodayNotesData(new Date(date.dateString))?.content.en.stringValue
}
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
  const {
    data: flowLevelDataSampleBetween2Dates,
    isLoading: flowLevelDataSampleBetween2DatesIsLoading
} = useGetDataSampleBetween2DatesQuery({
    tagType: 'LOINC',
    tagCode: '49033-4',
    startDate: currentMonthFirstDate,
    endDate: nextMonthFirstDate,
});

const {
    data: complaintDataSampleBetween2Dates,
    isLoading: complaintDataSampleBetween2DatesIsLoading
} = useGetDataSampleBetween2DatesQuery({
    tagType: 'LOINC',
    tagCode: '75322-8',
    startDate: currentMonthFirstDate,
    endDate: nextMonthFirstDate,
});

const {
    data: noteDataSampleBetween2Dates,
    isLoading: noteDataSampleBetween2DatesIsLoading
} = useGetDataSampleBetween2DatesQuery({
    tagType: 'LOINC',
    tagCode: '34109-9',
    startDate: currentMonthFirstDate,
    endDate: nextMonthFirstDate,
});

```

We will go much in the details of the tagType and tagCode in the next section. But as you can see, we are fetching the
DataSamples for the FlowLevel, the Complaints and the Notes and we are not using *magic* values for that. We use proper
LOINC Codes to tag the DataSamples. Which allows us to fetch them easily.

## `getTodayFlowLevelData`

We will now create the `getTodayFlowLevelData` function. This function will return the FlowLevel DataSample of the given
date.

```typescript title="/components/AdvancedCalendar/index.tsx"
const getTodayFlowLevelData = (currentDay: Date) => {
    if (!flowLevelDataSampleBetween2DatesIsLoading) {
        return flowLevelDataSampleBetween2Dates?.rows.find(item => item.valueDate === getDayInNumberFormat(currentDay));
    }
};
```

## `getTodayComplaintDatas`

We will now create the `getTodayComplaintDatas` function. This function will return the Complaints DataSamples of the
given date.

```typescript title="/components/AdvancedCalendar/index.tsx"
const getTodayComplaintDatas = (currentDay: Date) => {
    if (!complaintDataSampleBetween2DatesIsLoading) {
        return complaintDataSampleBetween2Dates?.rows.filter(item => item.valueDate === getDayInNumberFormat(currentDay));
    }
};
```

## `getTodayNotesData`

We will now create the `getTodayNotesData` function. This function will return the Notes DataSample of the given date.

```typescript title="/components/AdvancedCalendar/index.tsx"
const getTodayNotesData = (currentDay: Date) => {
    if (!noteDataSampleBetween2DatesIsLoading) {
        return noteDataSampleBetween2Dates?.rows.find(item => item.valueDate === getDayInNumberFormat(currentDay));
    }
};
```

----

That's it for now. We will continue in the next section to create DataSamples.
