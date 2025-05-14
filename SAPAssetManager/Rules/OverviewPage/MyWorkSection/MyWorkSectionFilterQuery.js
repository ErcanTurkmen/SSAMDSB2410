import CommonLibrary from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import {GlobalVar} from '../../Common/Library/GlobalCommon';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import libVal from '../../Common/Library/ValidationLibrary';
import WorkOrderOperationsFSMQueryOption from '../../WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import libPersona from '../../Persona/PersonaLibrary';

export default function MyWorkSectionFilterQuery(context, filterPrefix = '$filter=') {
    const PARENT_FUNCTION_TYPE = 'VW';
    const DEFAULT_PERSONAL_NUMBER = '00000000';
    const STARTED = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue();
    const COMPLETED = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue();

    let personnelNum = CommonLibrary.getPersonnelNumber();
    let filter;

    return getLocallyChangedObjectsQuery(context).then((locallyChangedObjectsQuery) => {
        if (IsOperationLevelAssigmentType(context)) {
            if (!personnelNum) {
                personnelNum = DEFAULT_PERSONAL_NUMBER;
            }
            filter = `(PersonNum eq '${personnelNum}' or OperationMobileStatus_Nav/MobileStatus eq '${STARTED}') and OperationMobileStatus_Nav/MobileStatus ne '${COMPLETED}'`;

            if (locallyChangedObjectsQuery) {
                filter = `(${filter} or ${locallyChangedObjectsQuery})`;
            }
            if (libPersona.isFieldServiceTechnician(context)) {
                return WorkOrderOperationsFSMQueryOption(context).then(fsmQueryOptions => {
                    if (!libVal.evalIsEmpty(fsmQueryOptions)) {
                        filter += ' and ' + fsmQueryOptions;
                    }
                    return filterPrefix + filter;
                });
            }
        }  else if (IsSubOperationLevelAssigmentType(context)) {
            if (!personnelNum) {
                personnelNum = DEFAULT_PERSONAL_NUMBER;
            }
            filter = `(PersonNum eq '${personnelNum}' or SubOpMobileStatus_Nav/MobileStatus eq '${STARTED}') and SubOpMobileStatus_Nav/MobileStatus ne '${COMPLETED}'`;

            if (locallyChangedObjectsQuery) {
                filter = `(${filter} or ${locallyChangedObjectsQuery})`;
            }
            if (libPersona.isFieldServiceTechnician(context)) {
                return WorkOrderOperationsFSMQueryOption(context).then(fsmQueryOptions => {
                    if (!libVal.evalIsEmpty(fsmQueryOptions)) {
                        filter += ' and ' + fsmQueryOptions;
                    }
                    return filterPrefix + filter;
                });
            }
        } else {
            if (!personnelNum) {
                filter = `((not sap.entityexists(WOPartners) or WOPartners/all(w: w/PartnerFunction ne '${PARENT_FUNCTION_TYPE}')) or OrderMobileStatus_Nav/MobileStatus eq '${STARTED}' or MarkedJob/PreferenceValue eq 'true') and OrderMobileStatus_Nav/MobileStatus ne '${COMPLETED}'`;
            } else {
                filter = `((WOPartners/any(wp : wp/PartnerFunction eq '${PARENT_FUNCTION_TYPE}' and wp/PersonnelNum eq '${personnelNum}')) or OrderMobileStatus_Nav/MobileStatus eq '${STARTED}' or MarkedJob/PreferenceValue eq 'true') and OrderMobileStatus_Nav/MobileStatus ne '${COMPLETED}'`;
            }

            if (locallyChangedObjectsQuery) {
                filter = `(${filter} or ${locallyChangedObjectsQuery})`;
            }

            if (libPersona.isFieldServiceTechnician(context)) {
                return WorkOrdersFSMQueryOption(context).then(fsmQueryOptions => {
                    if (!libVal.evalIsEmpty(fsmQueryOptions)) {
                        filter += ' and ' + fsmQueryOptions;
                    }
                    return filterPrefix + filter;
                });
            }
        }

        return filterPrefix + filter;
    });
}

function getLocallyChangedObjectsQuery(context) {
    let mobileStatusObjectType;
    if (IsOperationLevelAssigmentType(context)) {
        mobileStatusObjectType = GlobalVar.getAppParam().OBJECTTYPE.Operation;
    } else if (IsSubOperationLevelAssigmentType(context)) {
        mobileStatusObjectType = GlobalVar.getAppParam().OBJECTTYPE.SubOperation;
    } else {
        mobileStatusObjectType = GlobalVar.getAppParam().OBJECTTYPE.WorkOrder;
    }

    let query = `$filter=sap.islocal() and ObjectType eq '${mobileStatusObjectType}'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'PMMobileStatuses', ['ObjectKey'], query)
        .then(result => {
            if (result && result.length) {
                return result.map(object => `ObjectKey eq '${object.ObjectKey}'`).join(' or ');
            }

            return '';
        })
        .catch(error => {
            Logger.error('getLocallyCompletedObjectsQuery', error);
            return '';
        });
}
