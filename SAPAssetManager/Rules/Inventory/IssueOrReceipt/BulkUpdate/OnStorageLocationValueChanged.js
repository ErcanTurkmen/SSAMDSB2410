import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import IssueOrReceiptSignatureWatermark from '../IssueOrReceiptSignatureWatermark';
import libInv from '../../Common/Library/InventoryLibrary';

export default async function OnStorageLocationValueChanged(context) {
        ResetValidationOnInput(context);
        //fetch plant and storage location values and store in state variables and update signature watermark with updated ones
        const formcellContainer = context.getPageProxy().getControl('FormCellContainer');
        const plantControl = formcellContainer.getControl('PlantSimple');
        const storageLocationControl = formcellContainer.getControl('StorageLocationPicker');
        
        const Plant = libInv.GetListPickerSelection(plantControl);
        const StorageLocation = libInv.GetListPickerSelection(storageLocationControl);

        CommonLibrary.setStateVariable(context,'WatermarkPlant',Plant);
        CommonLibrary.setStateVariable(context, 'WatermarkStorageLocation',StorageLocation);
        
        const watermark = await IssueOrReceiptSignatureWatermark(context);
        const signature = formcellContainer.getControl('SignatureCaptureFormCell');
        signature.setWatermarkText(watermark);
        signature.redraw();
}
