import MeasuringPointsEDTLinearReferencePatternIdValue from './Values/LAM/MeasuringPointsEDTLinearReferencePatternIdValue';

export default function MeasuringPointsEDTLamMarkerQueryOptions(context) {
    const lrpId = MeasuringPointsEDTLinearReferencePatternIdValue(context);
    return lrpId ? `$filter=LRPId eq '${lrpId}'&$orderby eq 'Marker'` : '$filter=true';
}
