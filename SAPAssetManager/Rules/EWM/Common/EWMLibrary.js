import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
export const WarehouseOrderStatus = Object.freeze({
    Open: '',
    InProgess: 'D',
    Confirmed: 'C',
});

export const WarehouseTaskStatus = Object.freeze({
    Open: '',
    Waiting: 'B',
    Confirmed: 'C',
});

export const DefiningRequestsLite = Object.freeze({
    WarehouseResources:'WarehouseResources',
    WarehouseOrders:'WarehouseOrders',
    WarehouseTasks:'WarehouseTasks', 
});

export const EWMType = Object.freeze({
    WarehouseOrder: 'WarehouseOrder',
    WarehouseTask: 'WarehouseTask',
});

export const DocumentTypes = Object.freeze({
    WarehouseOrder: 'WHO',
    WarehouseTask: 'WHT',
});

export function getMaterialDescription(context) {
    const queryOptions = `$filter=MaterialNum eq '${context.binding.Product}'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Materials', [], queryOptions).then((result) => {
        if (!ValidationLibrary.evalIsEmpty(result)) {
            return result.getItem(0).Description;
        } else {
            return '';
        }
    }).catch(() => {
        return '';
    });
}
export default class {
    /**
     * Opens document details page for the Inventory Persona
     */
    static openEWMDocDetailsPage(context, entitySet, queryOptions) {     
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(data => {
            if (data.length === 1) {
                CommonLibrary.setStateVariable(context, 'EmptySearchOnOverview', true);
                let docInfo = data.getItem(0);
                if (docInfo.WarehouseTask_Nav) {
                    const page = context.evaluateTargetPathForAPI('#Page:EWMOverviewPage');
                    page.setActionBinding(docInfo);
                    return page.executeAction('/SAPAssetManager/Actions/EWM/WarehouseOrders/WarehouseOrderDetailsPageNav.action');
                } 
            }
            return false;
        });
    }
} 
