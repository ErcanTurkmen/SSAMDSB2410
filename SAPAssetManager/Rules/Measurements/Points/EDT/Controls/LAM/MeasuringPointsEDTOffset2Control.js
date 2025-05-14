import EDTHelper from '../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTOffset2Control(context) {
    let measurements = context.binding.MeasurementDocs;
    let parameters = EDTHelper.getLAMNumericControlParameters(context, measurements, 'Offset2Value');

    if (!parameters.Value) {
        parameters = EDTHelper.getParentPointLAMNumericControlParameters(context, 'Offset2Value');
    }

    return {
        'Type': 'Number',
        'Name': 'Offset2',
        'IsMandatory': false,
        'IsReadOnly': false,
        'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/MeasuringPointsEDTOnValueChange.js',
        'Property': 'LAMObjectDatum_Nav/Offset2Value',
        'Parameters': parameters,
    };
}
