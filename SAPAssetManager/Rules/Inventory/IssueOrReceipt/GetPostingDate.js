import libCom from '../../Common/Library/CommonLibrary';
import isInventoryClerk from '../../SideDrawer/EnableInventoryClerk';
import ODataDate from '../../Common/Date/ODataDate';

export default function GetPostingDate(context) {
    let data = {};
    if (isInventoryClerk(context)) {
        data = libCom.getStateVariable(context, 'FixedData');
    }
    let objectType = libCom.getStateVariable(context, 'IMObjectType');
    let moveType = libCom.getStateVariable(context, 'IMMovementType');
    let date;
    if (context.binding) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        //Issue
        if (type === 'MaterialDocItem' && !(objectType === 'REV' && moveType !== 'EDIT')) {
            date = context.binding.AssociatedMaterialDoc.PostingDate;
        } else if (type === 'MaterialDocument') {
            date = context.binding.PostingDate;
        }
        
        if (context.binding.TempHeader_PostingDate) {
            date = context.binding.TempHeader_PostingDate;
        }
    }
    if (data && data.postingDate) {
        date = data.postingDate;
    } 
    if (date) {
        return new ODataDate(date).toLocalDateString();
    }

    return new Date(); //If not editing an existing local receipt item, then default to current date
}

