import DocumentCreateDelete from '../../../Documents/Create/DocumentCreateDelete';
/**
* Handle document creation on Operation Create Update
* @param {context} context
*/
export default function WorkOrderOperationUpdateOnSuccess(context) {
    return DocumentCreateDelete(context);
}
