import libCom from '../Common/Library/CommonLibrary';

export default function MobileStatusReadLink(context) {
    let binding = context.getActionBinding();

    if (!binding) {
        binding = context.binding ? context.binding : libCom.getStateVariable(context, 'SupervisorRejectReadLink');

    }

    if (binding) {
        switch (binding['@odata.type']) {
            case '#sap_mobile.MyWorkOrderHeader': {
                if (binding.OrderMobileStatus_Nav) {
                    return binding.OrderMobileStatus_Nav['@odata.readLink'];
                }
                return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/OrderMobileStatus_Nav', [], '').then(function(result) {
                    return result.getItem(0)['@odata.readLink'];
                });
            }
            case '#sap_mobile.MyWorkOrderOperation': {
                if (binding.OperationMobileStatus_Nav) {
                    return binding.OperationMobileStatus_Nav['@odata.readLink'];
                }
                break;
            }
            case '#sap_mobile.MyWorkOrderSubOperation': {
                if (binding.SubOpMobileStatus_Nav) {
                    return binding.SubOpMobileStatus_Nav['@odata.readLink'];
                }
                break;
            }
            case '#sap_mobile.MyNotificationHeader': {
                if (binding.NotifMobileStatus_Nav) {
                    return binding.NotifMobileStatus_Nav['@odata.readLink'];
                }
                break;
            }
            case '#sap_mobile.MyNotificationTask': {
                if (binding.TaskMobileStatus_Nav) {
                    return binding.TaskMobileStatus_Nav['@odata.readLink'];
                }
                break;
            }
            case '#sap_mobile.MyNotificationItemTask': {
                if (binding.ItemTaskMobileStatus_Nav) {
                    return binding.ItemTaskMobileStatus_Nav['@odata.readLink'];
                }
                break;
            }
            case '#sap_mobile.S4ServiceOrder': {
                if (binding.MobileStatus_Nav) {
                    return binding.MobileStatus_Nav['@odata.readLink'];
                }
                return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/MobileStatus_Nav', [], '').then(function(result) {
                    return result.getItem(0)['@odata.readLink'];
                });
            }
            case '#sap_mobile.S4ServiceItem': {
                if (binding.MobileStatus_Nav) {
                    return binding.MobileStatus_Nav['@odata.readLink'];
                }
                break;
            }
            default:
                if (binding.MobileStatus) {
                    return binding.MobileStatus['@odata.readlink'];
                }
        }
    }
    return '';
}
