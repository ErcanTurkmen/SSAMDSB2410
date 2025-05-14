import isDefenseEnabled from '../../../Defense/isDefenseEnabled';

export default function SerialUUID(context) {
    if (isDefenseEnabled(context)) {  //Only show UUID if defense feature is enabled
        let id = context.binding?.UniversalItemId || context.binding?.UniqueItemIdentifier;

        if (id) {
            return context.localizeText('uuid', [id]);
        }
    }
    return '';
}
