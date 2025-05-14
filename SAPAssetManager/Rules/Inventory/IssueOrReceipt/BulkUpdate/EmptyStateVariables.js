
import libCom from '../../../Common/Library/CommonLibrary';
export default function EmptyStateVariables(context) {
    libCom.removeStateVariable(context, 'MaterialDocumentBulkUpdate');
    libCom.removeStateVariable(context, 'MaterialDocNumberBulkUpdate');
    libCom.removeStateVariable(context, 'MaterialDocYearBulkUpdate');
    libCom.removeStateVariable(context, 'ActualDocId');
    libCom.removeStateVariable(context, 'FixedData');
    libCom.removeStateVariable(context, 'IsAlreadyCreatedDoc');
    libCom.removeStateVariable(context, 'CurrentDocsItemsMovementType');
    libCom.removeStateVariable(context, 'CurrentDocsItemsStorageLocation');
    libCom.removeStateVariable(context, 'CurrentDocsItemsPlant');
    libCom.removeStateVariable(context, 'CurrentDocsItemsOrderNumber');
    libCom.removeStateVariable(context, 'Temp_MaterialDocumentReadLink');
    libCom.removeStateVariable(context, 'Temp_MaterialDocumentNumber');
    libCom.removeStateVariable(context, 'BulkUpdateFinalSave');
    libCom.removeStateVariable(context, 'skipToastAndClosePageOnDocumentCreate');
    libCom.removeStateVariable(context, 'BulkUpdateItemSelectionMap');
    libCom.removeStateVariable(context, 'BulkUpdateItem');
    libCom.removeStateVariable(context, 'BulkUpdateTotalItems');
    libCom.removeStateVariable(context, 'BatchRequiredForFilterADHOC');
}
