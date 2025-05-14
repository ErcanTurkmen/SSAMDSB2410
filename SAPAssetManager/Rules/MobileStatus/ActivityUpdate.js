import libCom from '../Common/Library/CommonLibrary';
import libFeature from '../UserFeatures/UserFeaturesLibrary';

export default function ActivityUpdate(context, binding = context.binding, updateToStatus) {
    const STARTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const isMeterEnabled = libFeature.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue());
    const orderISULinks = getOrderISULinks(context, binding);

    // If ISU disconnect/reconnect, show activity update dialog only on start
    if (updateToStatus.MobileStatus === STARTED && isMeterEnabled && orderISULinks?.length > 0) {
        const isuProcess = orderISULinks[0].ISUProcess;

        if (isuProcess === 'DISCONNECT' || isuProcess === 'RECONNECT') {
            let entityType = '';
            switch (binding['@odata.type']) {
                case '#sap_mobile.MyWorkOrderHeader':
                    entityType = binding.DisconnectActivity_Nav[0]['@odata.readLink'];
                    break;
                case '#sap_mobile.MyWorkOrderOperation':
                    entityType = binding.WOHeader.DisconnectActivity_Nav[0]['@odata.readLink'];
                    break;
                case '#sap_mobile.MyWorkOrderSubOperation':
                    entityType = binding.WorkOrderOperation.WOHeader.DisconnectActivity_Nav[0]['@odata.readLink'];
                    break;
            }
            const queryOption = '$expand=DisconnectActivityType_Nav,DisconnectActivityStatus_Nav,WOHeader_Nav/OrderMobileStatus_Nav,WOHeader_Nav/OrderISULinks';
            return libCom.navigateOnRead(context, '/SAPAssetManager/Actions/WorkOrders/Meter/Activity/ActivityUpdateNav.action', entityType, queryOption);
        }

        return Promise.resolve();
    }
    return Promise.resolve();
}

function getOrderISULinks(context, binding) {
    if (binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue()) {
        return binding?.WOHeader?.OrderISULinks;
    }

    return binding?.OrderISULinks;
}
