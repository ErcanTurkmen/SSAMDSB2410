import IsEmergencyWorkEnabled from './IsEmergencyWorkEnabled';
import IsMinorWorkEnabled from './IsMinorWorkEnabled';

export default function MinorWorkMobileStatusFilterItems(context) {
    let items = [{
        'DisplayValue': context.localizeText('regular_work'),
        'ReturnValue': 'not sap.entityexists(NotificationProcessingContext_Nav)',
    }];

    if (IsMinorWorkEnabled(context)) {
        items.push({
            'DisplayValue': context.localizeText('minor_work'),
            'ReturnValue': 'sap.entityexists(NotificationProcessingContext_Nav) and NotifProcessingContext eq \'02\'',
        });
    }

    if (IsEmergencyWorkEnabled(context)) {
        items.push({
            'DisplayValue': context.localizeText('emergency_work'),
            'ReturnValue': 'sap.entityexists(NotificationProcessingContext_Nav) and NotifProcessingContext eq \'01\'',
        });
    }

    return items;
}
