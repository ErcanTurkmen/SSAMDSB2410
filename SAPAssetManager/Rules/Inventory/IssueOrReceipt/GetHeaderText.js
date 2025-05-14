import libCom from '../../Common/Library/CommonLibrary';
import isInventoryClerk from '../../SideDrawer/EnableInventoryClerk';

export default function GetHeaderText(context) {
    let data = {};
    if (isInventoryClerk(context)) {
        data = libCom.getStateVariable(context, 'FixedData');
    }
    let objectType = libCom.getStateVariable(context, 'IMObjectType');
    let moveType = libCom.getStateVariable(context, 'IMMovementType');

    if (context.binding) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);

        //Issue
        if (type === 'MaterialDocItem' && !(objectType === 'REV' && moveType !== 'EDIT')) {
            return context.binding.AssociatedMaterialDoc.HeaderText;
        } else if (type === 'MaterialDocument') {
            return context.binding.HeaderText;
        }
        
        if (context.binding.TempHeader_HeaderText) {
            return context.binding.TempHeader_HeaderText;
        }
    }
    if (data && data.headerNote) return data.headerNote;
    return ''; //If not editing an existing local receipt item, then default to empty
}
