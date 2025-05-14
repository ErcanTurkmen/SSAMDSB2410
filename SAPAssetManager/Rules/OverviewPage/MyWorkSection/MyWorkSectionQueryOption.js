import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import UserFeaturesLibrary from '../../UserFeatures/UserFeaturesLibrary';
import MyWorkSectionFilterQuery from './MyWorkSectionFilterQuery';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import ClockInClockOutLibrary from '../../ClockInClockOut/ClockInClockOutLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';

//My Work Section Query Option
export default function MyWorkSectionQueryOption(context) {
    let orderBy;
    let expand;
    let top = '$top=50';
    let entitySet;
    let mobileStatusNavlink;
    let array = [];

    return prepareDataForMyWorkSection(context).then(() => {
        return MyWorkSectionFilterQuery(context, '$filter=').then(filter => {
            if (IsOperationLevelAssigmentType(context)) {
                mobileStatusNavlink = 'OperationMobileStatus_Nav';
                //My Operation Query
                orderBy = `$orderby=${mobileStatusNavlink}/MobileStatus desc,PersonNum,WOHeader/DueDate`;
                expand = `$expand=Confirmations,${mobileStatusNavlink},${mobileStatusNavlink}/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,OperationLongText,WOHeader,UserTimeEntry_Nav,WOHeader/WOPriority,EquipmentOperation,EquipmentOperation/Location_Nav,FunctionalLocationOperation,FunctionalLocationOperation/Location_Nav,Tools,WOOprDocuments_Nav`;
                entitySet = 'MyWorkOrderOperations';
                if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                    expand += ',WOHeader/OrderISULinks,WOHeader/DisconnectActivity_Nav';
                }
            } else if (IsSubOperationLevelAssigmentType(context)) {
                mobileStatusNavlink = 'SubOpMobileStatus_Nav';
                //My SubOperation Query
                orderBy = `$orderby=${mobileStatusNavlink}/MobileStatus desc,PersonNum,WorkOrderOperation/WOHeader/DueDate`;
                expand = `$expand=Confirmations,${mobileStatusNavlink},${mobileStatusNavlink}/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,SubOperationLongText,WorkOrderOperation,WorkOrderOperation/WOHeader,UserTimeEntry_Nav,WorkOrderOperation/WOHeader/WOPriority,EquipmentSubOperation,EquipmentSubOperation/Location_Nav,FunctionalLocationSubOperation,FunctionalLocationSubOperation/Location_Nav`;
                entitySet = 'MyWorkOrderSubOperations';
                if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                    expand += ',WorkOrderOperation/WOHeader/OrderISULinks,WorkOrderOperation/WOHeader/DisconnectActivity_Nav';
                }
            } else {
                mobileStatusNavlink = 'OrderMobileStatus_Nav';
                //My Work Order Query
                orderBy = `$orderby=${mobileStatusNavlink}/MobileStatus desc,WOPartners/PersonnelNum,DueDate,Priority,MarkedJob/PreferenceValue`;
                expand = `$expand=Confirmations,Equipment,Equipment/Location_Nav,FunctionalLocation,FunctionalLocation/Location_Nav,WOPriority,Components,${mobileStatusNavlink},${mobileStatusNavlink}/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,MarkedJob,HeaderLongText,WOPartners,UserTimeEntry_Nav`;
                entitySet = 'MyWorkOrderHeaders';
                if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                    expand += ',OrderISULinks,DisconnectActivity_Nav';
                }
            }
            filter = filter + '&' + orderBy + '&' + expand + '&' + top;
            return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], filter).then(result => {
                if (result) {
                    array = sortObjectsByStatus(context, result, mobileStatusNavlink);
                }
                return array;
            });
        });
    });
}

export function sortObjectsByStatus(context, objects, mobileStatusNavlink) {
    const { STARTED, RECEIVED, HOLD, REVIEW, COMPLETED, DISAPPROVED } = MobileStatusLibrary.getMobileStatusValueConstants(context);
    const startedArray = [];
    const holdArray = [];
    const receivedArray = [];
    const reviewArray = [];
    let finalArray = [];
    let mobileStatus;

    objects.forEach(object => {
        mobileStatus = object[mobileStatusNavlink]?.MobileStatus;

        switch (mobileStatus) {
            case STARTED:
                startedArray.push(object);
                break;
            case HOLD:
                holdArray.push(object);
                break;
            case RECEIVED:
            case COMPLETED:
                receivedArray.push(object);
                break;
            case REVIEW:
            case DISAPPROVED:
                reviewArray.push(object);
                break;
            default:
                receivedArray.push(object);
                break;
        }
    });

    finalArray = startedArray.concat(holdArray, reviewArray, receivedArray);
    return finalArray;
}

export function prepareDataForMyWorkSection(context) {
    CommonLibrary.setStateVariable(context, 'UserRoleType', 'T');
    CommonLibrary.setStateVariable(context, 'StartedCount', 0);

    const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    let isUserSupervisorPromise = SupervisorLibrary.isUserSupervisor(context);
    let startedCountPromise;

    let userId = CommonLibrary.getSapUserName(context);
    let isCICOEnabled = ClockInClockOutLibrary.isCICOEnabled(context);
    let queryOption, isAnythingStartedStateVar;
    if (IsOperationLevelAssigmentType(context)) {
        isAnythingStartedStateVar = 'isAnyOperationStarted';
        queryOption = `$filter=OperationMobileStatus_Nav/MobileStatus eq '${STARTED}'`;
        if (isCICOEnabled) {
            queryOption += " and OperationMobileStatus_Nav/CreateUserId eq '" + userId + "'"; //Only find operations that we started
        }
        startedCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', queryOption);
    } else if (IsSubOperationLevelAssigmentType(context)) {
        isAnythingStartedStateVar = 'isAnySubOperationStarted';
        queryOption = `$filter=SubOpMobileStatus_Nav/MobileStatus eq '${STARTED}'`;
        if (isCICOEnabled) {
            queryOption += " and SubOpMobileStatus_Nav/CreateUserId eq '" + userId + "'"; //Only find sub-operations that we started
        }
        startedCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', queryOption);
    } else {
        isAnythingStartedStateVar = 'isAnyWorkOrderStarted';
        queryOption = `$expand=OrderMobileStatus_Nav&$filter=OrderMobileStatus_Nav/MobileStatus eq '${STARTED}'`;
        if (isCICOEnabled) {
            queryOption += " and OrderMobileStatus_Nav/CreateUserId eq '" + userId + "'"; //Only find work orders that we started
        }
        startedCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', queryOption);
    }

    return Promise.all([isUserSupervisorPromise, startedCountPromise])
        .then(([isSupervisor, startedCount]) => {
            let roletype = isSupervisor ? 'S' : 'T';
            CommonLibrary.setStateVariable(context, 'UserRoleType', roletype);
            CommonLibrary.setStateVariable(context, 'StartedCount', startedCount);
            CommonLibrary.setStateVariable(context, isAnythingStartedStateVar, startedCount > 0);
            return Promise.resolve();
        })
        .catch((error) => {
            Logger.error('prepareDataForMyWorkSection', error);
            return Promise.resolve();
        });
}
