import { SEQUENCE_ITEMS_NAMES } from '../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass';
import MobileStatusUpdateResultsClass from './MobileStatusUpdateResultsClass';

export default function MobileStatusHistoryCreate(context) {
    const updateResult = MobileStatusUpdateResultsClass.getInstance().getActionResult(SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE);
    const properties = {
        'MobileStatus': updateResult.MobileStatus,
        'Status': updateResult.Status,
        'EffectiveTimestamp': updateResult.EffectiveTimestamp,
        'CreateUserGUID': updateResult.CreateUserGUID,
        'CreateUserId': updateResult.CreateUserId,
    };
    const readLink = updateResult['@odata.readLink'];

    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusHistoryUpdate.action', 
        'Properties': {
            'Properties': properties,
            'CreateLinks': [
                {
                    'Property': 'PMMobileStatus_Nav',
                    'Target':
                    {
                        'EntitySet': 'PMMobileStatuses',
                        'ReadLink': readLink,
                    },
                },
            ],
        },
    });
}
