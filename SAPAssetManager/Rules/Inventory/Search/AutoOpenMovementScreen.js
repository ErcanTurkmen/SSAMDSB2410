import libCom from '../../Common/Library/CommonLibrary';
import setPhysicalInventoryCountHeaderExists from '../PhysicalInventory/SetPhysicalInventoryCountHeaderExists';
import setPurchaseOrderGoodsReceipt from '../PurchaseOrder/SetPurchaseOrderGoodsReceipt';

export default function AutoOpenMovementScreen(context, entitySet, queryOptions, searchValue, isPhysical = false) {
    const searchOpenEnabled = (libCom.getAppParam(context, 'INVENTORY', 'search.auto.navigate') === 'Y');
    const minCharacters = Number.parseInt(libCom.getAppParam(context, 'INVENTORY', 'search.minimum.characters'));
    const hasSearch = isSearchAvailable(searchValue, searchOpenEnabled, minCharacters);
    if (hasSearch) {
        let state = libCom.getStateVariable(context, 'PrevDetailsScreenState');
        const isDifferent = compareSearchValue(state, searchValue);
        if (isDifferent) {
            libCom.setStateVariable(context, 'PrevDetailsScreenState', searchValue);
            return queryOptions.build().then(options => {
                return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, options).then(count => {
                    if (count === 1) {
                        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], options).then(res => {
                            let data = res.getItem(0);
                            context.getPageProxy().setActionBinding(data);
                            if (isPhysical) {
                                return setPhysicalInventoryCountHeaderExists(context);
                            }
                            return setPurchaseOrderGoodsReceipt(context);
                        });
                    }
                    return queryOptions;
                });
            });
        }
    }
    return queryOptions;
}

function isSearchAvailable(searchValue, searchOpenEnabled, minCharacters) {
    return searchValue && searchOpenEnabled && searchValue.length >= minCharacters;
}

function compareSearchValue(state, searchValue) {
    return state !== searchValue && searchValue !== undefined;
}
