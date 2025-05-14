import libCom from '../../Common/Library/CommonLibrary';
/**
* Returns query for item list view for single document
* Have ability to set id manually and reuse it for different cases
* @param {IClientAPI} context
* @param {String} docId
*/
export default function NewlyCreatedDocsQuery(context, docId) {
    if (docId) {
        return `$filter=AssociatedMaterialDoc/MaterialDocNumber eq '${docId}'&$expand=AssociatedMaterialDoc`;
    }
    let data = libCom.getStateVariable(context, 'ActualDocId');
    return `$filter=AssociatedMaterialDoc/MaterialDocNumber eq '${data}'&$expand=AssociatedMaterialDoc`;
}
