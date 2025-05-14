import CommonLibrary from '../../Common/Library/CommonLibrary';
import IssueOrReceiptSignatureWatermark from './IssueOrReceiptSignatureWatermark';

export default async function IssueOrReceiptSignatoryValue(context) {
   let value = context.getPageProxy().getControl('FormCellContainer').getControl('Signatory').getValue();
    //fill userid of watermark with the same 
   CommonLibrary.setStateVariable(context, 'GoodsRecipientSignatory', value);
   let watermark = await IssueOrReceiptSignatureWatermark(context);
   let signature = context.getPageProxy().getControl('FormCellContainer').getControl('SignatureCaptureFormCell');
   signature.setWatermarkText(watermark);
   signature.redraw();
    return value;
}

    
