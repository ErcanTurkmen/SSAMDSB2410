
import libCom from '../../Common/Library/CommonLibrary';
/**
 * @param {IListPickerFormCellProxy} context
*/
export default function SpecialStockListPickerIsVisible(context) {
    return !!(context.binding && libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']));
}
