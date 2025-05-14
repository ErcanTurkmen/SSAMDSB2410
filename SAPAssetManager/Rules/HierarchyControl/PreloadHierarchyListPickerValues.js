import { getLRUCache, getCachePrefix } from './ChildCountListPicker';
import CommonLibrary from '../Common/Library/CommonLibrary';
import { PrivateMethodLibrary as OperationPrivateMethodLibrary } from '../WorkOrders/Operations/WorkOrderOperationLibrary';
import Logger from '../Log/Logger';
import AssignmentType from '../Common/Library/AssignmentType';
import HierachyListPickerQueryOptionsForEquipment from './MaintenancePlantForEquipment';
import { PrivateMethodLibrary as SubOperationPrivateMethodLibrary} from '../SubOperations/SubOperationLibrary';

export default function PreloadHierarchyListPickerValues(context, modalPagePath) {
    if (!modalPagePath) return;

    try {
        let cache = getLRUCache();
        let cachePrefix = getCachePrefix();

        let defaultFlocCount = '$top=50';
        let defaultEquipmentCount = '$top=50';

        // extracts a ItemsPerPage value from a page definition
        let pageDefinition = context.getPageDefinition(modalPagePath);
        if (pageDefinition && pageDefinition.Controls && pageDefinition.Controls[0].Sections) {
            pageDefinition.Controls[0].Sections.forEach(section => {
                const params = getPaginationParams(section);
                defaultEquipmentCount = params.defaultEquipmentCount;
                defaultFlocCount = params.defaultFlocCount;
            });
        }

        Promise.all([getFlocHierarchyQuery(context, modalPagePath), getEquipmentHierarchyQuery(context, modalPagePath)]).then(results => {
            let allFlocQuery = results[0];
            let allEquipmentQuery = results[1];

            if (allFlocQuery) {
                setTimeout(() => {
                    context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', ['FuncLocIdIntern'], allFlocQuery + '&' + defaultFlocCount).then(allFloc => {
                        // key is a superior's id, value is a number of children 
                        let flocSuperiorChildren = {};

                        let childrenQuery = [];
                        allFloc.forEach(item => {
                            flocSuperiorChildren[item.FuncLocIdIntern] = 0;
                            childrenQuery.push(`SuperiorFuncLocInternId eq '${item.FuncLocIdIntern}'`);
                        });

                        if (childrenQuery.length) {
                            childrenQuery = '$filter=' + childrenQuery.join(' or ') + '&$orderby=FuncLocIdIntern';
                        } else {
                            childrenQuery = '$filter=false&$orderby=FuncLocIdIntern';
                        }

                        context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', ['SuperiorFuncLocInternId'], childrenQuery).then(allChildren => {
                            updateSuperiorChildrenCount(allChildren, flocSuperiorChildren, 'SuperiorFuncLocInternId');

                            Object.keys(flocSuperiorChildren).forEach(id => {
                                cache.set(cachePrefix + id, flocSuperiorChildren[id]);
                            });
                        });
                    });
                }, 50);
            }

            if (allEquipmentQuery) {
                setTimeout(() => {
                    context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', ['EquipId'], allEquipmentQuery + '&' + defaultEquipmentCount).then(allEquipment => {
                        // key is a superior's id, value is a number of children 
                        let equipmentSuperiorChildren = {};

                        let childrenQuery = [];
                        allEquipment.forEach(item => {
                            equipmentSuperiorChildren[item.EquipId] = 0;
                            childrenQuery.push(`SuperiorEquip eq '${item.EquipId}'`);
                        });

                        childrenQuery = compareQueryString(childrenQuery);

                        context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', ['SuperiorEquip'], childrenQuery).then(allChildren => {
                            updateSuperiorChildrenCount(allChildren, equipmentSuperiorChildren, 'SuperiorEquip');

                            Object.keys(equipmentSuperiorChildren).forEach(id => {
                                cache.set(cachePrefix + id, equipmentSuperiorChildren[id]);
                            });
                        });
                    });
                }, 100);
            }
        });
    } catch (error) {
        Logger.error('PreloadHierarchyListPickerValues', error);
    }
}

