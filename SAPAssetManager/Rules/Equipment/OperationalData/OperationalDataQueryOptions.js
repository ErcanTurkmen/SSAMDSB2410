import IsDefenseIntegrationEnabled from '../../UserFeatures/IsDefenseIntegrationEnabled';

export default function OperationalDataQueryOptions(context) {
    return IsDefenseIntegrationEnabled(context) ? '$expand=MyEquipOpData_Nav' : '';
}
