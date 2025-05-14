
export default function OnlineMeasurementDocsQueryOptions(context) {
    const dqb = context.dataQueryBuilder();
    dqb.orderBy('ReadingTimestamp desc')
        .select('Point,MeasurementDocNum,CodeGroup,ReadingDate,ReadingTime,HasReadingValue,ReadingValue,UOM,' +
        'ValuationCode,CodeShortText,ShortText,ReadBy,IsCounterReading,CounterReadingDifference');
    return dqb.build().then(queryString => queryString + `&$filter=Point eq '${context.binding.Point}'`);
}