function getPaginationParams(section) {
    let defaultFlocCount = '$top=50';
    let defaultEquipmentCount = '$top=50';

    if (section.Controls) {
        section.Controls.forEach(control => {
            if (control.Control === 'HierarchyExtension' && control.ExtensionProperties && control.ExtensionProperties.PickerProperties) {
                let itemsPerPage = control.ExtensionProperties.PickerProperties.ItemsPerPage;

                if (control._Name === 'FuncLocHierarchyExtensionControl' && itemsPerPage) {
                    defaultFlocCount = '$top=' + itemsPerPage;
                } else if (control._Name === 'EquipHierarchyExtensionControl' && itemsPerPage) {
                    defaultEquipmentCount = '$top=' + itemsPerPage;
                }
            }
        });
    }
    return { defaultEquipmentCount, defaultFlocCount };
}

function compareQueryString(childrenQuery) {
    if (childrenQuery.length) {
        return '$filter=' + childrenQuery.join(' or ') + '&$orderby=EquipId';
    } else {
        return '$filter=false&$orderby=EquipId';
    }
}

function updateSuperiorChildrenCount(newData, initialData, superirorKey) {
    newData.reduce(function(data, child) {
        let superirorId = child[superirorKey];
        data[superirorId] = (data[superirorId] || 0) + 1;
        return data;
    }, initialData);
}

function getFlocHierarchyQuery(context, pagePath) {
    let query = '$orderby=FuncLocId';
    let planningPlant;

    switch (pagePath) {
        case '/SAPAssetManager/Pages/WorkOrders/WorkOrderCreateUpdate.page': {
            planningPlant = AssignmentType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant');

            let target = CommonLibrary.getStateVariable(context, 'WODefaultPlanningPlant');
            if (target) {
                planningPlant = target;
            }
            break;
        }
        case '/SAPAssetManager/Pages/Notifications/NotificationCreateUpdate.page':
        case '/SAPAssetManager/Pages/Notifications/QMDefectCreateUpdate.page': {
            if (context.binding && context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic' && context.binding.EAMChecklist_Nav) {
                query += `&$filter=FuncLocIdIntern eq '${context.binding.EAMChecklist_Nav.FunctionalLocation}'`;
                break;
            }
            const iwk = CommonLibrary.getDefaultUserParam('USER_PARAM.IWK');
            const notificationAppParamPlant = CommonLibrary.getAppParam(context, 'NOTIFICATION', 'PlanningPlant');
            let notificationPlanningPlant = iwk || notificationAppParamPlant || '';

            if (notificationPlanningPlant) {
                const notificationPlanningPlantQuery = notificationPlanningPlant.split(',').map((plant) => `PlanningPlant eq '${plant}'`).join(' or ');
                query += `&$filter=(PlanningPlant eq '' or ${notificationPlanningPlantQuery})`;
            }

            break;
        }
        case '/SAPAssetManager/Pages/ServiceOrders/CreateUpdate/ServiceRequestCreateUpdate.page':
        case '/SAPAssetManager/Pages/ServiceOrders/CreateUpdate/ServiceOrderCreateUpdate.page': {
            planningPlant = CommonLibrary.getDefaultUserParam('USER_PARAM.IWK');
            break;
        }
        case '/SAPAssetManager/Pages/FunctionalLocation/FunctionalLocationCreateUpdate.page': {
            planningPlant = context.binding ? context.binding.PlanningPlant || context.binding.MaintPlant || '' : '';
            break;
        }
        case '/SAPAssetManager/Pages/Equipment/EquipmentCreateUpdate.page': {
            query += `&$filter=(MaintPlant eq '${HierachyListPickerQueryOptionsForEquipment(context)}')`;
            break;
        }
        case '/SAPAssetManager/Pages/Confirmations/ConfirmationsCreateUpdate.page': {
            planningPlant = AssignmentType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant');
            break;
        }
        case '/SAPAssetManager/Pages/WorkOrders/SubOperation/SubOperationCreateUpdate.page': {
            return SubOperationPrivateMethodLibrary._getParentWorkOrder(context).then(parentWorkOrder => {
                const values = getQueryForOperationAndSuboperation(planningPlant, query, parentWorkOrder, context);
                planningPlant = values.planningPlant;
                return values.query;
            });
        }
        case '/SAPAssetManager/Pages/WorkOrders/Operations/WorkOrderOperationCreateUpdate.page': {
            return OperationPrivateMethodLibrary._getParentWorkOrder(context).then(parentWorkOrder => {
                const values = getQueryForOperationAndSuboperation(planningPlant, query, parentWorkOrder, context);
                planningPlant = values.planningPlant;
                return values.query;
            });
        }
        default:
            query = '';
            break;
    }

    if (planningPlant && query) {
        query += `&$filter=(PlanningPlant eq '' or PlanningPlant eq '${planningPlant}')`;
    }

    return Promise.resolve(query);
}

