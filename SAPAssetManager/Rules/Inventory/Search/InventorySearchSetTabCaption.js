import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
export default async function InventorySearchSetTabCaption(context) {
    let pageName = libCom.getPageName(context);
    const queryOptions = libCom.getStateVariable(context,'INVENTORY_BASE_QUERY', pageName);
    return libCom.getEntitySetCount(context, 'PhysicalInventoryDocItems', queryOptions).then(totalCount => {
        const count = context.evaluateTargetPath('#Count');
        if (totalCount && totalCount !== count) {
            return context.localizeText('items') + ' (' + count + '/' + totalCount + ')';
        }
        return context.localizeText('items') + ' (' + count + ')'; 
    }).catch((error) => {
        Logger.error('Physical Inventory',  error);
        return '';
    });
}


