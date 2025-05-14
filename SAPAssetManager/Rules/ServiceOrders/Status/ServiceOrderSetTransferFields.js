import CommonLibrary from '../../Common/Library/CommonLibrary';
import { GlobalVar } from '../../Common/Library/GlobalCommon';
import S4Lib from '../S4ServiceLibrary';
import S4MobileStatusUpdateOverride from './S4MobileStatusUpdateOverride';

export default function ServiceOrderSetTransferFields(context) {
    const binding = context.binding;
    const TRANSFER = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
    const employeeRespType = S4Lib.getServiceEmployeeRespType(context);
    const objectType = S4Lib.getServiceOrderObjectType(context);
    const userID = GlobalVar.getUserSystemInfo().get('SAP_USERID');
    let rulePromises = [];

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'S4BusinessPartners', [], `$filter=UserName eq '${userID}'&$select=BPNum`).then((value) => {
        if (value && value.length > 0) {
            let props = {
                'ObjectID': binding.ObjectID,
                'ItemNo': binding.ItemNo,
                'ObjectType': objectType,
                'BusinessPartnerID': context.evaluateTargetPath('#Control:TransferToLstPkr/#Value')[0].ReturnValue,
                'PrevPartnerNo': value.getItem(0).BPNum,
                'PartnerFunction': employeeRespType,
                'PrevPartnerFunction': employeeRespType,
            };

            for (let key in props) {
                if (props[key] === undefined)
                    delete props[key];
            }

            let links = [];

            if (props.ItemNo) {
                links.push({
                    'Property': 'S4ServiceItem_Nav',
                    'Target': {
                        'EntitySet': 'S4ServiceItems',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': binding['@odata.readLink'],
                    },
                });
            } else {
                links.push({
                    'Property': 'S4ServiceOrder_Nav',
                    'Target': {
                        'EntitySet': 'S4ServiceOrders',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': binding['@odata.readLink'],
                    },
                });
            }
            links.push({
                'Property': 'S4PartnerFunc_Nav',
                'Target': {
                    'EntitySet': 'S4PartnerFunctions',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': `S4PartnerFunctions(ObjectType='${objectType}',PartnerFunction='${props.PartnerFunction}')`,
                },
            });

            rulePromises.push(context.executeAction({
                'Name': '/SAPAssetManager/Actions/ServiceOrders/S4ServiceOrderPartnerCreate.action', 'Properties': {
                    'Properties': props,
                    'CreateLinks': links,
                    'OnSuccess': '',
                    'OnFailure': '',
                },
            }));

            rulePromises.push(context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/MobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav`, [], `$filter=NextOverallStatusCfg_Nav/MobileStatus eq '${TRANSFER}'&$expand=NextOverallStatusCfg_Nav`).then(result => {
                if (result.length > 0) {
                    // May be more than one result due to Supervisor feature, but both NextOverallStatus_Nav's will be the same
                    return context.executeAction(S4MobileStatusUpdateOverride(context, context.binding, result.getItem(0).NextOverallStatusCfg_Nav));
                } else {
                    return {};
                }
            }));

            return Promise.all(rulePromises).then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            });
        }
        return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
    }).catch(() => {
        return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
    });

}
