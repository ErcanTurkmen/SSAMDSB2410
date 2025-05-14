import libCom from '../../Common/Library/CommonLibrary';
import { InventoryOrderTypes } from '../Common/Library/InventoryLibrary';

export default function ShowOrderedOrConfirmedQuantityField(context) {
    let type = libCom.getStateVariable(context, 'IMObjectType');
    return (type in InventoryOrderTypes) ? true : false;
}
