import Logger from '../../Log/Logger';
import IsDefenseIntegrationEnabled from '../../UserFeatures/IsDefenseIntegrationEnabled';

export default async function IsEquipmentOperationalDataSectionVisible(context) {
    if (IsDefenseIntegrationEnabled(context)) {
        try {
            const operationalDataCount = await context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/MyEquipOpData_Nav`, '');
            return !!operationalDataCount;
        } catch (error) {
            Logger.error('IsEquipmentOperationalDataSectionVisible', error);
            return Promise.resolve(false);
        }
    }

    return Promise.resolve(false);
}
