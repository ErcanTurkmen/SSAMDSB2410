import EDTHelper from '../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTLengthControl(context) {
    let measurements = context.binding.MeasurementDocs;
    let parameters = EDTHelper.getLAMNumericControlParameters(context, measurements, 'Length');

    if (!parameters.Value) {
        parameters = EDTHelper.getParentPointLAMNumericControlParameters(context, 'Length');
    }

    return {
        'Type': 'Number',
        'Name': 'Length',
        'IsMandatory': false,
        'IsReadOnly': false,
        'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/MeasuringPointsEDTOnValueChange.js',
        'Property': 'LAMObjectDatum_Nav/Length',
        'Parameters': parameters,
    };
}
