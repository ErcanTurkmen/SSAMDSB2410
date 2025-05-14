import libCom from '../../Common/Library/CommonLibrary';

export default function GetPhysicalInventoryDocumentItemVendorValue(context) {
    return libCom.getStateVariable(context, 'PhysicalInventoryItemVendorListPicker') || '';
}
