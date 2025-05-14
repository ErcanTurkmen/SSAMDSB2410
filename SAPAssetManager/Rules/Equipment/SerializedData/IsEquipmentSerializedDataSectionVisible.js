import Logger from '../../Log/Logger';
import IsDefenseIntegrationEnabled from '../../UserFeatures/IsDefenseIntegrationEnabled';

export default async function IsEquipmentSerializedDataSectionVisible(context) {
    if (IsDefenseIntegrationEnabled(context)) {
        try {
            const serializedDataCount = await context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/SerialNumber`, '');
            return !!serializedDataCount;
        } catch (error) {
            Logger.error('IsEquipmentSerializedDataSectionVisible', error);
            return Promise.resolve(false);
        }
    }

    return Promise.resolve(false);
}
