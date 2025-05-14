/**
* Describe this function...
* @param {IClientAPI} context
*/
import GetResource from './GetResource';
import GetWarehouseNumber from './GetWarehouseNumber';
import libCom from '../../Common/Library/CommonLibrary';
import libEval from '../../Common/Library/ValidationLibrary';
export default async function OnResourceButtonPress(context) {
    const binding = context.getPageProxy().getActionBinding();
    let userName = binding?.User ? '' : libCom.getSapUserName(context);
    const warehouseNo = binding?.WarehouseNo ? binding.WarehouseNo : GetWarehouseNumber(context);
    const resource = await (binding?.Resource ? binding.Resource : GetResource(context));
    
    return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'WarehouseResources', [], `$filter=WarehouseNo eq '${warehouseNo}' and Resource eq '${resource}'`).then((results) => {
        if (!libEval.evalIsEmpty(results)) {
            context.getPageProxy().setActionBinding(results.getItem(0));
            userName = userName === results.getItem(0).User ? '' : userName;
            const warningID = userName ? 'claim_warning_x' : 'release_warning_x';
            const warningTitle = userName ? 'claim_resource' : 'release_resource';
            const messageText = context.localizeText(warningID, [resource]);
            const captionText = context.localizeText(warningTitle);

            //Prompt user with claim/release warning dialog
            return libCom.showWarningDialog(context, messageText, captionText).then(result => {
                if (result === true) {
                    return context.executeAction({
                        'Name': '/SAPAssetManager/Actions/EWM/Resource/SwitchResourceUpdate.action', 'Properties': {
                            'Properties': {
                                'WarehouseNo': warehouseNo,
                                'Resource': resource,
                                'User': userName,
                            },
                        },
                    });
                }
                return false;
            }).catch(function() {
                return false; //User terminated out of warning dialog
            });
        }
        return '';
    });

}
