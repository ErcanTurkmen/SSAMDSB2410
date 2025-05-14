import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import GetMaterialUOM from '../../Inventory/Common/GetMaterialUOM';
export default function SaveSerialNumbers(context) {
    const actualNumbers = libCom.getStateVariable(context, 'SerialNumbers').actual;
    let serialBinding = libCom.getStateVariable(context, 'SerialPageBinding');
    const sectionedTable = context.getPageProxy().getControl('SectionedTable');
    const QuantitySimple = sectionedTable.getControl('QuantitySimple');
    let TempLine_SerialNumbers = [];
    let material = '';
    if (actualNumbers.length) {
        TempLine_SerialNumbers = actualNumbers.filter(item => item.selected);
    }
    let uom = sectionedTable.getControl('UOMSimple').getValue();
    material = serialBinding.Material;

    GetMaterialUOM(context, material, uom).then(TempLine_MaterialUOM => {
        let QuantityInBaseUOM = 0;
        let serialCount = libLocal.toNumber(context, TempLine_SerialNumbers.length);
        let quantityValue = libLocal.toNumber(context, QuantitySimple.getValue());
        libCom.setStateVariable(context, 'EntryQuantity', quantityValue);
        QuantityInBaseUOM = quantityValue;
        if (TempLine_MaterialUOM && TempLine_MaterialUOM.BaseUOM !== uom) {
            QuantityInBaseUOM = quantityValue * TempLine_MaterialUOM.ConversionFactor;
        }
        if (serialCount !== QuantityInBaseUOM) {
            let message = context.localizeText('serial_number_count', [serialCount, QuantityInBaseUOM]);
            libCom.executeInlineControlError(context, QuantitySimple, message);
            return '';
        } else {
            libCom.setStateVariable(context, 'SerialNumbers', { actual: actualNumbers, initial: JSON.parse(JSON.stringify(actualNumbers)) });
            return context.executeAction('/SAPAssetManager/Actions/Inventory/SerialNumbers/SerialNumberCloseModal.action');
        }
    });
}

