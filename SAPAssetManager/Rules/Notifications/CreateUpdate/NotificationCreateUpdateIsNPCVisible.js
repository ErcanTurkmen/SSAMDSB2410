import IsMinorWorkEnabled from '../../WorkOrders/IsMinorWorkEnabled';

export default function NotificationCreateUpdateIsNPCVisible(context) {
    return IsMinorWorkEnabled(context) && context.count('/SAPAssetManager/Services/AssetManager.service', 'NotificationProcessingContexts', '').then(count => count > 0).catch(() => false);
}
