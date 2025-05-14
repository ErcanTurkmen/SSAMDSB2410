/**
* This function determines if UOM field is to be shown or not in Goods Issue/Receipt screen
* @param {IClientAPI} context
*/
import GetUOM from './GetUOM';
import QuantityInBaseUOM from './QuantityInBaseUOM';
import libCom from '../../Common/Library/CommonLibrary';

export default function ShowQuantityInBaseUOM(context, material) {
    let OrderUOM = '';
    const pageContainer = context.getPageProxy().getControl('FormCellContainer');

    if (context.binding) {
        const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            return Promise.resolve(false);
        }
    }
    if (pageContainer) { //Handle processing this from multiple page sources
        let uomControl = pageContainer.getControl('UOMSimple');
        if (!uomControl) uomControl = pageContainer.getControl('MaterialUOMLstPkr');
        if (uomControl) OrderUOM = libCom.getListPickerValue(uomControl.getValue());
    }
    if (!OrderUOM) {
        OrderUOM = GetUOM(context);
    }
    return QuantityInBaseUOM(context, material).then(result => {
        const [, entryUOM] = decodeUOM(result);
        return (entryUOM !== OrderUOM);
    });

}

export function decodeUOM(quantityString) {
    const matched = quantityString.match(/(\S*) (\S*)/);
    return matched ? matched.splice(1) : ['', ''];
}



