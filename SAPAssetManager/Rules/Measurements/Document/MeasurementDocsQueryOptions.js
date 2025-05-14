import libCom from '../../Common/Library/CommonLibrary';

export default function MeasurementDocsQueryOptions(context) {
    const pageName = libCom.getPageName(context);
    const dqb = context.dataQueryBuilder();
    dqb.orderBy('ReadingTimestamp desc')
        .expand('MeasuringPoint')
        .select('Point,MeasurementDocNum,CodeGroup,ReadingDate,ReadingTime,HasReadingValue,ReadingValue,UOM,' +
            'ValuationCode,CodeShortText,ShortText,ReadBy,IsCounterReading,CounterReadingDifference,MeasuringPoint/PointDesc,MeasuringPoint/CharName,' +
            'MeasuringPoint/CharDescription,MeasuringPoint/IsCounter,MeasuringPoint/UoM,MeasuringPoint/CodeGroup,' +
            'MeasuringPoint/CatalogType,MeasuringPoint/CounterOverflow,MeasuringPoint/IsCounter,MeasuringPoint/IsCounterOverflow,' +
            'MeasuringPoint/IsReverse,MeasuringPoint/IsLowerRange,MeasuringPoint/IsUpperRange,MeasuringPoint/IsCodeSufficient,' +
            'MeasuringPoint/LowerRange,MeasuringPoint/UpperRange,MeasuringPoint/Decimal');
    if (pageName !== 'MeasuringPointHistoryListViewPage') {
        dqb.top(10);
    }
    return dqb.build().then(queryString => queryString + `&$filter=Point eq '${context.binding.Point}'`);
}
