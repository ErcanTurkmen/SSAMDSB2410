import CommonLibrary from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function OnDocumentSelectedOrUnselected(context) {
    if (!libVal.evalIsEmpty(context.getPageProxy().getControls()) && context.getPageProxy().getControls().length > 0 && !libVal.evalIsEmpty(context.getPageProxy().getControls()[0].getSections()) && context.getPageProxy().getControls()[0].getSections().length > 0) {
        let item = context.getPageProxy().getControls()[0].getSections()[0].getSelectionChangedItem();
        let documents = CommonLibrary.getStateVariable(context, 'DiscardDocuments');
        if (libVal.evalIsEmpty(documents)) {
            documents = [];
        }

        updateDocumentObject(item, documents, context);

        let enableDiscardButton = false;
        const discardDocuments = CommonLibrary.getStateVariable(context, 'DiscardDocuments');
        if (discardDocuments && discardDocuments.length > 0) {
            enableDiscardButton = true;
        }
        CommonLibrary.enableToolBar(context, 'InboundOutboundListPage', 'DiscardButton', enableDiscardButton);
    }
    return true;
}

function updateDocumentObject(item, documents, context) {
    if (item.selected) {
        let document = Object();
        document.ObjectId = item.binding.ObjectId;
        document.OrderId = item.binding.OrderId;
        document.IMObject = item.binding.IMObject;
        document.ReadLink = item.binding['@odata.readLink'];
        documents.push(document);
        CommonLibrary.setStateVariable(context, 'DiscardDocuments', documents);
    } else {
        let newDocuments = [];
        if (documents.length > 0) {
            for (let i = 0; i < documents.length; i++) {
                if (!(documents[i].ObjectId === item.binding.ObjectId && documents[i].OrderId === item.binding.OrderId)) {
                    let document = Object();
                    document.ObjectId = documents[i].ObjectId;
                    document.OrderId = documents[i].OrderId;
                    document.IMObject = documents[i].IMObject;
                    document.ReadLink = document[i].ReadLink;
                    newDocuments.push(document);
                }
            }
        }
        CommonLibrary.setStateVariable(context, 'DiscardDocuments', newDocuments);
    }
}
