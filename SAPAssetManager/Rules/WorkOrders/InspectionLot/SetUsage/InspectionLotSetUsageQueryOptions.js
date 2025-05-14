import libCom from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';

export default function InspectionLotSetUsageQueryOptions(context) {
    let udSelectedSet = '';
    let catalogType = libCom.getAppParam(context, 'CATALOGTYPE', 'UsageDecision');
    let orderType = '';
    let planningPlant = '';
    let binding = context.binding;
    let pageName = libCom.getStateVariable(context, 'FDCPreviousPage');
    try {
        let actionBinding = context.evaluateTargetPathForAPI('#Page:' + pageName).getClientData().ActionBinding;
        if (actionBinding) {
            binding = actionBinding;
        }
    } catch (error) {
        //exception when the pageName does not exists
        Logger.error('pageName does not exists ' + error);
    }

    if (!binding.WOHeader_Nav && (binding['@odata.type'] === '#sap_mobile.InspectionLot' || binding['@odata.type'] === '#sap_mobile.EAMChecklistLink')) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$filter=OrderId eq '${binding.OrderId}'`).then((WOHeader_Nav) => {
            if (WOHeader_Nav.length > 0) {
                orderType = WOHeader_Nav.getItem(0).OrderType;
                planningPlant = WOHeader_Nav.getItem(0).PlanningPlant;
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['UDSelectedSet'], `$filter=OrderType eq '${orderType}' and PlanningPlant eq '${planningPlant}'`).then((orderTypeRecord) => {
                    if (orderTypeRecord.length > 0) {
                        udSelectedSet = orderTypeRecord.getItem(0).UDSelectedSet;
                    }
                    return getQueryOptions(udSelectedSet, planningPlant, catalogType);
                });
            }
            return getQueryOptions(udSelectedSet, planningPlant, catalogType);
        });
    } else if (binding['@odata.type'] === '#sap_mobile.InspectionPoint') {
        orderType = binding.WOOperation_Nav.WOHeader.OrderType;
        planningPlant = binding.WOOperation_Nav.WOHeader.PlanningPlant;
    } else if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        orderType = binding.OrderType;
        planningPlant = binding.PlanningPlant;
    } else {
        if (Object.prototype.hasOwnProperty.call(binding,'MyWOHeader_Nav')) {
            orderType = binding.MyWOHeader_Nav.OrderType;
            planningPlant = binding.MyWOHeader_Nav.PlanningPlant;
        } else if (Object.prototype.hasOwnProperty.call(binding,'WOHeader')) {
            orderType = binding.WOHeader.OrderType;
            planningPlant = binding.WOHeader.PlanningPlant;
        } else {
            orderType = binding.WOHeader_Nav.OrderType;
            planningPlant = binding.WOHeader_Nav.PlanningPlant;
        }
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['UDSelectedSet'], `$filter=OrderType eq '${orderType}' and PlanningPlant eq '${planningPlant}'`).then((orderTypeRecord) => {
        if (orderTypeRecord.length > 0) {
            udSelectedSet = orderTypeRecord.getItem(0).UDSelectedSet;
        }

        return getQueryOptions(udSelectedSet, planningPlant, catalogType);
    });
}

function getQueryOptions(udSelectedSet, planningPlant, catalogType) {
    return `$filter=(SelectedSet eq '${udSelectedSet}' and Plant eq '${planningPlant}' and Catalog eq '${catalogType}')&$expand=InspValuation_Nav`;
}
