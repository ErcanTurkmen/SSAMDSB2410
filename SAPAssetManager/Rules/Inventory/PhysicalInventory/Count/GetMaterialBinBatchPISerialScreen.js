import libCom from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
export default function GetMaterialBinBatchPISerialScreen(context) {
    const target = context.binding;
    let type;
    let material = '';
    let batch = '';
    let bin = '';

    if (target && (target.MaterialNum || target.Material)) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        material = target.MaterialNum || target.Material || '';

        //Counting a PI Item from PI details page
        batch = target.Batch;
        bin = target.MaterialSLoc_Nav?.StorageBin;
        libCom.setStateVariable(context, 'EntryUOM', target.EntryUOM);
    }
    let page;
    page = getPage(context, type, page, target);
    if (page) {
        material = page.getControl('FormCellContainer').getControl('MatrialListPicker').getValue()[0].ReturnValue;
        bin = page.getControl('FormCellContainer').getControl('StorageBinSimple').getValue();
        const batchControl = page.getControl('FormCellContainer').getControl('BatchListPicker').getValue()[0];
        batch = batchControl ? batchControl.ReturnValue : '';
        libCom.setStateVariable(context, 'EntryUOM', libCom.getListPickerValue(page.getControl('FormCellContainer').getControl('UOMListPicker').getValue()));
    }

    if (material) {
        return [material, bin, batch].filter(Boolean).join('/');
    }
}

function getPage(context, type, page, target) {
    if (type === 'PhysicalInventoryDocHeader' || !(target && (target.MaterialNum || target.Material))) { //Adding new item to a local PI header, either from overview (no binding) or from PI details
        try {
            page = context.evaluateTargetPathForAPI('#Page:PhysicalInventoryItemCreateUpdatePage');
        } catch (err) {
            Logger.error('PhysicalInventory', err);
        }
        if (!page) {
            try {
                page = context.evaluateTargetPathForAPI('#Page:PhysicalInventoryCreateUpdatePage');
            } catch (err) {
                Logger.error('PhysicalInventory', err);
            }
        }
        return page;
    }
    return '';
}

