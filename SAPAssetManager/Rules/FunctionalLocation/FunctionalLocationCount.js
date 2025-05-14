import CommonLibrary from '../Common/Library/CommonLibrary';
import FLOCFilterbyType from './FLOCFilterByType';

export default function FunctionalLocationCount(context) {
    if (CommonLibrary.isDefined(context.getPageProxy().binding) && CommonLibrary.isDefined(context.getPageProxy().binding['@odata.type'])) {
        if (context.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
            return CommonLibrary.getEntitySetCount(context, 'MyFunctionalLocations', `$filter=WorkOrderHeader/any( wo: wo/OrderId eq '${context.getPageProxy().binding.OrderId}' ) or WorkOrderOperation/any(wo: wo/OrderId eq '${context.getPageProxy().binding.OrderId}' ) or WorkOrderSubOperation/any( wo: wo/OrderId eq '${context.getPageProxy().binding.OrderId}' )`).then(count => {
                if (count) {
                    context.getPageProxy().getClientData().Count = count;
                    return count;
                } else {
                    context.getPageProxy().getClientData().Count = 0;
                    return 0;
                }
            });
        }

        return getCount(context);
    } else {
        return CommonLibrary.getEntitySetCount(context, 'MyFunctionalLocations', '').then(count => {
            if (count) {
                context.getPageProxy().getClientData().Count = count;
                return count;
            } else {
                context.getPageProxy().getClientData().Count = 0;
                return 0;
            }
        });
    }
}

function getCount(context) {
    if ([
        context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrder.global').getValue(),
        context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceRequest.global').getValue(),
        context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceItem.global').getValue(),
        context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceQuotation.global').getValue(),
    ].includes(context.getPageProxy().binding['@odata.type'])) {

        let extraQuery = FLOCFilterbyType(context);
        if (extraQuery) extraQuery = '$filter=' + extraQuery;
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', extraQuery).then((count) => {
            context.getPageProxy().getClientData().Count = count;
            return count;
        });
    }

    return 0;
}
