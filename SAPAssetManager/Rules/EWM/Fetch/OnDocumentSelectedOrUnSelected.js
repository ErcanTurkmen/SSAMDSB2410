/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import { DocumentTypes,EWMType } from '../Common/EWMLibrary';
export default function OnDocumentSelectedOrUnSelected(context) {
    const objectTable  = context.getPageProxy()?.getControl('SectionedTable')?.getSection('OnlineDocumentsListViewSection');
    if (!libVal.evalIsEmpty(objectTable)) {
        let item = objectTable.getSelectionChangedItem();
        let documents = libCom.getStateVariable(context, 'Documents');
        if (libVal.evalIsEmpty(documents)) {
            documents = [];
        }

        if (item.selected) {
            let document = Object();
            const binding = item.binding;
            const type = item.binding['@odata.type'].substring('#sap_mobile.'.length);
            if (type === EWMType.WarehouseOrder) {
            document.WarehouseNo = binding.WarehouseNo;
            document.WarehouseOrder = binding.WarehouseOrder;
            document.DocumentType = DocumentTypes.WarehouseOrder;
            }
            documents.push(document);

            libCom.setStateVariable(context, 'Documents', documents);
        } else {
            handleUnselectedItem(documents, item, context);
        }
    }
    return true;
}
function handleUnselectedItem(documents, item, context) {
    let newDocuments = [];
    if (documents.length > 0) {
        for (let document of documents) {
            if (!(document.WarehouseNo === item.binding.WarehouseNo && document.WarehouseOrder === item.binding.WarehouseOrder)) {
                let newDocument = Object();
                newDocument.WarehouseNo = document.WarehouseNo;
                newDocument.WarehouseOrder = document.WarehouseOrder;
                newDocument.DocumentType = document.DocumentType;
                newDocuments.push(newDocument);
            }
        }
    }
    libCom.setStateVariable(context, 'Documents', newDocuments);
}
