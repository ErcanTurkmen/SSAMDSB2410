import libCom from '../../Common/Library/CommonLibrary';

/**
* There are 2 configurations in the backend that need to be accounted for:
* If MeasurementDocuments are present then read the previous reading info from there
* If MeasurementDocuments aren't there then read from the MeasuringPoint entitySet itself
* @param {IClientAPI} context
*/
export default function MeasuringPointDetailsPreviousEntitySet(context) {
    let binding = context.binding;
    if (libCom.isDefined(binding) &&
        libCom.isDefined(binding.MeasurementDocs) &&
        binding.MeasurementDocs.length > 0) {
        return `${context.binding['@odata.readLink']}/MeasurementDocs`;
    } else {
        return context.binding['@odata.readLink'];
    }
}
