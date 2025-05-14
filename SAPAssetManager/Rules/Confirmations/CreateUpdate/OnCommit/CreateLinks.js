import libVal from '../../../Common/Library/ValidationLibrary';

export default function CreateLinks(context, actionBinding) {
    let binding = context.getBindingObject();

    if (binding.selectedOperations) {
        binding = context.getActionBinding();
        for (const [key, value] of Object.entries(binding)) {
            binding[key] = value;
        }
    }
    let workOrder = binding.WorkOrderHeader;

    if (!workOrder && actionBinding) {
        workOrder = actionBinding.WorkOrderHeader;
        binding = actionBinding;
    }

    let links = [{
        'Property': 'WorkOrderHeader',
        'Target':
        {
            'EntitySet': 'MyWorkOrderHeaders',
            'ReadLink': workOrder['@odata.readLink'],
        },
    }];


    if (binding.Operation.length > 0) {
        // Push an operation onto the links

        links.push({
            'Property': 'WorkOrderOperation',
            'Target': {
                'EntitySet': 'MyWorkOrderOperations',
                'ReadLink': `MyWorkOrderOperations(OrderId='${workOrder.OrderId}',OperationNo='${binding.Operation}')`,
            },
        });

        if (binding.SubOperation.length > 0) {
            // Push a Sub Op onto the links
            links.push({
                'Property': 'WorkOrderSubOperation',
                'Target': {
                    'EntitySet': 'MyWorkOrderSubOperations',
                    'ReadLink': `MyWorkOrderSubOperations(OperationNo='${binding.Operation}',OrderId='${workOrder.OrderId}',SubOperationNo='${binding.SubOperation}')`,
                },
            });
        }

    }

    if (binding.AccountingIndicator && binding.AccountingIndicator.length > 0) {
        links.push({
            'Property': 'AcctIndicator',
            'Target': {
                'EntitySet': 'AcctIndicators',
                'ReadLink': `AcctIndicators('${binding.AccountingIndicator}')`,
            },
        });
    }

    if (binding.VarianceReason && binding.VarianceReason.length > 0) {
        let plant = binding.Plant;
        if (libVal.evalIsEmpty(plant)) {
            plant = getDefaultPlant(binding);
        }
        links.push({
            'Property': 'Variance',
            'Target': {
                'EntitySet': 'VarianceReasons',
                'ReadLink': `VarianceReasons(Plant='${plant}',VarianceReason='${binding.VarianceReason}')`,
            },
        });
    }

    return links;
}

function getDefaultPlant(binding) {
    return binding.WorkOrderHeader.MainWorkCenterPlant ? binding.WorkOrderHeader.MainWorkCenterPlant : binding.WorkOrderHeader.PlanningPlant;
}
