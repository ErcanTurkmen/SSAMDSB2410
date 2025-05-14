import Logger from '../../Log/Logger';
import PurchaseRequisitionLibrary from './PurchaseRequisitionLibrary';

export default function PurchaseRequisitionHeaderLongText(context) {
    const binding = context.binding;

    let purchaseReqNo = PurchaseRequisitionLibrary.getLocalHeaderId(context);
    if (binding) {
        purchaseReqNo = binding.PurchaseReqNo;
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', `PurchaseRequisitionHeaders('${purchaseReqNo}')`, [], '$expand=PurchaseRequisitionLongText_Nav').then(result => {
        if (result.length) {
            let header = result.getItem(0);
            if (header.PurchaseRequisitionLongText_Nav && header.PurchaseRequisitionLongText_Nav.length) {
                let headerNote = header.PurchaseRequisitionLongText_Nav.find(note => !note.PurchaseReqItemNo || note.PurchaseReqItemNo === '00000');
                return getHeaderNoteText(headerNote);
            }
        }

        if (binding && binding.PurchaseRequisitionLongText_Nav && binding.PurchaseRequisitionLongText_Nav.length) {
            let headerNote = binding.PurchaseRequisitionLongText_Nav.find(note => !note.PurchaseReqItemNo || note.PurchaseReqItemNo === '00000');
            return getHeaderNoteText(headerNote);
        }

        return '';
    })
    .catch(error => {
        Logger.error('PurchaseRequisitionHeaderLongText',error);
        return Promise.resolve('');
    });
}

function getHeaderNoteText(headerNote) {
    return headerNote ? headerNote.TextString : ''; 
}
