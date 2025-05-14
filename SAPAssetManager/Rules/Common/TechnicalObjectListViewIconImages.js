import AttachedDocumentIcon from '../Documents/AttachedDocumentIcon';
import CommonLibrary from './Library/CommonLibrary';

export default function TechnicalObjectListViewIconImages(context) {
    const binding = context.binding;
    const isEquipment = binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue();
    return isEquipment ? GetEquipmentIconImages(context, binding) : GetFlocIconImages(context, binding);
}

/** @param {MyFunctionalLocation} floc  */
export function GetFlocIconImages(context, floc) {
    const docs = floc.FuncLocDocuments || [];
    return GetIconImages(context, floc['@sap.isLocal'], docs);
}

/** @param {MyEquipment} equipment  */
export function GetEquipmentIconImages(context, equipment) {
    const docs = equipment.EquipDocuments || [];
    return GetIconImages(context, equipment['@sap.isLocal'], docs);
}

function GetIconImages(context, islocal, docs) {
    const iconImage = [];

    if (islocal || docs.some(doc => doc['@sap.isLocal'])) {
        iconImage.push(CommonLibrary.GetSyncIcon(context));
    }

    // check if this FLOC has any docs
    const docIcon = AttachedDocumentIcon(context, docs);
    if (docIcon) {
        iconImage.push(docIcon);
    }

    return iconImage;
}
