import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import { FLDocumentTypeValues } from '../Common/FLLibrary';

export default function FLOnDemandObjectOnDocumentSelectedOrUnSelectedType(context) {
    const objectTable  = context.getPageProxy()?.getControl('SectionedTable')?.getSection('OnlineDocumentsListViewSection');
    if (!libVal.evalIsEmpty(objectTable)) {
        let item = objectTable.getSelectionChangedItem();
        let documents = libCom.getStateVariable(context, 'Documents');
        if (libVal.evalIsEmpty(documents)) {
            documents = [];
        }

        if (item.selected) {
            let document = Object();
            document.ObjectId = item.binding.VoyageStageUUID || '';
            document.FLObject = FLDocumentTypeValues.Voyage;
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
        newDocuments = documents.filter(doc => doc.ObjectId !== item.binding.VoyageStageUUID);
    }
    libCom.setStateVariable(context, 'Documents', newDocuments);
}
