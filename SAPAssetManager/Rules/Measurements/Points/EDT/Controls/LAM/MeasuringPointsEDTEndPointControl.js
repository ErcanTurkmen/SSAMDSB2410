import EDTHelper from '../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTEndPointControl(context) {
    let measurements = context.binding.MeasurementDocs;
    let parameters = EDTHelper.getLAMNumericControlParameters(context, measurements, 'EndPoint');

    if (!parameters.Value) {
        parameters = EDTHelper.getParentPointLAMNumericControlParameters(context, 'EndPoint');
    }
    
    return  {
        'Type': 'Number',
        'Name': 'EndPoint',
        'IsMandatory': false,
        'IsReadOnly': false,
        'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/LAM/MeasuringPointsEDTDistanceOnValueChange.js',
        'Property': 'LAMObjectDatum_Nav/EndPoint',
        'Parameters': parameters,
    };
}
