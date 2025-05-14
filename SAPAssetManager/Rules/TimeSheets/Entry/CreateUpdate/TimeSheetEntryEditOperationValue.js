import { OperationLibrary as libOperations } from '../../../WorkOrders/Operations/WorkOrderOperationLibrary';

export default function TimeSheetEntryEditOperationValue(context) {
    if (context.binding && context.binding.OperationReadlink) {
        return Promise.resolve(context.binding.OperationReadlink);
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/MyWOOperation', [], '').then(function(results) {
        let target = context.getTargetSpecifier();
        target.setDisplayValue('{{#Property:OperationNo}} - {{#Property:OperationShortText}}');
        target.setReturnValue('{@odata.readLink}');
        target.setEntitySet('MyWorkOrderOperations');
        target.setService('/SAPAssetManager/Services/AssetManager.service');
        target.setQueryOptions(libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, "$filter=OrderId eq '{{#Property:RecOrder}}'&$orderby=OperationNo asc"));
        context.setTargetSpecifier(target);
        if (results && results.length > 0) {
            return results.getItem(0)['@odata.readLink'];
        }
        return '';
    });
}
