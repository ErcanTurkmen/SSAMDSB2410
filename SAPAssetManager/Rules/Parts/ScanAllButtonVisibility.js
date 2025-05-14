import libCommon from '../Common/Library/CommonLibrary';
import libPart from './PartLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import BarcodeScannerQueryOptions from '../Extensions/BarcodeScannerQueryOptions';
import { IsBindingObjectOnline } from '../WorkOrders/IsBindingObjectOnline';

/** @param {IPageProxy & {binding: MyWorkOrderOperation}} context  */
export default function ScanAllButtonVisibility(context) {
    const operation = context.binding;
    return IsScanAllButtonVisible(context, operation);
}


/**
 * @param {IClientAPI} context
 * @param {MyWorkOrderOperation} operation */
export async function IsScanAllButtonVisible(context, operation) {
    if (libCommon.isEntityLocal(operation) || libCommon.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.Parts.Issue') === 'N' || IsBindingObjectOnline(context)) {
        return Promise.resolve(false);
    }
    return Promise.all([
        hasLocalQuantity(context, operation),
        HasScannable(context),
    ]).then(([hasLocal, hasScannable]) => hasLocal && hasScannable);
}

function HasScannable(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderComponents', BarcodeScannerQueryOptions(context)).then(count => 0 < count);
}

function hasLocalQuantity(context, operation) {
    let queryOption = `$filter=OrderId eq '${operation.OrderId}' and WithdrawnQuantity ne RequirementQuantity`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderComponents', [], queryOption)
        .then(async (/** @type {ObservableArray<MyWorkOrderComponent>} */ result) => {
            if (!libVal.evalIsEmpty(result)) {
                for (let i of Array.from(result)) {
                    if (await hasPositiveRequirementCount(context, i)) {
                        return true;
                    }
                }
            }
            return false;
        });
}

/**
 * @param {IClientAPI} context
 * @param {MyWorkOrderComponent} component */
function hasPositiveRequirementCount(context, component) {
    return libPart.getLocalQuantityIssued(context, component)
        .then(local => 0 < (+component.RequirementQuantity - (component.WithdrawnQuantity + local)));
}
