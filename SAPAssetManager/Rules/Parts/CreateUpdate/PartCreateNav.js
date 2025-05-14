import libCommon from '../../Common/Library/CommonLibrary';
import libWOStatus from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import WorkCenterPlant from '../../Common/Controls/WorkCenterPlantControl';
import assnType from '../../Common/Library/AssignmentType';
import Logger from '../../Log/Logger';
import { WorkOrderDetailsPageName } from '../../WorkOrders/Details/WorkOrderDetailsPageToOpen';
import { WorkOrderOperationDetailsPageNameToOpen } from '../../WorkOrders/Operations/Details/WorkOrderOperationDetailsPageToOpen';

export function executeChangeSetAction(context) {
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    libCommon.setOnChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);
    //set the WoChangeSet flag to false
    libCommon.setOnWOChangesetFlag(context, false);

    //The next few lines are added to pre-populate the OrderId and/or the Operation No if the user is coming in from one of these objects
    try {
        let workOrderContext = context.evaluateTargetPathForAPI(`#Page:${WorkOrderDetailsPageName(context)}`);

        if (workOrderContext && workOrderContext.binding) {
            context.binding.OrderId = workOrderContext.binding.OrderId;
        }

    } catch (error) {
        //If WorkOrderDetails is not found then the user is not coming in from a workorder so just move on
        Logger.error(error);
    }

    try {
        let operationContext = context.evaluateTargetPathForAPI(`#Page:${WorkOrderOperationDetailsPageNameToOpen(context)}`);

        if (operationContext && operationContext.binding) {
            context.binding.OperationNo = operationContext.binding.OperationNo;
            context.binding.OrderId = operationContext.binding.OrderId;
        }
    } catch (error) {
        //If OperationDetails is not found then the user is not coming in from an operation so just move on
        Logger.error(error);
    }

    if (context.binding && context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue()) {
        libCommon.setStateVariable(context, 'BOMPartAdd', true);
        return context.executeAction('/SAPAssetManager/Actions/Parts/BOM/BOMCreateChangeSet.action');
    }
    libCommon.setStateVariable(context, 'PartAdd', true);
    return context.executeAction('/SAPAssetManager/Actions/Parts/PartCreateChangeSet.action');
}

/**
 * Can't add part to local job.
 * @param {*} context 
 */
export default function PartCreateNav(context) {
    let binding = context.binding || {};
    let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');
    let storageLocation = libCommon.getUserDefaultStorageLocation();
    let isLocal = libCommon.isCurrentReadLinkLocal(currentReadLink);
    binding.StorageLocation = '';
    
    if (libCommon.isDefined(storageLocation)) {
        binding.StorageLocation = storageLocation;
    }
    const isValidOdata = isValidODataBinding(context, binding);
    if (isValidOdata) {
        const workcenter = getWorkcenterValue(context);
        binding.Plant = libCommon.getAppParam(context, 'WORKORDER', 'PlanningPlant');
        if (libCommon.isDefined(workcenter)) {
            binding.Plant = workcenter;
        }
        return executeChangeSetAction(context);
    }
    
    return WorkCenterPlant.getOperationPageDefaultValue(context).then(function(plant) {
        binding.Plant = plant;
        if (!libCommon.isDefined(plant)) {
            binding.Plant = libCommon.getAppParam(context, 'WORKORDER', 'PlanningPlant');
        }
        if (isLocal) {
            return executeChangeSetAction(context);
        }
        
        return libWOStatus.isOrderComplete(context).then(status => {
            if (!status) {
                return executeChangeSetAction(context);
            }
            return '';
        });
    });
}

function isValidODataBinding(context, binding) {
    return binding && binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue();
}

function getWorkcenterValue(context) {
    const assnTypeLevel = libCommon.getWorkOrderAssnTypeLevel(context);
    let workcenter = '';
    if (assnTypeLevel === 'Header') {
        workcenter = assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'WorkCenterPlant');
    } else if (assnTypeLevel === 'Operation') {
        workcenter = assnType.getWorkOrderFieldDefault('WorkOrderOperation', 'WorkCenterPlant');
    } else if (assnTypeLevel === 'SubOperation') {
        workcenter = assnType.getWorkOrderFieldDefault('WorkOrderSubOperation', 'WorkCenterPlant');
    }
    return workcenter;
}
