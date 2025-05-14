import libCom from '../../Common/Library/CommonLibrary';
import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';
import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';
import ShowQuantityInBaseUOM from '../IssueOrReceipt/ShowQuantityInBaseUOM';
export default function SerialNumberNav(context) {
    const control = context.getPageProxy().getControl('FormCellContainer');
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const page = libCom.getPageName(context);
    const isVehicle = (page === 'VehicleIssueOrReceiptCreatePage') && EnableMultipleTechnician(context);
    let Batch = '';
    if (!isVehicle && control.getControl('BatchListPicker')) {
        Batch = libCom.getListPickerValue(control.getControl('BatchListPicker').getValue());
    }

    const StorageBin = !isVehicle && control.getControl('StorageBinSimple').getValue();
    let UOM = '';
    let Material = '';

    if (context.binding && !isVehicle) {
        context.binding.EntryQuantity = Number(control.getControl('QuantitySimple').getValue());
        UOM = libCom.getListPickerValue(control.getControl('UOMSimple').getValue());
        Material = context.binding.MaterialNum || context.binding.Material;
        if (objectType === 'IB' || objectType === 'OB') {
            const openQuantity = Number(control.getControl('QuantitySimple').getValue()) - Number(control.getControl('RequestedQuantitySimple').getValue().split('/')[0]);
            libCom.setStateVariable(context, 'OpenQuantity', openQuantity);
        }
    } else {
        UOM = isVehicle ? (control.getControl('MaterialUOMLstPkr').getValue().length && control.getControl('MaterialUOMLstPkr').getValue()[0].ReturnValue) : libCom.getListPickerValue(control.getControl('UOMSimple').getValue());
        Material = getMaterial(isVehicle, control);
        updateEntryQuantity(control, context);
    }
    return ShowQuantityInBaseUOM(context, Material).then(UOMVisible => {
        libCom.setStateVariable(context, 'SerialPageBinding', { UOM, Batch, StorageBin, Material, UOMVisible });
        return context.executeAction('/SAPAssetManager/Actions/Inventory/SerialNumbers/SerialNumber.action');
    });
}

function getMaterial(isVehicle, control) {
    let Material = !isVehicle && control.getControl('MatrialListPicker').getValue()[0].DisplayValue.Title.split('-')[0];
    if (isVehicle) {
        let readLink = control.getControl('MaterialLstPkr').getValue()[0].ReturnValue;
        Material = SplitReadLink(readLink).MaterialNum;
    }
    return Material;
}

export function updateEntryQuantity(control, context) {
    const entryQuantity = Number(control.getControl('QuantitySimple').getValue());
    libCom.setStateVariable(context, 'EntryQuantity', entryQuantity);
    if (context.binding) {
        context.binding.EntryQuantity = entryQuantity;
    } else {
        const binding = { EntryQuantity: entryQuantity };
        context.getPageProxy().setActionBinding(binding);
    }
    return context;
}
