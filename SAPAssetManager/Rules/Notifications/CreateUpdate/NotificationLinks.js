import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import common from '../../Common/Library/CommonLibrary';
import libNotif from '../NotificationLibrary';

export default function NotificationLinks(context) {
    const notificationType = libNotif.NotificationCreateUpdateTypeLstPkrValue(context);

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], `$filter=NotifType eq '${notificationType}'`).then(function(data) {
        const priorityType = data.getItem(0).PriorityType;

        return createNotificationLinks(context, priorityType);
    });
}

function createNotificationLinks(context, priorityType) {
    let binding = context.getBindingObject();
    if (binding.selectedOperations) {
        binding = context.getActionBinding();
        for (const [key, value] of Object.entries(binding)) {
            binding[key] = value;
        }
    }
    const links = [{
        'Property': 'NotifPriority',
        'Target':
        {
            'EntitySet': 'Priorities',
            'ReadLink': `Priorities(PriorityType='${priorityType}',Priority='${libNotif.NotificationCreateUpdatePrioritySegValue(context)}')`,
        },
    }];
    let page = context.evaluateTargetPathForAPI('#Page:NotificationAddPage') || context.evaluateTargetPathForAPI('#Page:DefectCreateUpdatePage');
    const flocValue = page.evaluateTargetPath('#Control:FuncLocHierarchyExtensionControl').getValue();
    const equipmentValue = page.evaluateTargetPath('#Control:EquipHierarchyExtensionControl').getValue();

    if (common.isDefined(flocValue) && !common.isCurrentReadLinkLocal(flocValue)) {
        links.push({
            'Property': 'FunctionalLocation',
            'Target':
            {
                'EntitySet': 'MyFunctionalLocations',
                'ReadLink': `MyFunctionalLocations('${flocValue}')`,
            },
        });
    }

    if (common.isDefined(equipmentValue) && !common.isCurrentReadLinkLocal(equipmentValue)) {
        links.push({
            'Property': 'Equipment',
            'Target':
            {
                'EntitySet': 'MyEquipments',
                'ReadLink': `MyEquipments('${equipmentValue}')`,
            },
        });
    }

    //Create the InspectionLot nav link
    if (binding && binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        links.push({
            'Property': 'InspectionLot_Nav',
            'Target': {
                'EntitySet': 'InspectionLots',
                'ReadLink': `InspectionLots('${binding.InspectionLot}')`,
            },
        });
    }
    let effectValue = common.getListPickerValue(common.getTargetPathValue(context, '#Control:EffectListPicker/#Value'));
    if (effectValue) {
        links.push({
            'Property': 'Effect_Nav',
            'Target':
            {
                'EntitySet': 'Effects',
                'ReadLink': `Effects('${effectValue}')`,
            },
        });
    }
    if (IsPhaseModelEnabled(context)) {

        let detectionGroup = common.getListPickerValue(common.getTargetPathValue(context, '#Control:DetectionGroupListPicker/#Value'));
        if (detectionGroup) {
            links.push({
                'Property': 'DetectionGroup_Nav',
                'Target':
                {
                    'EntitySet': 'DetectionGroups',
                    'ReadLink': `${detectionGroup}`,
                },
            });
        }

        let detectionMethod = common.getListPickerValue(common.getTargetPathValue(context, '#Control:DetectionMethodListPicker/#Value'));
        if (detectionMethod) {
            links.push({
                'Property': 'DetectionCode_Nav',
                'Target':
                {
                    'EntitySet': 'DetectionCodes',
                    'ReadLink': `${detectionMethod}`,
                },
            });
        }

        let npc = context.evaluateTargetPath('#Control:NPCSeg');
        try {
            let npcValue = context.evaluateTargetPath('#Control:NPCSeg/#SelectedValue');
            if (npc && npcValue && npcValue !== '00') {
                links.push({
                    'Property': 'NotificationProcessingContext_Nav',
                    'Target':
                    {
                        'EntitySet': 'NotificationProcessingContexts',
                        'ReadLink': `NotificationProcessingContexts('${npcValue}')`,
                    },
                });
            }
        } catch (error) {
            // Segmented picker has no selected value.
        }
    }

    let linkPromises = [];

    if (equipmentValue && equipmentValue !== '' && common.isCurrentReadLinkLocal(equipmentValue)) {
        linkPromises.push(
            common.getEntityProperty(context, `MyEquipments(${equipmentValue})`, 'EquipId').then(equipmentId => {
                let equipmentLink = context.createLinkSpecifierProxy(
                    'Equipment',
                    'MyEquipments',
                    `$filter=EquipId eq '${equipmentId}'`,
                );
                links.push(equipmentLink.getSpecifier());
                return links;
            }),
        );
    }
    if (flocValue && flocValue !== '' && common.isCurrentReadLinkLocal(flocValue)) {
        linkPromises.push(
            common.getEntityProperty(context, `MyFunctionalLocations(${flocValue})`, 'FuncLocIdIntern').then(funcLocId => {
                let flocLink = context.createLinkSpecifierProxy(
                    'FunctionalLocation',
                    'MyFunctionalLocations',
                    `$filter=FuncLocIdIntern eq '${funcLocId}'`,
                );
                links.push(flocLink.getSpecifier());
                return links;
            }),
        );
    }
    if (linkPromises.length > 0) {
        return Promise.all(linkPromises).then(() => {
            return links;
        });
    }

    return links;
}