function getEquipmentHierarchyQuery(context, pagePath) {
    let query = '$orderby=EquipId';
    let planningPlant;

    switch (pagePath) {
        case '/SAPAssetManager/Pages/WorkOrders/WorkOrderCreateUpdate.page': {
            planningPlant = AssignmentType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant');

            let target = CommonLibrary.getStateVariable(context, 'WODefaultPlanningPlant');
            if (target) {
                planningPlant = target;
            }
            break;
        }
        case '/SAPAssetManager/Pages/Notifications/NotificationCreateUpdate.page':
        case '/SAPAssetManager/Pages/Notifications/QMDefectCreateUpdate.page': {
            if (context.binding && context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic' && context.binding.EAMChecklist_Nav) {
                query += `&$filter=EquipId eq '${context.binding.EAMChecklist_Nav.Equipment}'`;
                break;
            }

            let floc = CommonLibrary.getTargetPathValue(context, '#Property:HeaderFunctionLocation');
            if (floc) {
                query += `&$filter=FuncLocIdIntern eq '${floc}'`;
            }
            break;
        }
        case '/SAPAssetManager/Pages/ServiceOrders/CreateUpdate/ServiceRequestCreateUpdate.page':
        case '/SAPAssetManager/Pages/ServiceOrders/CreateUpdate/ServiceOrderCreateUpdate.page': {
            planningPlant = CommonLibrary.getDefaultUserParam('USER_PARAM.IWK');
            break;
        }
        case '/SAPAssetManager/Pages/Equipment/EquipmentCreateUpdate.page': {
            query += `&$filter=(MaintPlant eq '${HierachyListPickerQueryOptionsForEquipment(context)}')`;
            break;
        }
        case '/SAPAssetManager/Pages/Confirmations/ConfirmationsCreateUpdate.page': {
            planningPlant = AssignmentType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant');
            break;
        }
        case '/SAPAssetManager/Pages/WorkOrders/SubOperation/SubOperationCreateUpdate.page':{
            return SubOperationPrivateMethodLibrary._getParentWorkOrder(context).then(parentWorkOrder => {
                const values = getQueryForOperationAndSuboperation(planningPlant, query, parentWorkOrder, context);
                planningPlant = values.planningPlant;
                query = values.query;
                return updatedQueryWithFuncLocIdIntern(context, query);
            });
        }
        case '/SAPAssetManager/Pages/WorkOrders/Operations/WorkOrderOperationCreateUpdate.page': {
            return OperationPrivateMethodLibrary._getParentWorkOrder(context).then(parentWorkOrder => {
                const values = getQueryForOperationAndSuboperation(planningPlant, query, parentWorkOrder, context);
                planningPlant = values.planningPlant;
                query = values.query;
                return updatedQueryWithFuncLocIdIntern(context, query);
            });
        }
        default:
            query = '';
            break;
    }

    if (planningPlant && query) {
        query += `&$filter=(PlanningPlant eq '' or PlanningPlant eq '${planningPlant}')`;
    }

    return Promise.resolve(query);
}


function getQueryForOperationAndSuboperation(prevPlanningPlant, prevQuery, parentWorkOrder, context) {
    let planningPlant = prevPlanningPlant;
    let query = prevQuery;
    if (parentWorkOrder && parentWorkOrder.PlanningPlant) {
        planningPlant = parentWorkOrder.PlanningPlant;
    }

    let target = CommonLibrary.getStateVariable(context, 'WODefaultPlanningPlant');
    if (target) {
        planningPlant = target;
    }
    if (planningPlant) {
        query += `&$filter=(PlanningPlant eq '' or PlanningPlant eq '${planningPlant}')`;
    }

    return { query,  planningPlant };
}

function updatedQueryWithFuncLocIdIntern(context, query) {
    let funcLoc = CommonLibrary.getTargetPathValue(context, '#Property:OperationFunctionLocation');
    let reset = CommonLibrary.getStateVariable(context, 'WODefaultReset');
    if (funcLoc && !reset) {
        query += " and FuncLocIdIntern eq '" + funcLoc + "'";
    }

    return query;
}
