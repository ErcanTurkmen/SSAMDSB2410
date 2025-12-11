import libVal from '../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import libPersona from '../../../SAPAssetManager/Rules/Persona/PersonaLibrary';
import phaseModel from '../../../SAPAssetManager/Rules/Common/IsPhaseModelEnabled';
import phaseModelExpands from '../../../SAPAssetManager/Rules/PhaseModel/PhaseModelListViewQueryOptionExpand';
import notificationsListGetTypesQueryOption from '../../../SAPAssetManager/Rules/Notifications/ListView/NotificationsListGetTypesQueryOption';
import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import NotificationListSetCaption from '../../../SAPAssetManager/Rules/Notifications/ListView/NotificationListSetCaption';
import { WorkOrderDetailsPageName } from '../../../SAPAssetManager/Rules/WorkOrders/Details/WorkOrderDetailsPageToOpen';
import ModifyListViewSearchCriteria from '../../../SAPAssetManager/Rules/LCNC/ModifyListViewSearchCriteria';
import FilterLibrary from '../../../SAPAssetManager/Rules/Filter/FilterLibrary';

export default function NotificationsListViewQueryOption(context) {
    let ignoreFilter = false; 
    let pageName = libCommon.getPageName(context);

    if (pageName === WorkOrderDetailsPageName(context)) {
        ignoreFilter = true; //Do not filter if calling from work order details for notif singleton
    }
    return notificationsListGetTypesQueryOption(context).then(typesQueryOption => {
        let queryBuilder = context.dataQueryBuilder();
        queryBuilder.expand('WorkOrder,NotifPriority,NotifMobileStatus_Nav,NotifDocuments,NotifDocuments/Document,HeaderLongText,FunctionalLocation,Equipment,NotifMobileStatus_Nav/OverallStatusCfg_Nav,Tasks,Activities,Items,Items/ItemActivities,Items/ItemCauses,Items/ItemTasks');
        queryBuilder.orderBy('Priority,NotificationNumber');
        if (phaseModel(context)) {
            let phaseModelNavlinks = phaseModelExpands('QMI');
            queryBuilder.expand(phaseModelNavlinks);
        }

        if (context.searchString) {
            queryBuilder.filter(getSearchQuery(context, context.searchString.toLowerCase()));
        }

        if (!ignoreFilter) {
            if (pageName === 'NotificationsListViewPage') {
                NotificationListSetCaption(context.getPageProxy(), true);
                FilterLibrary.setFilterActionItemText(context, context.evaluateTargetPath(`#Page:${pageName}`), context);
            }

            if (libPersona.isFieldServiceTechnician(context) && typesQueryOption) {
                queryBuilder.filter(typesQueryOption);
            }
            if (!libVal.evalIsEmpty(context.binding) && context.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
                queryBuilder.orderBy('Priority');
                queryBuilder.filter(`HeaderEquipment eq '${context.binding.EquipId}'`);
            } else if (!libVal.evalIsEmpty(context.binding) && context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                queryBuilder.filter(`Items/any(itm: itm/InspectionChar_Nav/InspectionLot eq '${context.binding.InspectionLot}' and itm/InspectionChar_Nav/InspectionNode eq '${context.binding.InspectionNode}' and itm/InspectionChar_Nav/InspectionChar eq '${context.binding.InspectionChar}' and itm/InspectionChar_Nav/SampleNum eq '${context.binding.SampleNum}')`);
            } else if (!libVal.evalIsEmpty(context.binding) && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                queryBuilder.filter('ReferenceType ne "X"');
            }
        }
        return queryBuilder;
    });
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['NotificationNumber', 'NotificationDescription', 'HeaderFunctionLocation'];
        ModifyListViewSearchCriteria(context, 'MyNotificationHeader', searchByProperties);

        searchQuery = libCommon.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
