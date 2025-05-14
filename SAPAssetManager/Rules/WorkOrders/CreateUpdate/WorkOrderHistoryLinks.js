import common from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import { WorkOrderControlsLibrary as libWoControls } from '../WorkOrderLibrary';

export default function WorkOrderHistoryLinks(context) {
    let links = [];
    const flocValue = common.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:FuncLocHierarchyExtensionControl/#Value');
    const equipmentValue = common.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:EquipHierarchyExtensionControl/#Value');
    if (equipmentValue && equipmentValue !== '' && !common.isCurrentReadLinkLocal(equipmentValue)) {
        links.push({
            'Property': 'Equipment_Nav',
            'Target':
            {
                'EntitySet': 'MyEquipments',
                'ReadLink': `MyEquipments('${equipmentValue}')`,
            },
        });
    } else if (flocValue && flocValue !== '' && !common.isCurrentReadLinkLocal(flocValue)) {
        links.push({
            'Property': 'FuncLoc_Nav',
            'Target':
            {
                'EntitySet': 'MyFunctionalLocations',
                'ReadLink': `MyFunctionalLocations('${flocValue}')`,
            },
        });
    
    }
    const planningPlantValue = common.getListPickerValue(common.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:PlanningPlantLstPkr/#Value'));
    const orderTypeValue = common.getListPickerValue(common.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:TypeLstPkr/#Value'));
    const priorityValue = libWoControls.getPriority(context.evaluateTargetPathForAPI('#Page:WorkOrderCreateUpdatePage'));
    let linkPromises = [];
    linkPromises.push(
        context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['PriorityType'], `$filter=PlanningPlant eq '${planningPlantValue}' and OrderType eq '${orderTypeValue}'`).then(orderTypes => {
        if (orderTypes.getItem(0)) {
            let priorityType = orderTypes.getItem(0).PriorityType;
            if (!libVal.evalIsEmpty(priorityValue) && !libVal.evalIsEmpty(priorityType)) {
                let priorityLink = context.createLinkSpecifierProxy(
                    'HistoryPriority',
                    'Priorities',
                    `$filter=PriorityType eq '${priorityType}' and Priority eq '${priorityValue}'`,
                );
                links.push(priorityLink.getSpecifier());
            }
        }
        return links;
    }));
    if (equipmentValue && equipmentValue !== '' && common.isCurrentReadLinkLocal(equipmentValue)) {
        linkPromises.push(
            common.getEntityProperty(context, `MyEquipments(${equipmentValue})`, 'EquipId').then(equipmentId => {
                let equipmentLink = context.createLinkSpecifierProxy(
                    'Equipment_Nav',
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
                    'FuncLoc_Nav',
                    'MyFunctionalLocations',
                    `$filter=FuncLocIdIntern eq '${funcLocId}'`,
                );
                links.push(flocLink.getSpecifier());
                return links;
            }),
        );
    }
    return Promise.all(linkPromises).then(() => {
        return links;
    });
}
