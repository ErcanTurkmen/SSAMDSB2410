import libCom from '../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function EDTBulkUpdate(context) {
    const pageProxy = context.getPageProxy();
    if (pageProxy) {
        const extension = pageProxy._page.controls[0].sections[libCom.getStateVariable(context, 'bulkExtensionIndex')].extensions[0];
        if (extension) {
            const masterRowIndex = extension.getSelectedMasterRowIndex();
            const disabledRowIndex = extension.getSelectedDisabledRowIndexes();

            // Get the updated cell values from the master row
            let masterRowCells = extension.getRowCells(masterRowIndex);
            masterRowCells.forEach(cell => {
                if (cell.isModified()) {
                    // Copy value from the updated cell value
                    let value = cell.getValue();
                    disabledRowIndex.forEach(index => {
                        extension.getRowCellByName(index, cell.getName()).setValue(value);
                    });
                }
            });
        }
    }
}
