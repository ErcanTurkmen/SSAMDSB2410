import libCom from '../../Common/Library/CommonLibrary';
export default function GetDocumentItemBatchValue(context) {
    let batch =  libCom.getListPickerValue(context.getPageProxy().getControl('FormCellContainer').getControl('BatchListPicker').getValue());

    if (batch) {
        return batch.toUpperCase();
    }
    return '';
}
