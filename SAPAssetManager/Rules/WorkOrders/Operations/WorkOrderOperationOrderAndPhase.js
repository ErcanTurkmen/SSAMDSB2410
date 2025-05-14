import PhaseControlVisible from '../PhaseControl/PhaseControlVisible';
import Logger from '../../Log/Logger';

export default async function WorkOrderOperationOrderAndPhase(context) {
    const binding = context.binding;
    const orderId = binding?.OrderId || '';
    const orderType = binding?.OrderType || '';

    const baseOrderInfo = getOrderInfo(orderId, orderType);

    if (PhaseControlVisible(context) && binding) {
        const mobileStatusEntityNav = binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader' ? 'OrderMobileStatus_Nav' : 'OperationMobileStatus_Nav';
        const mobileStatusEntity = binding[mobileStatusEntityNav];

        let phaseDesc = mobileStatusEntity?.OverallStatusCfg_Nav?.PhaseDesc || '';

        if (!phaseDesc) {
            try {
                const statusReadLink = mobileStatusEntity?.['@odata.readLink'] ?? `${binding['@odata.readLink']}/${mobileStatusEntityNav}`;
                const result = await context.read('/SAPAssetManager/Services/AssetManager.service', `${statusReadLink}/OverallStatusCfg_Nav`, ['PhaseDesc'], '');

                if (result.length) {
                    phaseDesc = result.getItem(0).PhaseDesc;
                }
            } catch (error) {
                Logger.error('EAMOverallStatusConfigs', error);
                return baseOrderInfo || '-';
            }
        }

        return `${baseOrderInfo}${phaseDesc ? (baseOrderInfo ? ' - ' : '') + phaseDesc : ''}`;
    }
    
    return baseOrderInfo;
}

function getOrderInfo(orderId, orderType) {
    return `${orderId}${orderId && orderType ? ' - ' + orderType : orderType}`;
}
