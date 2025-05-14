import libCom from '../../Common/Library/CommonLibrary';

export default function GetPhysicalInventoryDocumentItemWBSElementValue(context) {
    return libCom.getStateVariable(context, 'PhysicalInventoryItemWBSElementSimple') || '';
}
