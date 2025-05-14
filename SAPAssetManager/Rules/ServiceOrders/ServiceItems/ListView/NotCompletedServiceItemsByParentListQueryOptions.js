import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { SplitReadLink } from '../../../Common/Library/ReadLinkUtils';
import ServiceConfirmationLibrary from '../../../ServiceConfirmations/CreateUpdate/ServiceConfirmationLibrary';

export default function NotCompletedServiceItemsByParentListQueryOptions(context) {
    const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

    const OrderLink = ServiceConfirmationLibrary.getInstance().getConnectedServiceOrder();
    let objectID = '';
    if (OrderLink) {
        if (CommonLibrary.isCurrentReadLinkLocal(OrderLink)) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', OrderLink, [], '$select=ObjectID').then(result => {
                if (result.length) {
                    objectID = result.getItem(0).ObjectID;
                }
    
                return `$expand=MobileStatus_Nav&$filter=MobileStatus_Nav/MobileStatus ne '${COMPLETED}' and ObjectID eq '${objectID}'`;
            });
        } else {
            objectID = SplitReadLink(OrderLink).ObjectID;
        }
    } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        objectID = context.binding.ObjectID;
    } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmation') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/TransHistories_Nav', [], '$filter=sap.entityexists(S4ServiceOrder_Nav)').then(result => {
            if (result.length) {
                objectID = result.getItem(0).RelatedObjectID;
            }

            return `$expand=MobileStatus_Nav&$filter=MobileStatus_Nav/MobileStatus ne '${COMPLETED}' and ObjectID eq '${objectID}'`;
        });
    }

    return Promise.resolve(`$expand=MobileStatus_Nav&$filter=MobileStatus_Nav/MobileStatus ne '${COMPLETED}' and ObjectID eq '${objectID}'`);
}
