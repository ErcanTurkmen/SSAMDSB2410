import libCom from '../../Common/Library/CommonLibrary';
export default function MaterialDocumentDeleteReadLink(context) {
    const MaterialDocNumber = libCom.getStateVariable(context, 'MaterialDocNumberBulkUpdate');
    const MaterialDocYear = libCom.getStateVariable(context, 'MaterialDocYearBulkUpdate');
    if (MaterialDocNumber && MaterialDocYear) {
        return `MaterialDocuments(MaterialDocNumber='${MaterialDocNumber}',MaterialDocYear='${MaterialDocYear}')`;
    }
    return '#Property:TempHeader_MatDocReadLink';
}
