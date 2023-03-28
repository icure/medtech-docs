# Cycles history

So. Now we have 2 features implemented related to DataSamples. We can create a new DataSample and fetch a list of DataSamples for each month.

It'd be cool to be able to see the history of a DataSample. So let's implement that!

First step is to uncomment the TSX code in the `CycleHistory` and `CycleItem` components.

## CycleHistory

The only piece of code to add here is the fetch the latest DataSamples created (limit to 1000).

```tsx
  const {data: allFlowLevelDataSamples, isLoading: allFlowLevelDataSamplesIsLoading} = useGetDataSampleByTagTypeQuery({
    tagType: 'LOINC',
    tagCode: '49033-4',
  });
```

Which will allow us to fetch the latest DataSamples to compute the cycles using `getCyclesDates` in the View.

## CycleItem

```tsx
const [dataSamples, setDataSamples] = useState<{ flowLevel: DataSample[], complaints: DataSample[], notes: DataSample[] }>(undefined)

const { data: flowLevelComplaintsAndNotesDataSamplesBetween2Dates, isLoading: flowLevelDataSampleBetween2DatesIsLoading } = useGetDataSampleBetween2DatesQuery({
    tagCodes: [
        {
            tagType: 'LOINC',
            tagCode: '49033-4',
        },
        {
            tagType: 'LOINC',
            tagCode: '75322-8',
        },
        {
            tagType: 'LOINC',
            tagCode: '34109-9',
        },
    ],
    startDate: currentCycleFirstDay,
    endDate: nextCycleFirstDay,
});

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


const getTodayFlowLevelData = (currentDay: Date) => {
    if (!!dataSamples) {
        return dataSamples
            .flowLevel
            .find(item => item?.valueDate === getDayInNumberFormat(currentDay) && item?.content?.en?.measureValue?.value > 0);
    }
};

const getTodayComplaintData = (currentDay: Date) => {
    if (!!dataSamples) {
        return dataSamples
            .complaints
            .filter(item => item.valueDate === getDayInNumberFormat(currentDay));
    }
};

const getTodayNotesData = (currentDay: Date) => {
    if (!!dataSamples) {
        return dataSamples
            .notes
            .find(item => item.valueDate === getDayInNumberFormat(currentDay));
    }
};
```

As we did in the AdvancedCalendar, we fetch the DataSamples between 2 dates. We then filter the DataSamples to get the ones related to the flow level, the complaints and the notes.
