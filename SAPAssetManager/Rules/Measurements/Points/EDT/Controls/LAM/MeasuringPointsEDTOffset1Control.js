import EDTHelper from '../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTOffset1Control(context) {
    let measurements = context.binding.MeasurementDocs;
    let parameters = EDTHelper.getLAMNumericControlParameters(context, measurements, 'Offset1Value');

    if (!parameters.Value) {
        parameters = EDTHelper.getParentPointLAMNumericControlParameters(context, 'Offset1Value');
    }

    return {
        'Type': 'Number',
        'Name': 'Offset1',
        'IsMandatory': false,
        'IsReadOnly': false,
        'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/MeasuringPointsEDTOnValueChange.js',
        'Property': 'LAMObjectDatum_Nav/Offset1Value',
        'Parameters': parameters,
    };
}
