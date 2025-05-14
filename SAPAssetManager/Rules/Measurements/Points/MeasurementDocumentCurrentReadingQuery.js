import libCom from '../../Common/Library/CommonLibrary';

/**
* Returns the query options for the Current Reading section
* @param {IClientAPI} context
*/
export default function MeasurementDocumentCurrentReadingQuery(context) {
    let binding = context.binding;
    if (libCom.isDefined(binding) &&
        libCom.isDefined(binding.MeasurementDocs) &&
        binding.MeasurementDocs.some(doc => doc['@sap.isLocal'])) {
        return '$filter=sap.islocal()&$expand=MeasuringPoint&$orderby=ReadingTimestamp desc&$top=1';
    } else {
        return '';
    }

}
