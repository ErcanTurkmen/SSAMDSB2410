import EDTHelper from '../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTStartMarkerDistanceControl(context) {
    let measurements = context.binding.MeasurementDocs;
    let parameters = EDTHelper.getLAMNumericControlParameters(context, measurements, 'StartMarkerDistance');

    if (!parameters.Value) {
        parameters = EDTHelper.getParentPointLAMNumericControlParameters(context, 'StartMarkerDistance');
    }

    return     {
        'Type': 'Number',
        'Name': 'StartMarkerDistance',
        'IsMandatory': false,
        'IsReadOnly': false,
        'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/LAM/MeasuringPointsEDTDistanceOnValueChange.js',
        'Property': 'LAMObjectDatum_Nav/StartMarkerDistance',
        'Parameters': parameters,
    };
}
