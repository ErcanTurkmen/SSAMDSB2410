import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import MyWorkSectionFSMFilterQuery from './MyWorkSectionFSMFilterQuery';
import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import UserFeaturesLibrary from '../../UserFeatures/UserFeaturesLibrary';
import { sortObjectsByStatus } from './MyWorkSectionQueryOption';

//My Work Section Query Option
export default function MyWorkSectionQueryOption(context) {
    let orderBy;
    let expand;
    let top = '$top=50';
    let entitySet;
    let mobileStatusNavlink;
    let array = [];

    return MyWorkSectionFSMFilterQuery(context).then(filter => {
        if (IsOperationLevelAssigmentType(context)) {
            mobileStatusNavlink = 'OperationMobileStatus_Nav';
            //My Operation Query
            orderBy = `$orderby=${mobileStatusNavlink}/MobileStatus desc,PersonNum,WOHeader/DueDate`;
            expand = `$expand=Confirmations,${mobileStatusNavlink},${mobileStatusNavlink}/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,OperationLongText,WOHeader,UserTimeEntry_Nav,WOHeader/WOPriority,EquipmentOperation,EquipmentOperation/Location_Nav,FunctionalLocationOperation,FunctionalLocationOperation/Location_Nav,Tools,WOOprDocuments_Nav`;
            entitySet = 'MyWorkOrderOperations';
            if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                expand += ',WOHeader/OrderISULinks,WOHeader/DisconnectActivity_Nav';
            }
            libCom.setStateVariable(context, 'OPERATIONS_FILTER', { entity: entitySet, query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x' });
        } else if (IsSubOperationLevelAssigmentType(context)) {
            mobileStatusNavlink = 'SubOpMobileStatus_Nav';
            //My SubOperation Query
            orderBy = `$orderby=${mobileStatusNavlink}/MobileStatus desc,PersonNum,WorkOrderOperation/WOHeader/DueDate`;
            expand = `$expand=Confirmations,${mobileStatusNavlink},${mobileStatusNavlink}/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,SubOperationLongText,WorkOrderOperation,WorkOrderOperation/WOHeader,UserTimeEntry_Nav,WorkOrderOperation/WOHeader/WOPriority,EquipmentSubOperation,EquipmentSubOperation/Location_Nav,FunctionalLocationSubOperation,FunctionalLocationSubOperation/Location_Nav`;
            entitySet = 'MyWorkOrderSubOperations';
            if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                expand += ',WorkOrderOperation/WOHeader/OrderISULinks,WorkOrderOperation/WOHeader/DisconnectActivity_Nav';
            }
            libCom.setStateVariable(context, 'OPERATIONS_FILTER', { entity: entitySet, query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x' });
        } else {
            mobileStatusNavlink = 'OrderMobileStatus_Nav';
            //My Work Order Query
            orderBy = `$orderby=${mobileStatusNavlink}/MobileStatus desc,WOPartners/PersonnelNum,DueDate,Priority,MarkedJob/PreferenceValue`;
            expand = `$expand=Confirmations,Equipment,Equipment/Location_Nav,FunctionalLocation,FunctionalLocation/Location_Nav,WOPriority,Components,${mobileStatusNavlink},${mobileStatusNavlink}/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,MarkedJob,HeaderLongText,WOPartners`;
            if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                expand += ',OrderISULinks,DisconnectActivity_Nav';
            }
            entitySet = 'MyWorkOrderHeaders';
            libCom.setStateVariable(context, 'WORKORDER_FILTER', filter);
        }
        filter = filter + '&' + orderBy + '&' + expand + '&' + top;

        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], filter).then(result => {
            if (result) {
                array = sortObjectsByStatus(context, result, mobileStatusNavlink);
            }
            return array;
        }).catch(error => {
            Logger.error(error);
        });
    });
}
