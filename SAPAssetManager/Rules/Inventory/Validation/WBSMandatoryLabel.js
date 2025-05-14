import libCom from '../../Common/Library/CommonLibrary';
import { InventoryOrderTypes, InventoryAdhoc } from '../Common/Library/InventoryLibrary';
import GetMovementTypeData from '../GetMovementTypeData';
/**
 * 'Storage location *' with mandatory indicator implementation
 * @param {ClientAPI} context MDK Context
 * @returns {String} formated string with mandatory sign
 */
export default function WBSMandatoryLabel(context) {
    let mandatory = true;
    let movementType = context.binding?.MovementType || '';
    const movType = libCom.getStateVariable(context, 'IMMovementType');
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    if ( movType === InventoryOrderTypes.REV && movementType) {
        movementType = (Number(movementType) + 1).toString();
    }
    return GetMovementTypeData(context, movementType).then((movementTypeData) => {
        if (movementTypeData && movementTypeData.RevMvmtTypeInd && objectType !== InventoryAdhoc.ADHOC) {
         mandatory = false;   
        }
        return libCom.formatCaptionWithRequiredSign(context, 'reservation_item_wbs_element', mandatory);
        });
    }
