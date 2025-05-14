import NotificationLibrary from '../NotificationLibrary';

export default function NotificationMainWorkCenterQueryOptions(context) {
    const defaultPlant = NotificationLibrary.NotificationCreateDefaultPlant(context);
    if (defaultPlant) {
        return `$filter=PlantId eq '${defaultPlant}'&$orderby=ExternalWorkCenterId`;
    } else {
        return '$orderby=ExternalWorkCenterId';
    }
}
