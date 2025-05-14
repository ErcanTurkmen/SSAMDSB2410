import EDTHelper from '../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTStartPointControl(context) {
    let measurements = context.binding.MeasurementDocs;
    let parameters = EDTHelper.getLAMNumericControlParameters(context, measurements, 'StartPoint');

    if (!parameters.Value) {
        parameters = EDTHelper.getParentPointLAMNumericControlParameters(context, 'StartPoint');
    }

    return {
        'Type': 'Number',
        'Name': 'StartPoint',
        'IsMandatory': false,
        'IsReadOnly': false,
        'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/LAM/MeasuringPointsEDTDistanceOnValueChange.js',
        'Property': 'LAMObjectDatum_Nav/StartPoint',
        'Parameters': parameters,
    };
}
