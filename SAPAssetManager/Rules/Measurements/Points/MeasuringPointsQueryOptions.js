
export default function MeasuringPointsQueryOptions(context) {
    const dqb = context.dataQueryBuilder();
    dqb.top(3)
        .orderBy('SortField')
        .expand('MeasurementDocs,MeasurementDocs/MeasuringPoint')
        .select('Point,PointDesc,CharName,UoM,IsCounter,CodeGroup,CatalogType,' +
            'MeasurementDocs/ReadingDate,MeasurementDocs/ReadingTime,MeasurementDocs/CodeGroup,MeasurementDocs/ValuationCode,' +
            'MeasurementDocs/CodeShortText,MeasurementDocs/ReadingValue,MeasurementDocs/IsCounterReading,MeasurementDocs/IsCounterReading,' +
            'MeasurementDocs/ReadingTimestamp,MeasurementDocs/CounterReadingDifference,MeasurementDocs/MeasurementDocNum,' +
            'MeasurementDocs/MeasuringPoint/CharName,MeasurementDocs/MeasuringPoint/IsCounter');
    return dqb.build();
}
