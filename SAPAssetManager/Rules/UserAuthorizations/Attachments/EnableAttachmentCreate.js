/**
* Show/Hide Attachment create/edit based on user authorization
* @param {IClientAPI} context
*/
import DocLib from '../../Documents/DocumentLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import libPersona from '../../Persona/PersonaLibrary';
import DocumentsIsVisible from '../../Documents/DocumentsIsVisible';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';

export default function EnableAttachmentCreate(context) {
    if (libPersona.isWCMOperator(context) || !DocumentsIsVisible(context) || libPersona.isInventoryClerk(context)) {
        return false;
    }

    switch (DocLib.getParentObjectType(context)) {
        case DocLib.ParentObjectType.Equipment:
            return (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.EQ.Attach') === 'Y');
        case DocLib.ParentObjectType.FunctionalLocation:
            return (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.FL.Attach') === 'Y');
        case DocLib.ParentObjectType.WorkOrder:
        case DocLib.ParentObjectType.Operation:
        case DocLib.ParentObjectType.SubOperation:
            return !libWO.isWorkOrderInCreatedState(context);              
        default: 
            return true;
    }

}
