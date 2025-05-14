import { GlobalVar } from '../../Common/Library/GlobalCommon';
import libForm from '../../Common/Library/FormatLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function TransferToListItems(context) {
    const isS4ServiceEnabled = IsS4ServiceIntegrationEnabled(context);
    const assnType = isS4ServiceEnabled ? libCommon.getS4AssignmentType(context) : libCommon.getWorkOrderAssignmentType(context);
    if (isS4ServiceEnabled) {
        switch (assnType) {
            case '1':
            case '2':
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'S4BusinessPartners', [], '$filter=BPType eq \'0003\'').then(function(result) {
                    if (result && result.length > 0) {
                        let returnValue = [];
                        result.forEach(function(value) {
                            if (value.UserName !== GlobalVar.getUserSystemInfo().get('SAP_USERID'))
                                returnValue.push({ DisplayValue: libForm.getFormattedKeyDescriptionPair(context, value.BPNum, value.FullName || `${value.FirstName} ${value.LastName}`.trim()), ReturnValue: value.BPNum });
                        });
                        return returnValue;
                    } else {
                        return [];
                    }
                });
            default:
                break;
        }
    } else {
        switch (assnType) {
            case '1':
            case '2':
            case '3':
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'Employees', [], '$orderby=EmployeeName').then(function(result) {
                    if (result && result.length > 0) {
                        let returnValue = [];
                        result.forEach(function(value) {
                            if (value.PersonnelNumber !== GlobalVar.getUserSystemInfo().get('PERNO'))
                                returnValue.push({DisplayValue: libForm.getFormattedKeyDescriptionPair(context,value.PersonnelNumber,value.EmployeeName), ReturnValue: value.PersonnelNumber});
                        });
                        return returnValue;
                    } else {
                        return [];
                    }
                });
            case '7':
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'SAPUsers', [], '$orderby=UserId').then(function(result) {
                    if (result && result.length > 0) {
                        let returnValue = [];
                        result.forEach(function(value) {
                            if (value.UserId!== libCommon.getSapUserName(context) && (!libVal.evalIsEmpty(value.UserId))) {
                                returnValue.push({DisplayValue: value.UserId, ReturnValue: value.UserId});
                            }
                        });
                        return returnValue;
                    } else {
                        return [];
                    }
                });
            case '6':
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], '$orderby=ExternalWorkCenterId').then(function(result) {
                    if (result && result.length > 0) {
                        let returnValue = [];
                        result.forEach(function(value) {
                            if (value.ExternalWorkCenterId !== libCommon.getDefaultUserParam('USER_PARAM.VAP'))
                                returnValue.push({DisplayValue: `${value.PlantId} - ${value.ExternalWorkCenterId}:${value.WorkCenterDescr}`, ReturnValue: value.ExternalWorkCenterId + '|' + value.PlantId});
                        });
                        return returnValue;
                    } else {
                        return [];
                    }
                });
            case '8':
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], '$orderby=ExternalWorkCenterId').then(function(result) {
                    if (result && result.length > 0) {
                        let returnValue = [];
                        result.forEach(function(value) {
                            if (value.ExternalWorkCenterId !== libCommon.getDefaultUserParam('USER_PARAM.AGR'))
                                returnValue.push({DisplayValue: `${value.PlantId} - ${value.ExternalWorkCenterId}:${value.WorkCenterDescr}`, ReturnValue: value.ExternalWorkCenterId + '|' + value.PlantId});
                        });
                        return returnValue;
                    } else {
                        return [];
                    }
                });
            case '4':
                break;
            case '5':
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'PlannerGroups', [], '$orderby=PlannerGroupName').then(function(result) {
                    if (result && result.length > 0) {
                        let returnValue = [];
                        result.forEach(function(value) {
                            if (value.ExternalWorkCenterId !== libCommon.getDefaultUserParam('USER_PARAM.IHG'))
                                returnValue.push({DisplayValue: value.PlannerGroupName, ReturnValue: value.PlannerGroup});
                        });
                        return returnValue;
                    } else {
                        return [];
                    }
                });
            case 'A':
                break;
            default:
                break;
        }
    }
}
